---
layout: post
title: "RAG Systems: Combining Retrieval with Generation"
date: 2026-01-26 09:30:00 -0600
category: NLP
tags: [rag, retrieval, llm, embeddings, vector-database, langchain]
excerpt: "Guía práctica para implementar sistemas RAG (Retrieval-Augmented Generation): embeddings, vector databases, chunking strategies y optimización de retrieval."
image: /assets/images/posts/rag-systems.jpg
reading_time: 15 min
---

Los **RAG (Retrieval-Augmented Generation)** systems han revolucionado cómo los LLMs interactúan con información externa. En lugar de depender solo del conocimiento embebido en sus pesos, RAG permite que los modelos accedan a documentos actualizados, bases de conocimiento privadas y contexto específico.

## ¿Qué es RAG?

RAG combina dos componentes:

1. **Retrieval**: Búsqueda de documentos relevantes en una base de conocimiento
2. **Generation**: Generación de respuestas usando un LLM con el contexto recuperado

```
User Query → Retrieve Relevant Docs → Augment Prompt → LLM Generation → Answer
```

### ¿Por Qué RAG?

**Problemas que resuelve:**
- ❌ **Hallucinations**: LLMs inventan información
- ❌ **Knowledge cutoff**: entrenados hasta cierta fecha
- ❌ **Domain-specific knowledge**: no tienen datos privados
- ❌ **Cost**: fine-tuning es caro

**Ventajas de RAG:**
- ✅ Información actualizada en tiempo real
- ✅ Cita fuentes (trazabilidad)
- ✅ Escalable y económico
- ✅ No requiere reentrenamiento

## Arquitectura RAG Completa

```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import DirectoryLoader

class RAGSystem:
    def __init__(self, docs_path, model_name="gpt-3.5-turbo"):
        self.embeddings = OpenAIEmbeddings()
        self.llm = OpenAI(model_name=model_name, temperature=0)
        self.vectorstore = None
        self.qa_chain = None
        
        # Cargar y procesar documentos
        self.load_documents(docs_path)
        
    def load_documents(self, docs_path):
        # 1. Cargar documentos
        loader = DirectoryLoader(docs_path, glob="**/*.txt")
        documents = loader.load()
        
        # 2. Split en chunks (chunking strategy)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        chunks = text_splitter.split_documents(documents)
        
        # 3. Crear embeddings y almacenar en vector DB
        self.vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory="./chroma_db"
        )
        
        # 4. Crear cadena de Q&A
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(
                search_kwargs={"k": 4}  # Top 4 documentos
            ),
            return_source_documents=True
        )
        
    def query(self, question):
        result = self.qa_chain({"query": question})
        return {
            "answer": result["result"],
            "sources": result["source_documents"]
        }

# Uso
rag = RAGSystem("./knowledge_base")
response = rag.query("¿Cómo funcionan los transformers?")
print(response["answer"])
```

## Componentes Clave

### 1. Document Loading

```python
from langchain.document_loaders import (
    TextLoader,
    PDFLoader,
    UnstructuredMarkdownLoader,
    CSVLoader
)

# Diferentes tipos de documentos
loaders = {
    "txt": TextLoader("docs/file.txt"),
    "pdf": PDFLoader("docs/file.pdf"),
    "md": UnstructuredMarkdownLoader("docs/file.md"),
    "csv": CSVLoader("data/file.csv")
}

# Cargar todos
documents = []
for loader in loaders.values():
    documents.extend(loader.load())
```

### 2. Text Chunking

**Estrategias de chunking:**

```python
from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    TokenTextSplitter,
    CharacterTextSplitter
)

# Estrategia 1: Por caracteres con overlap
char_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""]
)

# Estrategia 2: Por tokens (mejor para LLMs)
token_splitter = TokenTextSplitter(
    chunk_size=256,
    chunk_overlap=50
)

# Estrategia 3: Semantic chunking (por significado)
from langchain.text_splitter import SemanticChunker

semantic_splitter = SemanticChunker(
    embeddings=OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile"  # O "standard_deviation"
)

chunks = semantic_splitter.split_documents(documents)
```

**Recomendaciones:**
- **Chunk size**: 512-1024 tokens (balance context vs precisión)
- **Overlap**: 10-20% del chunk size (mantiene contexto)
- **Separators**: priorizar párrafos > oraciones > palabras

### 3. Embeddings

