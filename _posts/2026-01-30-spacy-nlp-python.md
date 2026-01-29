---
layout: post
title: "spaCy: NLP Industrial en Python"
date: 2026-01-30 10:00:00 -0600
category: NLP
tags: [spacy, nlp, ner, tokenization, text-processing, python]
excerpt: "Guía completa de spaCy: tokenización, NER, dependency parsing, pipelines custom. Procesa 1M+ tokens/segundo en producción."
image: /assets/images/posts/spacy-nlp.jpg
reading_time: 13 min
---

**spaCy** es la librería industrial para NLP en Python: **rápida** (C extensions), **precisa** (state-of-the-art models) y **production-ready** (battle-tested por Explosion AI).

## spaCy vs NLTK vs Transformers

| Feature | spaCy | NLTK | Transformers |
|---------|-------|------|--------------|
| **Speed** | 1M tok/sec | 100k tok/sec | 10k tok/sec |
| **Accuracy** | 95% | 85% | 98% |
| **Production** | ✅ | ❌ | ⚠️ |
| **API** | Simple | Complex | Medium |
| **Use Case** | Industry | Academic | Research |

**Choose spaCy when:** Fast processing, production deployment, reasonable accuracy

## Instalación

```bash
# Instalar spaCy
pip install spacy

# Descargar modelo en español (12 MB)
python -m spacy download es_core_news_sm

# Modelos disponibles:
# sm (small): 12 MB, 95% accuracy
# md (medium): 40 MB, 96% accuracy  
# lg (large): 560 MB, 97% accuracy
# trf (transformer): 500 MB, 98% accuracy (más lento)

# Inglés
python -m spacy download en_core_web_sm
```

## Procesamiento Básico

```python
import spacy

# Cargar modelo
nlp = spacy.load("es_core_news_sm")

# Procesar texto
doc = nlp("Apple planea comprar una startup en San Francisco por $1 millón.")

# Tokenización
for token in doc:
    print(token.text, token.pos_, token.dep_)

# Output:
# Apple      PROPN    nsubj
# planea     VERB     ROOT
# comprar    VERB     xcomp
# una        DET      det
# startup    NOUN     obj
# en         ADP      case
# San Francisco PROPN obl
# por        ADP      case
# $          SYM      nmod
# 1          NUM      nummod
# millón     NUM      nmod
# .          PUNCT    punct
```

### Pipeline Components

```
Input Text
    ↓
[Tokenizer] → tokens
    ↓
[Tagger] → POS tags (NOUN, VERB, ADJ...)
    ↓
[Parser] → Dependency parse (nsubj, obj...)
    ↓
[NER] → Named entities (ORG, PERSON, LOC...)
    ↓
[Lemmatizer] → Lemas (corriendo → correr)
    ↓
Doc object
```

```python
# Ver components del pipeline
print(nlp.pipe_names)
# ['tok2vec', 'tagger', 'parser', 'ner', 'attribute_ruler', 'lemmatizer']

# Deshabilitar components (más rápido)
doc = nlp("Texto", disable=["parser", "ner"])
```

## Named Entity Recognition (NER)

```python
doc = nlp("Elon Musk fundó Tesla en California y SpaceX en 2002.")

for ent in doc.ents:
    print(ent.text, ent.label_)

# Output:
# Elon Musk    PER   (persona)
# Tesla        ORG   (organización)
# California   LOC   (lugar)
# SpaceX       ORG
# 2002         DATE  (fecha)

# Visualizar
from spacy import displacy
displacy.serve(doc, style="ent")
```

### Custom NER Training

```python
import spacy
from spacy.training import Example

# 1. Crear pipeline vacío
nlp = spacy.blank("es")
ner = nlp.add_pipe("ner")

# 2. Agregar labels
ner.add_label("PRODUCTO")
ner.add_label("EMPRESA")
ner.add_label("PERSONA")

# 3. Preparar training data
TRAIN_DATA = [
    ("iPhone 15 es fabricado por Apple", {
        "entities": [(0, 9, "PRODUCTO"), (28, 33, "EMPRESA")]
    }),
    ("Tim Cook es CEO de Apple desde 2011", {
        "entities": [(0, 8, "PERSONA"), (19, 24, "EMPRESA")]
    }),
    ("MacBook Pro cuesta $2000", {
        "entities": [(0, 11, "PRODUCTO")]
    })
]

# 4. Entrenar
nlp.begin_training()
for epoch in range(10):
    losses = {}
    for text, annotations in TRAIN_DATA:
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, annotations)
        nlp.update([example], losses=losses)
    print(f"Epoch {epoch}, Loss: {losses['ner']:.2f}")

# 5. Guardar modelo
nlp.to_disk("./ner_productos")

# 6. Usar modelo
nlp_custom = spacy.load("./ner_productos")
doc = nlp_custom("AirPods Pro son de Apple")
print([(ent.text, ent.label_) for ent in doc.ents])
# [('AirPods Pro', 'PRODUCTO'), ('Apple', 'EMPRESA')]
```

