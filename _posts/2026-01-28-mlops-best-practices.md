---
layout: post
title: "MLOps: De Notebooks a Producción"
date: 2026-01-28 10:30:00 -0600
category: MLOps
tags: [mlops, mlflow, dvc, ci-cd, monitoring, deployment]
excerpt: "Pipeline completo de MLOps: versionado de datos con DVC, tracking con MLflow, CI/CD con GitHub Actions, monitoring en producción."
image: /assets/images/posts/mlops-pipeline.jpg
reading_time: 14 min
---

**87% de los modelos ML nunca llegan a producción.** MLOps resuelve el gap entre experimentos en notebooks y sistemas escalables en producción.

## El Problema del "Notebook Hell"

```python
# notebook_final_v3_REAL_ultima_version.ipynb

# ❌ Problemas:
# - Datos sin versionar (¿qué data entrenó este modelo?)
# - Experimentos perdidos (¿qué hiperparams funcionaron?)
# - Código no reproducible (funciona en mi máquina™)
# - Deploy manual (copiar .pkl a servidor)
# - Sin monitoring (modelo degrada silently)
```

## Pipeline MLOps Completo

```
[Data] → [Version] → [Train] → [Track] → [Test] → [Deploy] → [Monitor]
   ↓         DVC        ↓       MLflow     CI/CD    Docker    Prometheus
  S3                  Code                                    Grafana
```

## 1. Versionado de Datos con DVC

**DVC** (Data Version Control) es Git para datasets:

```bash
# Instalar
pip install dvc dvc-s3

# Inicializar
dvc init
git commit -m "Initialize DVC"

# Trackear datasets
dvc add data/train.csv
dvc add data/test.csv

# DVC crea .dvc files (50 KB) en lugar de guardar CSV (5 GB) en Git
git add data/train.csv.dvc data/test.csv.dvc
git commit -m "Add training data v1"

# Configurar remote storage (S3/Azure/GCS)
dvc remote add -d storage s3://my-ml-bucket/data
dvc push  # Sube data a S3
```

### Pipeline DVC

```yaml
# dvc.yaml - Define pipeline completo
stages:
  preprocess:
    cmd: python src/preprocess.py
    deps:
      - data/raw.csv
      - src/preprocess.py
    outs:
      - data/train.csv
      - data/test.csv
    
  train:
    cmd: python src/train.py
    deps:
      - data/train.csv
      - src/train.py
    params:
      - train.learning_rate
      - train.epochs
    outs:
      - models/model.pkl
    metrics:
      - metrics.json:
          cache: false
          
  evaluate:
    cmd: python src/evaluate.py
    deps:
      - models/model.pkl
      - data/test.csv
    metrics:
      - scores.json:
          cache: false
```

```python
# src/train.py
import yaml
import joblib
from sklearn.ensemble import RandomForestClassifier

# Leer params
with open("params.yaml") as f:
    params = yaml.safe_load(f)

# Entrenar
model = RandomForestClassifier(
    n_estimators=params["train"]["n_estimators"],
    max_depth=params["train"]["max_depth"]
)
model.fit(X_train, y_train)

# Guardar
joblib.dump(model, "models/model.pkl")

# Guardar métricas
metrics = {"accuracy": 0.92, "f1": 0.89}
with open("metrics.json", "w") as f:
    json.dump(metrics, f)
```

```bash
# Ejecutar pipeline
dvc repro

# Ver métricas de diferentes versiones
dvc metrics show --all-branches

# Cambiar a versión anterior del dataset
git checkout v1.0
dvc checkout  # Descarga data de esa versión
```

## 2. Experiment Tracking con MLflow

**MLflow** trackea experimentos, modelos y deployments:

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score

# Configurar tracking server
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("credit-card-fraud")