```python
from sentence_transformers import SentenceTransformer
import numpy as np

class EmbeddingModel:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)
        
    def embed_documents(self, texts):
        """Convierte textos en vectores densos"""
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings
    
    def embed_query(self, query):
        """Embedding para la query"""
        return self.model.encode(query, convert_to_numpy=True)
    
    def cosine_similarity(self, vec1, vec2):
        """Similitud coseno entre vectores"""
        return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# Ejemplo
embedder = EmbeddingModel()

# Embeddings de documentos
docs = ["Transformers usan self-attention", "BERT es un encoder"]
doc_embeddings = embedder.embed_documents(docs)

# Embedding de query
query = "¿Qué es self-attention?"
query_embedding = embedder.embed_query(query)

# Calcular similitud
similarities = [
    embedder.cosine_similarity(query_embedding, doc_emb)
    for doc_emb in doc_embeddings
]
print(similarities)  # [0.78, 0.42]
```

**Modelos de Embeddings Populares:**

| Modelo | Dimensiones | Rendimiento | Velocidad |
|--------|-------------|-------------|-----------|
| OpenAI text-embedding-3-small | 1536 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ |
| sentence-transformers/all-MiniLM-L6-v2 | 384 | ⭐⭐⭐⭐ | ⚡⚡⚡⚡⚡ |
| sentence-transformers/all-mpnet-base-v2 | 768 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ |
| Cohere embed-multilingual-v3.0 | 1024 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡ |

### 4. Vector Databases

```python
import chromadb
from chromadb.config import Settings

class VectorStore:
    def __init__(self, collection_name="knowledge_base"):
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_storage"
        ))
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}  # Métrica de distancia
        )
        
    def add_documents(self, texts, metadatas=None, ids=None):
        """Agregar documentos al vector store"""
        self.collection.add(
            documents=texts,
            metadatas=metadatas,
            ids=ids if ids else [f"doc_{i}" for i in range(len(texts))]
        )
        
    def search(self, query, k=5):
        """Búsqueda por similitud"""
        results = self.collection.query(
            query_texts=[query],
            n_results=k,
            include=["documents", "metadatas", "distances"]
        )
        return results
    
    def search_with_filter(self, query, filter_dict, k=5):
        """Búsqueda con filtros de metadata"""
        results = self.collection.query(
            query_texts=[query],
            n_results=k,
            where=filter_dict  # e.g., {"category": "deep-learning"}
        )
        return results

# Uso
vectorstore = VectorStore()
vectorstore.add_documents(
    texts=["Transformers revolucionaron NLP", "GPT-3 tiene 175B parámetros"],
    metadatas=[{"category": "nlp"}, {"category": "llm"}],
    ids=["doc1", "doc2"]
)

results = vectorstore.search("¿Qué es GPT-3?", k=2)
print(results)
```

**Vector Databases Populares:**

- **Chroma**: Open-source, fácil de usar, persistencia local
- **Pinecone**: Managed, alta escala, serverless
- **Weaviate**: Open-source, multimodal, GraphQL
- **Qdrant**: Rust, performance, filtros avanzados
- **Milvus**: Distributed, billions de vectores

### 5. Retrieval Strategies

#### a) **Dense Retrieval (Vector Search)**
```python
# Búsqueda por similitud de embeddings
results = vectorstore.similarity_search(query, k=4)
```

#### b) **Sparse Retrieval (BM25)**
```python
from rank_bm25 import BM25Okapi

class BM25Retriever:
    def __init__(self, documents):
        self.documents = documents
        tokenized_docs = [doc.split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized_docs)
        
    def retrieve(self, query, k=5):
        tokenized_query = query.split()
        scores = self.bm25.get_scores(tokenized_query)
        top_k_indices = np.argsort(scores)[::-1][:k]
        return [self.documents[i] for i in top_k_indices]
```

#### c) **Hybrid Search (Dense + Sparse)**
```python
def hybrid_search(query, alpha=0.5):
    """
    Combina vector search y BM25
    alpha: peso de vector search (0-1)
    """
    # Dense retrieval
    dense_results = vectorstore.search(query, k=10)
    dense_scores = {doc.id: 1 - dist for doc, dist in dense_results}
    
    # Sparse retrieval (BM25)
    sparse_results = bm25_retriever.retrieve(query, k=10)
    sparse_scores = {doc.id: score for doc, score in sparse_results}
    
    # Combinar scores
    all_doc_ids = set(dense_scores.keys()) | set(sparse_scores.keys())
    hybrid_scores = {}
    
    for doc_id in all_doc_ids:
        dense_score = dense_scores.get(doc_id, 0)
        sparse_score = sparse_scores.get(doc_id, 0)
        hybrid_scores[doc_id] = alpha * dense_score + (1 - alpha) * sparse_score
    
    # Ordenar por score
    sorted_docs = sorted(hybrid_scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_docs[:5]
```

