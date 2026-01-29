---
layout: post
title: "Fine-tuning LLMs con LoRA y PEFT"
date: 2026-01-27 11:00:00 -0600
category: Machine Learning
tags: [fine-tuning, lora, peft, llm, parameter-efficient, quantization]
excerpt: "Aprende a fine-tunear modelos grandes de manera eficiente con LoRA, QLoRA y PEFT. Reduce memory footprint de 40GB a 8GB manteniendo performance."
image: /assets/images/posts/lora-finetuning.jpg
reading_time: 13 min
---

Fine-tuning completo de LLMs requiere **cientos de GB de VRAM** y días de entrenamiento. **LoRA** (Low-Rank Adaptation) resuelve esto ajustando solo un 0.1% de losparámetros con resultados casi idénticos.

## El Problema del Fine-tuning Tradicional

```python
# Full fine-tuning de LLaMA-7B
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf")

# Problema:
# - 7B parámetros × 4 bytes = 28 GB solo del modelo
# - + Gradientes (28 GB) + Optimizer states (56 GB) = 112 GB VRAM total
# - Training time: ~40 horas en 8x A100
# - Costo: ~$500-1000
```

**¿La solución?** Parameter-Efficient Fine-Tuning (PEFT)

## ¿Qué es LoRA?

LoRA congela el modelo pre-entrenado y agrega matrices de **bajo rango** (low-rank) que se entrenan:

```
W = W₀ + ΔW
ΔW = BA

Donde:
- W₀: pesos originales (frozen)
- B: matriz d × r (trainable)
- A: matriz r × k (trainable)
- r << min(d, k) (rango bajo, típicamente 8-64)
```

### Ventajas de LoRA

| Métrica | Full Fine-tuning | LoRA (r=16) |
|---------|-----------------|-------------|
| **Parámetros entrenables** | 7B (100%) | 8.4M (0.12%) |
| **VRAM requerida** | 112 GB | 12 GB |
| **Training time** | 40h | 6h |
| **Costo** | $800 | $60 |
| **Performance** | 100% | 97-99% |

## Implementación con PEFT

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset
import torch

# 1. Cargar modelo base
model_name = "meta-llama/Llama-2-7b-hf"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    load_in_8bit=True,  # Cuantización para ahorrar memoria
    device_map="auto",
    torch_dtype=torch.float16
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 2. Configurar LoRA
lora_config = LoraConfig(
    r=16,                    # Rank (dimensión del low-rank)
    lora_alpha=32,           # Scaling factor (típ. 2×r)
    target_modules=[         # Qué layers modificar
        "q_proj",            # Query projection
        "k_proj",            # Key projection
        "v_proj",            # Value projection
        "o_proj"             # Output projection
    ],
    lora_dropout=0.05,       # Dropout para regularización
    bias="none",             # No entrenar bias
    task_type="CAUSAL_LM"    # Tipo de tarea
)

# 3. Preparar modelo para training
model = prepare_model_for_kbit_training(model)
model = get_peft_model(model, lora_config)

# Verificar parámetros entrenables
model.print_trainable_parameters()
# Output: trainable params: 8.4M || all params: 6.74B || trainable%: 0.124%

# 4. Cargar dataset
dataset = load_dataset("json", data_files="training_data.json")

def format_instruction(example):
    """Formato tipo Alpaca"""
    return f"""### Instruction:
{example['instruction']}

### Input:
{example['input']}

### Response:
{example['output']}"""

def tokenize_function(examples):
    texts = [format_instruction(ex) for ex in examples]
    return tokenizer(
        texts,
        truncation=True,
        max_length=2048,
        padding="max_length"
    )

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# 5. Training arguments
training_args = TrainingArguments(
    output_dir="./lora_results",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=10,
    save_steps=100,
    evaluation_strategy="steps",
    eval_steps=100,
    warmup_steps=100,
    optim="adamw_torch"
)

# 6. Entrenar
from transformers import Trainer

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["validation"]
)

trainer.train()

# 7. Guardar adaptadores LoRA (solo 16-32 MB!)
model.save_pretrained("./lora_adapter")
tokenizer.save_pretrained("./lora_adapter")
```

## QLoRA: LoRA + Cuantización

**QLoRA** combina LoRA con cuantización de 4 bits:

```python
from transformers import BitsAndBytesConfig