# Entrenar con tracking
with mlflow.start_run(run_name="rf_baseline"):
    
    # Log params
    params = {
        "n_estimators": 100,
        "max_depth": 10,
        "min_samples_split": 5
    }
    mlflow.log_params(params)
    
    # Entrenar modelo
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)
    
    # Evaluar
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    # Log metrics
    mlflow.log_metrics({
        "accuracy": accuracy,
        "f1_score": f1,
        "precision": precision_score(y_test, y_pred)
    })
    
    # Log artifacts
    fig = plot_confusion_matrix(y_test, y_pred)
    mlflow.log_figure(fig, "confusion_matrix.png")
    
    # Log model
    mlflow.sklearn.log_model(
        model,
        "model",
        registered_model_name="FraudDetector"
    )
    
    # Log dataset info
    mlflow.log_param("train_size", len(X_train))
    mlflow.log_param("test_size", len(X_test))
```

### MLflow UI

```bash
# Levantar tracking server
mlflow server --host 0.0.0.0 --port 5000

# Acceder a http://localhost:5000
# Ver: experimentos, métricas, modelos, artifacts
```

### Model Registry

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Registrar modelo
result = mlflow.register_model(
    "runs:/abc123/model",
    "FraudDetector"
)

# Promover a staging
client.transition_model_version_stage(
    name="FraudDetector",
    version=3,
    stage="Staging"
)

# Después de validar, promover a production
client.transition_model_version_stage(
    name="FraudDetector",
    version=3,
    stage="Production"
)

# Cargar modelo de producción
model_uri = "models:/FraudDetector/Production"
model = mlflow.sklearn.load_model(model_uri)
```

## 3. CI/CD para ML

### GitHub Actions Pipeline

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Training Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  train:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install dvc[s3] mlflow
    
    - name: Configure DVC
      run: |
        dvc remote modify storage access_key_id ${{ secrets.AWS_ACCESS_KEY }}
        dvc remote modify storage secret_access_key ${{ secrets.AWS_SECRET_KEY }}
    
    - name: Pull data
      run: dvc pull
    
    - name: Run pipeline
      run: dvc repro
    
    - name: Evaluate model
      run: python src/evaluate.py
    
    - name: Check performance threshold
      run: |
        accuracy=$(jq '.accuracy' metrics.json)
        if (( $(echo "$accuracy < 0.85" | bc -l) )); then
          echo "❌ Accuracy $accuracy below threshold 0.85"
          exit 1
        fi
        echo "✅ Accuracy $accuracy passed"
    
    - name: Upload model to MLflow
      if: github.ref == 'refs/heads/main'
      env:
        MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_URI }}
      run: python src/register_model.py
```

### Testing ML Code

```python
# tests/test_model.py
import pytest
import joblib
import pandas as pd
from src.train import preprocess, train_model

def test_preprocess():
    """Test data preprocessing"""
    df = pd.DataFrame({
        'amount': [100, 200, 50],
        'time': [0, 100, 200],
        'class': [0, 1, 0]
    })
    X, y = preprocess(df)
    assert X.shape[0] == 3
    assert len(y) == 3
    assert not X.isnull().any().any()

def test_model_predictions():
    """Test model makes valid predictions"""
    model = joblib.load("models/model.pkl")
    X_test = pd.read_csv("data/test.csv")
    
    predictions = model.predict(X_test)
    
    # Verificar output shape
    assert len(predictions) == len(X_test)
    
    # Verificar valores válidos (0 o 1)
    assert all(p in [0, 1] for p in predictions)
    
    # Verificar performance mínima
    accuracy = accuracy_score(y_test, predictions)
    assert accuracy >= 0.85, f"Accuracy {accuracy} below threshold"

def test_model_latency():
    """Test inference speed"""
    model = joblib.load("models/model.pkl")
    X_sample = X_test.iloc[:100]
    
    import time
    start = time.time()
    model.predict(X_sample)
    latency = (time.time() - start) / 100
    
    assert latency < 0.01, f"Latency {latency}s exceeds 10ms"