### 6. Reranking

```python
from sentence_transformers import CrossEncoder

class Reranker:
    def __init__(self, model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model = CrossEncoder(model_name)
        
    def rerank(self, query, documents, top_k=3):
        """
        Reranquear documentos usando un modelo de cross-encoder
        Más preciso que cosine similarity pero más lento
        """
        # Crear pares (query, doc)
        pairs = [[query, doc] for doc in documents]
        
        # Calcular scores de relevancia
        scores = self.model.predict(pairs)
        
        # Ordenar por score
        ranked_indices = np.argsort(scores)[::-1][:top_k]
        return [documents[i] for i in ranked_indices]

# Pipeline completo
def retrieve_and_rerank(query):
    # 1. Initial retrieval (k=20)
    candidates = vectorstore.search(query, k=20)
    
    # 2. Rerank top 20 → top 3
    reranker = Reranker()
    final_docs = reranker.rerank(query, candidates, top_k=3)
    
    return final_docs
```

## Prompt Engineering para RAG

```python
def create_rag_prompt(query, context_docs):
    """
    Crear prompt optimizado para RAG
    """
    context = "\n\n".join([
        f"Documento {i+1}:\n{doc}"
        for i, doc in enumerate(context_docs)
    ])
    
    prompt = f"""Eres un asistente que responde preguntas basándote SOLO en el contexto proporcionado.

CONTEXTO:
{context}

PREGUNTA: {query}

INSTRUCCIONES:
1. Responde SOLO usando información del contexto
2. Si la respuesta no está en el contexto, di "No tengo información suficiente"
3. Cita el número de documento que usaste
4. Sé conciso y preciso

RESPUESTA:"""
    
    return prompt

# Uso
query = "¿Cómo funciona self-attention?"
docs = retrieve_and_rerank(query)
prompt = create_rag_prompt(query, docs)
answer = llm.generate(prompt)
```

## Advanced RAG Techniques

### 1. **Query Transformation**
```python
def transform_query(original_query):
    """
    Transforma query para mejorar retrieval
    """
    transformations = {
        "expansion": f"Genera 3 variaciones de esta pregunta: {original_query}",
        "decomposition": f"Descompón esta pregunta compleja en sub-preguntas: {original_query}",
        "abstraction": f"Reformula esta pregunta de manera más general: {original_query}"
    }
    
    # Usar LLM para transformar
    expanded_queries = llm.generate(transformations["expansion"])
    
    # Buscar con múltiples queries
    all_results = []
    for query in expanded_queries:
        results = vectorstore.search(query, k=3)
        all_results.extend(results)
    
    # Deduplicate y rankear
    unique_results = list(set(all_results))
    return unique_results
```

### 2. **Parent Document Retrieval**
```python
class ParentDocumentRetriever:
    """
    Guarda chunks pequeños para búsqueda, pero devuelve chunks padres más grandes
    """
    def __init__(self, parent_splitter, child_splitter):
        self.parent_chunks = {}
        self.child_to_parent = {}
        
    def index_documents(self, documents):
        # Split en chunks grandes (parents)
        parent_docs = self.parent_splitter.split_documents(documents)
        
        # Split cada parent en chunks pequeños (children)
        for parent_id, parent_doc in enumerate(parent_docs):
            self.parent_chunks[parent_id] = parent_doc
            
            child_docs = self.child_splitter.split_documents([parent_doc])
            for child_doc in child_docs:
                self.child_to_parent[child_doc.id] = parent_id
                vectorstore.add_documents([child_doc])
    
    def retrieve(self, query, k=3):
        # Buscar en child chunks
        child_results = vectorstore.search(query, k=k*2)
        
        # Devolver parent chunks únicos
        parent_ids = set([self.child_to_parent[child.id] for child in child_results])
        return [self.parent_chunks[pid] for pid in parent_ids][:k]
```

### 3. **Self-RAG (Reflexión)**
```python
def self_rag(query, max_iterations=3):
    """
    RAG con auto-reflexión para mejorar respuestas
    """
    for i in range(max_iterations):
        # 1. Retrieve
        docs = vectorstore.search(query, k=3)
        
        # 2. Generate
        answer = generate_answer(query, docs)
        
        # 3. Critique (auto-evaluación)
        critique_prompt = f"""
        Query: {query}
        Answer: {answer}
        
        ¿Esta respuesta es completa y precisa? ¿Qué falta?
        Responde: [COMPLETA] o [INCOMPLETA: razón]
        """
        critique = llm.generate(critique_prompt)
        
        # 4. Si completa, terminar
        if "[COMPLETA]" in critique:
            return answer
        
        # 5. Si no, refinar query
        refine_prompt = f"Reformula esta query para obtener mejor información: {query}\nProblema: {critique}"
        query = llm.generate(refine_prompt)
    
    return answer
```