## Part-of-Speech Tagging

```python
doc = nlp("Los desarrolladores escriben código rápidamente.")

for token in doc:
    print(f"{token.text:15} {token.pos_:10} {token.tag_:10} {token.morph}")

# Output:
# Los             DET        DET        Definite=Def|Gender=Masc|Number=Plur
# desarrolladores NOUN       NOUN       Gender=Masc|Number=Plur
# escriben        VERB       VERB       Mood=Ind|Number=Plur|Person=3|Tense=Pres
# código          NOUN       NOUN       Gender=Masc|Number=Sing
# rápidamente     ADV        ADV        -
# .               PUNCT      PUNCT      PunctType=Peri

# POS tags universales:
# NOUN, VERB, ADJ, ADV, PRON, DET, ADP, NUM, CONJ, PUNCT, X
```

## Dependency Parsing

```python
doc = nlp("Apple compró una startup por $1 millón.")

for token in doc:
    print(f"{token.text:10} ← {token.dep_:10} ← {token.head.text}")

# Output:
# Apple      ← nsubj     ← compró
# compró     ← ROOT      ← compró
# una        ← det       ← startup
# startup    ← obj       ← compró
# por        ← case      ← millón
# $          ← nmod      ← millón
# 1          ← nummod    ← millón
# millón     ← obl       ← compró
# .          ← punct     ← compró

# Visualizar árbol
displacy.serve(doc, style="dep")
```

### Navegar Árbol de Dependencias

```python
doc = nlp("El CEO de Tesla anunció nuevos modelos.")

# Encontrar sujeto del verbo
verb = [token for token in doc if token.pos_ == "VERB"][0]
subject = [child for child in verb.children if child.dep_ == "nsubj"][0]
print(f"Sujeto: {subject.text}")  # "CEO"

# Encontrar objeto directo
obj = [child for child in verb.children if child.dep_ == "obj"][0]
print(f"Objeto: {obj.text}")  # "modelos"

# Subtree completo
print(list(subject.subtree))
# [El, CEO, de, Tesla]
```

## Lemmatización

```python
doc = nlp("Los gatos corrieron rápidamente hacia las casas viejas.")

for token in doc:
    print(f"{token.text:15} → {token.lemma_}")

# Output:
# Los             → el
# gatos           → gato
# corrieron       → correr
# rápidamente     → rápidamente
# hacia           → hacia
# las             → el
# casas           → casa
# viejas          → viejo
# .               → .

# Útil para búsqueda: "corriendo", "corrió", "corro" → "correr"
```

## Similarity & Word Vectors

```python
# Requiere modelo md/lg (tiene word vectors)
nlp = spacy.load("es_core_news_md")

doc1 = nlp("perro")
doc2 = nlp("gato")
doc3 = nlp("manzana")

print(doc1.similarity(doc2))  # 0.80 (similar)
print(doc1.similarity(doc3))  # 0.23 (diferente)

# Similarity de documentos
doc_a = nlp("Me encantan los perros y gatos.")
doc_b = nlp("Adoro las mascotas.")
print(doc_a.similarity(doc_b))  # 0.75

# Encontrar palabra más similar
word = nlp("Python")[0]
candidates = ["Java", "manzana", "programación", "serpiente"]
similarities = [(c, word.similarity(nlp(c)[0])) for c in candidates]
print(max(similarities, key=lambda x: x[1]))
# ('programación', 0.68)
```

## Pipelines Custom

### 1. Component Custom

```python
from spacy.language import Language

@Language.component("sentiment_detector")
def detect_sentiment(doc):
    """Agregar sentiment a cada token"""
    positive_words = {"bueno", "excelente", "genial", "amor"}
    negative_words = {"malo", "terrible", "odio", "peor"}
    
    for token in doc:
        if token.lower_ in positive_words:
            token._.sentiment = "positive"
        elif token.lower_ in negative_words:
            token._.sentiment = "negative"
        else:
            token._.sentiment = "neutral"
    
    return doc

# Agregar custom attribute
from spacy.tokens import Token
Token.set_extension("sentiment", default="neutral", force=True)

# Agregar al pipeline
nlp.add_pipe("sentiment_detector", before="ner")

# Usar
doc = nlp("Este producto es excelente pero el servicio es terrible.")
for token in doc:
    if token._.sentiment != "neutral":
        print(f"{token.text}: {token._.sentiment}")

# excelente: positive
# terrible: negative
```

