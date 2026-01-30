---
layout: post
title: "Transformers: La Arquitectura que Revolucionó la IA"
date: 2026-01-25 10:00:00 -0600
category: Deep Learning
tags: [transformers, attention, nlp, deep-learning, architecture]
excerpt: "Guía completa sobre la arquitectura Transformer: self-attention, multi-head attention, positional encoding y cómo GPT y BERT revolucionaron el NLP."
image: https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800
reading_time: 12 min
---

La arquitectura **Transformer**, presentada en el paper "Attention is All You Need" (Vaswani et al., 2017), revolucionó el procesamiento del lenguaje natural y se convirtió en la base de modelos como GPT, BERT, T5 y prácticamente todos los LLMs modernos.

## ¿Por Qué Transformers?

Antes de Transformers, las arquitecturas dominantes eran **RNNs** (Recurrent Neural Networks) y **LSTMs** (Long Short-Term Memory), que procesaban secuencias de manera secuencial. Esto tenía dos problemas críticos:

1. **Dependencia secuencial**: No se podía paralelizar el entrenamiento
2. **Problema del gradiente**: Dificultad para capturar dependencias largas

Transformers eliminó ambos problemas con un mecanismo revolucionario: **Self-Attention**.

## Arquitectura General

```python
class Transformer(nn.Module):
    def __init__(self, d_model=512, nhead=8, num_layers=6):
        super().__init__()
        self.encoder = TransformerEncoder(num_layers)
        self.decoder = TransformerDecoder(num_layers)
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.positional_encoding = PositionalEncoding(d_model)
        
    def forward(self, src, tgt):
        # Embedding + Positional Encoding
        src = self.positional_encoding(self.embedding(src))
        tgt = self.positional_encoding(self.embedding(tgt))
        
        # Encoder -> Decoder
        memory = self.encoder(src)
        output = self.decoder(tgt, memory)
        return output
```

### Componentes Clave

1. **Input Embedding**: Convierte tokens a vectores densos
2. **Positional Encoding**: Inyecta información de posición
3. **Encoder Stack**: 6 capas idénticas (en el paper original)
4. **Decoder Stack**: 6 capas idénticas con masked attention
5. **Output Linear + Softmax**: Predicción final

## Self-Attention Mechanism

El corazón de Transformers es el mecanismo de **self-attention**:

```python
import torch
import torch.nn as nn
import math

class SelfAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.head_dim = d_model // num_heads
        
        # Linear projections
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def forward(self, x, mask=None):
        batch_size, seq_len, d_model = x.shape
        
        # Linear projections in batch from d_model => h x d_k
        Q = self.W_q(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        K = self.W_k(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        V = self.W_v(x).view(batch_size, seq_len, self.num_heads, self.head_dim)
        
        # Transpose for attention: (batch, num_heads, seq_len, head_dim)
        Q = Q.transpose(1, 2)
        K = K.transpose(1, 2)
        V = V.transpose(1, 2)
        
        # Scaled Dot-Product Attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        attention_weights = torch.softmax(scores, dim=-1)
        attention_output = torch.matmul(attention_weights, V)
        
        # Concatenate heads
        attention_output = attention_output.transpose(1, 2).contiguous()
        attention_output = attention_output.view(batch_size, seq_len, d_model)
        
        # Final linear projection
        output = self.W_o(attention_output)
        return output, attention_weights
```

### Scaled Dot-Product Attention

La fórmula matemática es:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

**¿Por qué dividir por √d_k?**
- Evita que los productos punto sean muy grandes
- Mejora la estabilidad del gradiente
- Previene que softmax sature

## Multi-Head Attention

En lugar de una sola atención, Transformers usa **múltiples cabezas** en paralelo:

```python
# 8 heads con d_model=512 => cada head procesa 64 dimensiones
num_heads = 8
d_model = 512
head_dim = d_model // num_heads  # 64

# Ventajas:
# 1. Captura diferentes representaciones
# 2. Permite al modelo atender a diferentes posiciones simultáneamente
# 3. Aprende patrones complementarios
```

## Positional Encoding

Como Transformers **no tiene recurrencia**, necesita inyectar información de posición:

```python
import numpy as np

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000):
        super().__init__()
        
        # Crear matriz de positional encodings
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        
        # Fórmula del paper original
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model)
        )
        
        pe[:, 0::2] = torch.sin(position * div_term)  # Posiciones pares
        pe[:, 1::2] = torch.cos(position * div_term)  # Posiciones impares
        
        pe = pe.unsqueeze(0)  # (1, max_len, d_model)
        self.register_buffer('pe', pe)
        
    def forward(self, x):
        # x shape: (batch_size, seq_len, d_model)
        x = x + self.pe[:, :x.size(1), :]
        return x
```

**Ventajas de esta codificación:**
- Determinística (no se aprende)
- Permite extrapolar a secuencias más largas
- Captura relaciones relativas entre posiciones

## Feed-Forward Network

Cada capa del encoder/decoder tiene una FFN:

```python
class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff=2048, dropout=0.1):
        super().__init__()
        self.linear1 = nn.Linear(d_model, d_ff)
        self.dropout = nn.Dropout(dropout)
        self.linear2 = nn.Linear(d_ff, d_model)
        self.activation = nn.ReLU()
        
    def forward(self, x):
        # FFN(x) = max(0, xW1 + b1)W2 + b2
        x = self.linear1(x)
        x = self.activation(x)
        x = self.dropout(x)
        x = self.linear2(x)
        return x
```

## Layer Normalization y Residual Connections

```python
class EncoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        self.self_attn = MultiHeadAttention(d_model, num_heads)
        self.feed_forward = FeedForward(d_model, d_ff)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout1 = nn.Dropout(dropout)
        self.dropout2 = nn.Dropout(dropout)
        
    def forward(self, x, mask=None):
        # Multi-Head Attention + Residual + Norm
        attn_output, _ = self.self_attn(x, mask)
        x = x + self.dropout1(attn_output)  # Residual connection
        x = self.norm1(x)                    # Layer normalization
        
        # Feed-Forward + Residual + Norm
        ff_output = self.feed_forward(x)
        x = x + self.dropout2(ff_output)     # Residual connection
        x = self.norm2(x)                    # Layer normalization
        
        return x
```

## Diferencias: Encoder vs Decoder

### Encoder
- **Self-attention bidireccional**: puede ver toda la secuencia
- Usado en BERT, RoBERTa (modelos encoder-only)

### Decoder
- **Masked self-attention**: solo ve tokens anteriores
- **Cross-attention**: atiende a la salida del encoder
- Usado en GPT (decoder-only), T5 (encoder-decoder)

```python
class DecoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        self.self_attn = MultiHeadAttention(d_model, num_heads)
        self.cross_attn = MultiHeadAttention(d_model, num_heads)
        self.feed_forward = FeedForward(d_model, d_ff)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.norm3 = nn.LayerNorm(d_model)
        
    def forward(self, x, encoder_output, src_mask=None, tgt_mask=None):
        # Masked Self-Attention (solo ve pasado)
        attn_output, _ = self.self_attn(x, tgt_mask)
        x = self.norm1(x + attn_output)
        
        # Cross-Attention (atiende al encoder)
        attn_output, _ = self.cross_attn(x, encoder_output, src_mask)
        x = self.norm2(x + attn_output)
        
        # Feed-Forward
        ff_output = self.feed_forward(x)
        x = self.norm3(x + ff_output)
        
        return x
```

## Ejemplo Práctico: Traducción

```python
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Cargar modelo preentrenado (T5)
model_name = "t5-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# Traducir texto
text = "translate English to Spanish: Hello, how are you?"
inputs = tokenizer(text, return_tensors="pt")

# Generar traducción
outputs = model.generate(**inputs, max_length=50)
translation = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(translation)  # "Hola, ¿cómo estás?"
```

## Variantes Modernas

### 1. **GPT (Decoder-only)**
- Solo usa el decoder
- Preentrenamiento: predecir siguiente token
- Casos de uso: generación de texto, chatbots

### 2. **BERT (Encoder-only)**
- Solo usa el encoder
- Preentrenamiento: masked language modeling
- Casos de uso: clasificación, NER, Q&A

### 3. **T5 (Encoder-Decoder completo)**
- Usa ambos componentes
- Todo se formula como text-to-text
- Casos de uso: traducción, resumen, Q&A

## Optimizaciones y Mejoras

### Flash Attention
```python
# Reduce complejidad de O(N²) a O(N)
from flash_attn import flash_attn_func

attention_output = flash_attn_func(q, k, v, causal=True)
```

### Relative Positional Encoding
```python
# Usado en Transformer-XL y T5
# Aprende posiciones relativas en lugar de absolutas
class RelativePositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=512):
        super().__init__()
        self.rel_pos_bias = nn.Parameter(torch.randn(max_len, max_len, d_model))
```

### Sparse Attention
```python
# Usado en Longformer y BigBird
# Atiende solo a ventanas locales + tokens globales
# Permite secuencias mucho más largas
```

## Métricas de Evaluación

```python
from torchmetrics import BLEUScore, ROUGEScore

# BLEU para traducción
bleu = BLEUScore(n_gram=4)
score = bleu(predictions, references)

# ROUGE para resumen
rouge = ROUGEScore()
score = rouge(predictions, references)
```

## Conclusión

Transformers cambió el paradigma del NLP por:

1. **Paralelización**: entrena mucho más rápido que RNNs
2. **Captura de dependencias largas**: self-attention ve toda la secuencia
3. **Transferencia de aprendizaje**: preentrenar y fine-tunar
4. **Versatilidad**: funciona en visión, audio, proteínas

**Papers Clave:**
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) (Vaswani et al., 2017)
- [BERT](https://arxiv.org/abs/1810.04805) (Devlin et al., 2018)
- [GPT-3](https://arxiv.org/abs/2005.14165) (Brown et al., 2020)

**Código Completo:** [GitHub - Transformer from Scratch](https://github.com/karpathy/minGPT)

---

**¿Te gustó este post?** Compártelo y sigue explorando la serie de Deep Learning en este blog.