## Evaluación de RAG

```python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_relevancy,
    context_recall
)

# Crear dataset de evaluación
eval_dataset = {
    "question": ["¿Qué es RAG?", "¿Cómo funciona retrieval?"],
    "answer": [answer1, answer2],
    "contexts": [contexts1, contexts2],
    "ground_truth": [gt1, gt2]
}

# Evaluar
results = evaluate(
    dataset=eval_dataset,
    metrics=[
        faithfulness,        # ¿Respuesta fiel al contexto?
        answer_relevancy,    # ¿Respuesta relevante a la pregunta?
        context_relevancy,   # ¿Contexto relevante?
        context_recall       # ¿Recuperó todo el contexto necesario?
    ]
)

print(results)
```

## Optimización y Best Practices

### 1. **Caché de Embeddings**
```python
import hashlib
import pickle

class EmbeddingCache:
    def __init__(self, cache_file="embeddings_cache.pkl"):
        self.cache_file = cache_file
        self.cache = self.load_cache()
        
    def load_cache(self):
        try:
            with open(self.cache_file, 'rb') as f:
                return pickle.load(f)
        except FileNotFoundError:
            return {}
    
    def save_cache(self):
        with open(self.cache_file, 'wb') as f:
            pickle.dump(self.cache, f)
    
    def get_embedding(self, text, embedder):
        # Hash del texto
        text_hash = hashlib.md5(text.encode()).hexdigest()
        
        if text_hash in self.cache:
            return self.cache[text_hash]
        
        # Calcular embedding
        embedding = embedder.embed_query(text)
        self.cache[text_hash] = embedding
        self.save_cache()
        
        return embedding
```

### 2. **Chunking Inteligente**
```python
def smart_chunking(document, max_chunk_size=1000):
    """
    Chunking que respeta estructura del documento
    """
    # Detectar secciones
    sections = document.split("\n##")  # Headers de markdown
    
    chunks = []
    for section in sections:
        if len(section) <= max_chunk_size:
            chunks.append(section)
        else:
            # Split subsections
            subsections = section.split("\n###")
            for subsection in subsections:
                if len(subsection) <= max_chunk_size:
                    chunks.append(subsection)
                else:
                    # Split por párrafos
                    paragraphs = subsection.split("\n\n")
                    current_chunk = ""
                    for para in paragraphs:
                        if len(current_chunk) + len(para) <= max_chunk_size:
                            current_chunk += para + "\n\n"
                        else:
                            chunks.append(current_chunk)
                            current_chunk = para + "\n\n"
                    
                    if current_chunk:
                        chunks.append(current_chunk)
    
    return chunks
```

### 3. **Metadata Filtering**
```python
# Agregar metadata rica
vectorstore.add_documents(
    texts=chunks,
    metadatas=[{
        "source": "paper_transformer.pdf",
        "page": 3,
        "section": "Architecture",
        "date": "2017-06-12",
        "author": "Vaswani et al.",
        "topic": "deep-learning"
    } for chunk in chunks]
)

# Buscar con filtros
results = vectorstore.search(
    query="self-attention mechanism",
    filter={"topic": "deep-learning", "date": {"$gte": "2017-01-01"}},
    k=5
)
```

## Conclusión

RAG es esencial para aplicaciones de producción con LLMs porque:

1. **Reduce hallucinations** citando fuentes verificables
2. **Actualización dinámica** sin reentrenar modelos
3. **Costo-efectivo** vs fine-tuning completo
4. **Escalable** a millones de documentos

**Roadmap Completo:**
1. Start: Vanilla RAG (embeddings + vector DB)
2. Intermediate: Hybrid search + reranking
3. Advanced: Query transformation + self-RAG
4. Production: Caché, monitoreo, A/B testing

**Frameworks Recomendados:**
- [LangChain](https://python.langchain.com/) - Ecosistema completo
- [LlamaIndex](https://www.llamaindex.ai/) - Especializado en RAG
- [Haystack](https://haystack.deepset.ai/) - Enterprise-ready

**Papers Clave:**
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
- [Self-RAG](https://arxiv.org/abs/2310.11511)

---

**Próximo post:** Fine-tuning LLMs con LoRA y PEFT para casos especializados.