@pytest.mark.parametrize("input_data,expected", [
    ({"amount": 100, "time": 0}, 0),
    ({"amount": 10000, "time": 50}, 1),
])
def test_edge_cases(input_data, expected):
    """Test edge cases"""
    model = joblib.load("models/model.pkl")
    X = pd.DataFrame([input_data])
    pred = model.predict(X)[0]
    assert pred == expected
```

## 4. Containerización con Docker

```dockerfile
# Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY src/ ./src/
COPY models/ ./models/

# Exponer puerto
EXPOSE 8000

# Comando para servir modelo
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]
```

```python
# src/api.py - FastAPI serving
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import mlflow.sklearn

app = FastAPI(title="Fraud Detection API")

# Cargar modelo al startup
@app.on_event("startup")
def load_model():
    global model
    # Opción 1: Desde archivo
    model = joblib.load("models/model.pkl")
    
    # Opción 2: Desde MLflow
    # model = mlflow.sklearn.load_model("models:/FraudDetector/Production")

class Transaction(BaseModel):
    amount: float
    time: int
    v1: float
    v2: float
    # ... más features

@app.post("/predict")
def predict(transaction: Transaction):
    """Predict fraud probability"""
    features = [[
        transaction.amount,
        transaction.time,
        transaction.v1,
        transaction.v2
    ]]
    
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]
    
    return {
        "is_fraud": bool(prediction),
        "fraud_probability": float(probability)
    }

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": model is not None}
```

```bash
# Build y deploy
docker build -t fraud-detector:v1 .
docker run -p 8000:8000 fraud-detector:v1

# Test API
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"amount": 100.5, "time": 42, "v1": 0.5, "v2": -1.2}'
```

## 5. Monitoring en Producción

### Data Drift Detection

```python
from evidently import ColumnMapping
from evidently.report import Report
from evidently.metrics import DataDriftTable, DatasetDriftMetric

def detect_drift(reference_data, current_data):
    """Detectar drift en features"""
    
    report = Report(metrics=[
        DataDriftTable(),
        DatasetDriftMetric()
    ])
    
    report.run(
        reference_data=reference_data,
        current_data=current_data
    )
    
    drift_report = report.as_dict()
    
    if drift_report['metrics'][1]['result']['dataset_drift']:
        print("⚠️ Data drift detectado!")
        drifted_features = [
            col for col, metrics in drift_report['metrics'][0]['result']['drift_by_columns'].items()
            if metrics['drift_detected']
        ]
        print(f"Features con drift: {drifted_features}")
        
        # Trigger retraining
        trigger_retraining_pipeline()
    
    return drift_report
```

### Model Performance Monitoring

```python
from prometheus_client import Counter, Histogram, Gauge
import time

# Métricas Prometheus
prediction_counter = Counter('predictions_total', 'Total predictions made')
prediction_latency = Histogram('prediction_latency_seconds', 'Prediction latency')
fraud_rate = Gauge('fraud_rate', 'Current fraud detection rate')

@app.post("/predict")
def predict(transaction: Transaction):
    # Medir latency
    start_time = time.time()
    
    # Hacer predicción
    prediction = model.predict([transaction.dict().values()])[0]
    
    # Actualizar métricas
    prediction_counter.inc()
    prediction_latency.observe(time.time() - start_time)
    
    if prediction == 1:
        fraud_rate.inc()
    
    return {"is_fraud": bool(prediction)}
```

### Logging Estructurado

```python
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName
        }
        return json.dumps(log_data)

logger = logging.getLogger(__name__)
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)

@app.post("/predict")
def predict(transaction: Transaction):
    logger.info("Prediction request", extra={
        "transaction_id": transaction.id,
        "amount": transaction.amount
    })
    
    prediction = model.predict(...)
    
    logger.info("Prediction made", extra={
        "transaction_id": transaction.id,
        "prediction": prediction,
        "latency_ms": latency
    })
    
    return {"prediction": prediction}