# Configurar cuantización 4-bit
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",           # Normal Float 4
    bnb_4bit_use_double_quant=True,      # Double quantization
    bnb_4bit_compute_dtype=torch.bfloat16
)

# Cargar modelo cuantizado
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    quantization_config=bnb_config,
    device_map="auto"
)

# Resultado:
# - LLaMA-7B en 4-bit: ~4.5 GB VRAM
# - + LoRA adapters: ~500 MB
# - Total: ~5 GB VRAM (puedes fine-tunear en una RTX 3090!)
```

### Comparación: LoRA vs QLoRA

| Configuración | VRAM | Training Time | Performance |
|--------------|------|---------------|-------------|
| Full FP32 | 112 GB | 40h | 100% |
| LoRA FP16 | 12 GB | 6h | 98% |
| QLoRA 8-bit | 8 GB | 7h | 97% |
| QLoRA 4-bit | 5 GB | 8h | 95% |

## Hiperparámetros Clave

### 1. Rango (r)

```python
# r = rank de las matrices low-rank
# Trade-off: performance vs memory

configs = {
    "tiny": LoraConfig(r=8),      # ~4M params, menos expresivo
    "small": LoraConfig(r=16),    # ~8M params, balance óptimo
    "medium": LoraConfig(r=32),   # ~16M params, más expresivo
    "large": LoraConfig(r=64)     # ~32M params, casi full fine-tuning
}

# Recomendación: empezar con r=16, subir si no converge
```

### 2. Alpha (α)

```python
# Scaling factor: ΔW × (α/r)
# Controla la "fuerza" de los adapters

lora_config = LoraConfig(
    r=16,
    lora_alpha=32  # Típicamente α = 2×r (estándar)
)

# α < 2r: adapters más sutiles (menos overfitting)
# α = 2r: balance recomendado
# α > 2r: adapters más agresivos (útil para datasets pequeños)
```

### 3. Target Modules

```python
# ¿Qué layers modificar con LoRA?

# Opción 1: Solo attention (más eficiente)
target_modules = ["q_proj", "v_proj"]

# Opción 2: Todas las proyecciones de attention (recomendado)
target_modules = ["q_proj", "k_proj", "v_proj", "o_proj"]

# Opción 3: Attention + FFN (máximo performance)
target_modules = [
    "q_proj", "k_proj", "v_proj", "o_proj",
    "gate_proj", "up_proj", "down_proj"
]

# Trade-off: más modules = mejor performance pero más VRAM
```

## Inference con LoRA

```python
from peft import PeftModel

# 1. Cargar modelo base
base_model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    load_in_8bit=True,
    device_map="auto"
)

# 2. Cargar adaptadores LoRA
model = PeftModel.from_pretrained(base_model, "./lora_adapter")

# 3. Generar texto
tokenizer = AutoTokenizer.from_pretrained("./lora_adapter")
inputs = tokenizer("### Instruction: Explica qué es LoRA\n\n### Response:", return_tensors="pt")
outputs = model.generate(**inputs, max_length=512)
print(tokenizer.decode(outputs[0]))

# 4. (Opcional) Merge adapters con modelo base para deployment
model = model.merge_and_unload()
model.save_pretrained("./merged_model")
```

## Otras Técnicas PEFT

### 1. Prefix Tuning

```python
from peft import PrefixTuningConfig

config = PrefixTuningConfig(
    task_type="CAUSAL_LM",
    num_virtual_tokens=20,  # Tokens "virtuales" prepended
    encoder_hidden_size=4096
)

# Entrena embeddings virtuales en lugar de pesos del modelo
```

### 2. Prompt Tuning

```python
from peft import PromptTuningConfig

config = PromptTuningConfig(
    task_type="CAUSAL_LM",
    num_virtual_tokens=8,
    prompt_tuning_init="TEXT",
    prompt_tuning_init_text="Classify if the sentiment is positive or negative:"
)

# Similar a prefix tuning pero más simple
```

### 3. AdaLoRA (Adaptive LoRA)

```python
from peft import AdaLoraConfig