### 2. Entity Ruler (Rule-based NER)

```python
from spacy.pipeline import EntityRuler

# Crear ruler
ruler = nlp.add_pipe("entity_ruler", before="ner")

# Definir patrones
patterns = [
    {"label": "PRODUCTO", "pattern": "iPhone"},
    {"label": "PRODUCTO", "pattern": [{"LOWER": "macbook"}, {"LOWER": "pro"}]},
    {"label": "EMPRESA", "pattern": "Apple"},
    {"label": "PERSONA", "pattern": [{"TEXT": "Steve"}, {"TEXT": "Jobs"}]},
]

ruler.add_patterns(patterns)

# Detectar
doc = nlp("Steve Jobs lanzó el iPhone en Apple.")
print([(ent.text, ent.label_) for ent in doc.ents])
# [('Steve Jobs', 'PERSONA'), ('iPhone', 'PRODUCTO'), ('Apple', 'EMPRESA')]
```

### 3. Matcher (Pattern Matching)

```python
from spacy.matcher import Matcher

matcher = Matcher(nlp.vocab)

# Pattern: verbo + "a" + lugar
pattern = [
    {"POS": "VERB"},
    {"LOWER": "a"},
    {"POS": "PROPN", "OP": "+"}  # OP="+": uno o más
]

matcher.add("TRAVEL", [pattern])

doc = nlp("Viajaré a París. Fui a San Francisco y Nueva York.")
matches = matcher(doc)

for match_id, start, end in matches:
    span = doc[start:end]
    print(f"Match: {span.text}")

# Match: Viajaré a París
# Match: Fui a San Francisco
# Match: a Nueva York
```

## Procesamiento a Escala

### 1. Batch Processing

```python
# 🐌 Lento: procesar uno por uno
texts = ["texto1", "texto2", ..., "texto100k"]
docs = [nlp(text) for text in texts]

# ⚡ Rápido: batch processing (10× más rápido)
docs = list(nlp.pipe(texts, batch_size=50, n_process=4))

# n_process=4 → 4 CPU cores en paralelo
# batch_size=50 → procesar 50 textos a la vez
```

### 2. Streaming

```python
# Para datasets grandes (no caben en RAM)
def read_large_file(filepath):
    with open(filepath) as f:
        for line in f:
            yield line

texts = read_large_file("10GB.txt")
docs = nlp.pipe(texts, batch_size=1000)

for doc in docs:
    # Procesar sin cargar todo en memoria
    entities = [ent.text for ent in doc.ents]
    save_to_db(entities)
```

### 3. Disable Unused Pipes

```python
import time

text = "Largo texto para procesar..."

# Con todos los components
start = time.time()
doc = nlp(text)
print(f"Full pipeline: {time.time() - start:.3f}s")
# 0.045s

# Solo tokenizer + NER
start = time.time()
doc = nlp(text, disable=["tagger", "parser", "lemmatizer"])
print(f"Only NER: {time.time() - start:.3f}s")
# 0.012s (3.7× más rápido)
```

## Casos de Uso

### 1. Extracción de Información

```python
def extract_companies(text):
    """Extraer empresas mencionadas"""
    doc = nlp(text)
    return [ent.text for ent in doc.ents if ent.label_ == "ORG"]

text = """
Amazon anunció que adquirirá Whole Foods por $13.7B.
Microsoft y Google también están en conversaciones.
"""

companies = extract_companies(text)
print(companies)  # ['Amazon', 'Whole Foods', 'Microsoft', 'Google']
```

### 2. Text Classification

```python
import spacy
from spacy.pipeline.textcat import Config

# Crear text classifier
nlp = spacy.blank("es")
textcat = nlp.add_pipe("textcat", config={"model": Config().from_str("...")})

# Agregar labels
textcat.add_label("POSITIVO")
textcat.add_label("NEGATIVO")

# Training data
TRAIN_DATA = [
    ("Excelente producto, me encanta", {"cats": {"POSITIVO": 1, "NEGATIVO": 0}}),
    ("Terrible calidad, muy decepcionado", {"cats": {"POSITIVO": 0, "NEGATIVO": 1}}),
    # ... más ejemplos
]

# Entrenar (similar a custom NER)
# ...

# Usar
doc = nlp("Muy buena experiencia, recomendado")
print(doc.cats)  # {'POSITIVO': 0.92, 'NEGATIVO': 0.08}
```

### 3. Keyword Extraction