```

## 6. Feature Store

```python
from feast import FeatureStore, Entity, FeatureView, Field
from feast.types import Int64, Float32
from datetime import timedelta

# Definir entity
user = Entity(
    name="user",
    join_keys=["user_id"]
)

# Definir feature view
user_features = FeatureView(
    name="user_transaction_features",
    entities=[user],
    ttl=timedelta(days=1),
    schema=[
        Field(name="avg_transaction_amount", dtype=Float32),
        Field(name="transaction_count_7d", dtype=Int64),
        Field(name="max_transaction_amount", dtype=Float32)
    ],
    source=BigQuerySource(
        table="project.dataset.user_features"
    )
)

# Usar en training
fs = FeatureStore(".")
features = fs.get_historical_features(
    entity_df=training_data,
    features=[
        "user_transaction_features:avg_transaction_amount",
        "user_transaction_features:transaction_count_7d"
    ]
).to_df()

# Usar en inference (online serving)
features = fs.get_online_features(
    features=[
        "user_transaction_features:avg_transaction_amount"
    ],
    entity_rows=[{"user_id": 12345}]
).to_dict()
```

## Best Practices

### 1. Reproducibilidad

```python
# requirements.txt con versiones fijas
numpy==1.24.3
scikit-learn==1.3.0
pandas==2.0.3

# Seed para reproducibilidad
np.random.seed(42)
random.seed(42)

# Guardar environment info
import platform
info = {
    "python_version": platform.python_version(),
    "packages": {pkg.key: pkg.version for pkg in pkg_resources.working_set}
}
mlflow.log_dict(info, "environment.json")
```

### 2. Model Versioning

```
models/
├── v1.0.0/
│   ├── model.pkl
│   ├── scaler.pkl
│   └── metadata.json
├── v1.1.0/
│   ├── model.pkl
│   └── metadata.json
└── current -> v1.1.0/  # Symlink
```

### 3. A/B Testing

```python
import random

def get_model_version(user_id):
    """Route 10% traffic to new model"""
    if hash(user_id) % 100 < 10:
        return "v2-challenger"
    return "v1-champion"

@app.post("/predict")
def predict(transaction: Transaction):
    model_version = get_model_version(transaction.user_id)
    model = models[model_version]
    
    prediction = model.predict(...)
    
    # Log for analysis
    mlflow.log_metric(f"{model_version}_prediction", prediction)
    
    return {"prediction": prediction}
```

## Herramientas del Ecosistema

| Categoría | Herramientas |
|-----------|-------------|
| **Data Versioning** | DVC, Pachyderm, lakeFS |
| **Experiment Tracking** | MLflow, Weights & Biases, Neptune |
| **Feature Store** | Feast, Tecton, Hopsworks |
| **Model Serving** | MLflow, BentoML, Seldon, KServe |
| **Monitoring** | Evidently, WhyLabs, Arize |
| **Orchestration** | Airflow, Prefect, Kubeflow |
| **CI/CD** | GitHub Actions, GitLab CI, Jenkins |

## Conclusión

MLOps convierte experimentos en productos:

- ✅ **Reproducibilidad**: DVC versiona data, Git versiona código
- ✅ **Trazabilidad**: MLflow trackea experimentos y modelos
- ✅ **Automation**: CI/CD entrena y deploya automáticamente
- ✅ **Monitoring**: Detecta drift y degradación
- ✅ **Escalabilidad**: Docker + Kubernetes para production

**Next Steps:**
1. Implementar DVC para versionar tu data
2. Trackear experimentos con MLflow
3. Automatizar training con GitHub Actions
4. Deployar modelo con Docker + FastAPI
5. Monitorear performance en producción

---

**Recursos:**
- [MLflow Docs](https://mlflow.org/docs/latest/index.html)
- [DVC Tutorial](https://dvc.org/doc/start)
- [Evidently AI](https://docs.evidentlyai.com/)