config = AdaLoraConfig(
    r=8,
    target_r=4,  # Rank objetivo dinámico
    init_r=12,   # Rank inicial
    tinit=200,   # Steps para adaptar rank
    tfinal=1000
)

# Ajusta automáticamente el rank durante training
```

## Dataset Preparation

```python
def prepare_instruction_dataset(examples):
    """
    Formato Alpaca para instruction following
    """
    formatted = []
    for ex in examples:
        text = f"""Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction:
{ex['instruction']}

### Input:
{ex['input'] if 'input' in ex else ''}

### Response:
{ex['output']}"""
        formatted.append(text)
    return formatted

# Ejemplo de dataset JSON
training_data = [
    {
        "instruction": "Explica qué es machine learning",
        "input": "",
        "output": "Machine learning es una rama de la IA que..."
    },
    {
        "instruction": "Traduce al español",
        "input": "Hello world",
        "output": "Hola mundo"
    }
]
```

## Monitoreo y Evaluación

```python
from transformers import TrainerCallback
import wandb

class LoRAMetricsCallback(TrainerCallback):
    def on_log(self, args, state, control, logs=None, **kwargs):
        if logs:
            # Log a Weights & Biases
            wandb.log({
                "train_loss": logs.get("loss"),
                "learning_rate": logs.get("learning_rate"),
                "epoch": logs.get("epoch")
            })
            
            # Verificar overfitting
            if "eval_loss" in logs and "loss" in logs:
                gap = logs["loss"] - logs["eval_loss"]
                if gap > 0.5:
                    print("⚠️ Posible overfitting detectado")

# Agregar al trainer
training_args.callbacks = [LoRAMetricsCallback()]
```

## Best Practices

### 1. Learning Rate

```python
# Full fine-tuning: 5e-6 típico
# LoRA: 10-100× más alto

learning_rates = {
    "conservative": 1e-4,  # Datasets grandes
    "standard": 2e-4,      # Recomendado
    "aggressive": 5e-4     # Datasets pequeños
}
```

### 2. Batch Size y Gradient Accumulation

```python
# Effective batch size = per_device × accumulation × num_gpus

training_args = TrainingArguments(
    per_device_train_batch_size=2,  # Lo que cabe en VRAM
    gradient_accumulation_steps=8,   # Accumular gradientes
    # Effective batch size = 2 × 8 × 1 = 16
)
```

### 3. Warmup

```python
# Warmup evita inestabilidad inicial

training_args = TrainingArguments(
    warmup_steps=100,  # O warmup_ratio=0.1
    # LR gradualmente de 0 → max_lr en primeros 100 steps
)
```

## Caso de Uso Real

```python
# Fine-tune LLaMA-7B para responder preguntas médicas

# 1. Dataset
medical_data = load_dataset("medmcqa")

# 2. Configuración QLoRA
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    load_in_4bit=True,
    device_map="auto"
)

lora_config = LoraConfig(
    r=32,  # Rank más alto para dominio específico
    lora_alpha=64,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.1
)

# 3. Entrenar 3 epochs
trainer.train()

# Resultado:
# - Accuracy: 68% → 84% (+16%)
# - Training time: 4 horas en 1× RTX 4090
# - Costo: ~$5
```

## Conclusión

LoRA y PEFT democratizan el fine-tuning de LLMs:

- ✅ **100× menos memoria**: fine-tunea LLaMA-7B en una RTX 3090
- ✅ **10× más rápido**: 6h vs 40h
- ✅ **20× más barato**: $60 vs $800
- ✅ **97-99% de performance** vs full fine-tuning

**Cuándo usar LoRA:**
- Adaptar LLM a dominio específico (medicina, legal, código)
- Instruction following personalizado
- Multi-task learning (múltiples adapters)
- Rapid prototyping

**Recursos:**
- [Paper: LoRA](https://arxiv.org/abs/2106.09685)
- [Paper: QLoRA](https://arxiv.org/abs/2305.14314)
- [PEFT Library](https://github.com/huggingface/peft)
- [Colab Demo](https://colab.research.google.com/drive/finetune-llama-lora)

---

**Próximo:** MLOps pipelines para entrenar, versionar y deployar modelos en producción.