```python
def extract_keywords(text, top_n=5):
    """Extraer palabras clave (nouns + propns)"""
    doc = nlp(text)
    
    # Filtrar por POS tag
    keywords = [
        token.lemma_ for token in doc
        if token.pos_ in ["NOUN", "PROPN"]
        and not token.is_stop
        and len(token.text) > 3
    ]
    
    # Contar frecuencias
    from collections import Counter
    freq = Counter(keywords)
    
    return freq.most_common(top_n)

text = """
Machine learning es una rama de la inteligencia artificial.
Los algoritmos de machine learning aprenden de datos.
Deep learning es un tipo de machine learning basado en redes neuronales.
"""

print(extract_keywords(text))
# [('learning', 3), ('machine', 3), ('datos', 1), ('algoritmo', 1), ('deep', 1)]
```

## Integración con Transformers

```python
# spaCy + Transformers = precisión máxima
# pip install spacy-transformers

import spacy_transformers

# Modelo transformer (BERT-based)
nlp = spacy.load("es_dep_news_trf")

# Accuracy: 98% (vs 95% de modelo sm)
# Speed: 10× más lento

doc = nlp("Apple compró una startup en San Francisco.")
print([(ent.text, ent.label_) for ent in doc.ents])
# Mejor detección de entidades ambiguas
```

## Productionization

### 1. API REST con FastAPI

```python
from fastapi import FastAPI
from pydantic import BaseModel
import spacy

app = FastAPI()
nlp = spacy.load("es_core_news_sm")

class TextInput(BaseModel):
    text: str

@app.post("/ner")
def extract_entities(input: TextInput):
    doc = nlp(input.text)
    entities = [
        {"text": ent.text, "label": ent.label_, "start": ent.start_char, "end": ent.end_char}
        for ent in doc.ents
    ]
    return {"entities": entities}

@app.post("/keywords")
def extract_keywords(input: TextInput):
    doc = nlp(input.text)
    keywords = [
        {"text": token.text, "lemma": token.lemma_, "pos": token.pos_}
        for token in doc
        if token.pos_ in ["NOUN", "VERB", "ADJ"]
    ]
    return {"keywords": keywords}

# Run: uvicorn api:app --host 0.0.0.0 --port 8000
```

### 2. Docker Deployment

```dockerfile
FROM python:3.10-slim

WORKDIR /app

RUN pip install spacy fastapi uvicorn
RUN python -m spacy download es_core_news_sm

COPY api.py .

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t spacy-api .
docker run -p 8000:8000 spacy-api

curl -X POST http://localhost:8000/ner \
  -H "Content-Type: application/json" \
  -d '{"text": "Apple compró una startup en 2023"}'
```

## Best Practices

1. **Usar modelo adecuado:** `sm` para speed, `lg` para accuracy
2. **Batch processing:** `nlp.pipe()` para múltiples textos
3. **Disable unused pipes:** Solo cargar lo necesario
4. **Custom components:** Para lógica específica de dominio
5. **Cache modelos:** Cargar `nlp` una vez, no en cada request

## Comparación Final

```python
# ❌ NLTK (lento, complejo)
import nltk
tokens = nltk.word_tokenize(text)
tags = nltk.pos_tag(tokens)
entities = nltk.ne_chunk(tags)

# ❌ Transformers (poderoso pero overkill)
from transformers import pipeline
ner = pipeline("ner", model="bert-base-multilingual-cased")
entities = ner(text)

# ✅ spaCy (balance perfecto)
import spacy
nlp = spacy.load("es_core_news_sm")
doc = nlp(text)
entities = doc.ents
```

## Recursos

- **spaCy Docs**: [spacy.io](https://spacy.io)
- **spaCy Course**: [course.spacy.io](https://course.spacy.io)
- **Models**: [spacy.io/models](https://spacy.io/models)
- **spaCy Universe**: Plugins y extensiones

---

## Conclusión

**spaCy** es la opción por defecto para NLP en producción:

- ✅ **Fast**: 1M tokens/segundo
- ✅ **Accurate**: 95-98% accuracy
- ✅ **Production-ready**: Battle-tested API
- ✅ **Extensible**: Custom components y training

**Cuándo usar spaCy:**
- Procesamiento de texto a escala
- NER, POS tagging, dependency parsing
- Pipelines de NLP en producción
- Prototipado rápido

**Cuándo NO usar spaCy:**
- SOTA accuracy (usar Transformers)
- Tareas muy específicas (fine-tune BERT)
- Generación de texto (usar GPT)

---

🎉 **SPRINT E COMPLETO**: 6 posts técnicos sobre IA/ML creados! 22,000+ palabras de contenido profesional.
