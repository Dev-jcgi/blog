---
layout: post
title: "YOLO v8: Object Detection en Tiempo Real"
date: 2026-01-29 09:00:00 -0600
category: Computer Vision
tags: [yolo, object-detection, computer-vision, deep-learning, ultralytics]
excerpt: "Guía completa de YOLO v8: desde detección básica hasta entrenar modelos custom en tus propias imágenes. Inference en 3ms @ 640px."
image: /assets/images/posts/yolo-detection.jpg
reading_time: 12 min
---

**YOLO** (You Only Look Once) revolucionó Computer Vision al hacer object detection en **un solo forward pass**: 3ms de latency vs 2 segundos de R-CNN.

## YOLO v8: El Estado del Arte

```python
from ultralytics import YOLO

# Cargar modelo pre-entrenado
model = YOLO('yolov8n.pt')  # nano (más rápido)
# model = YOLO('yolov8s.pt')  # small
# model = YOLO('yolov8m.pt')  # medium
# model = YOLO('yolov8l.pt')  # large
# model = YOLO('yolov8x.pt')  # xlarge (más preciso)

# Detectar objetos
results = model('image.jpg')

# Visualizar
results[0].show()

# Acceder a detecciones
for box in results[0].boxes:
    class_id = int(box.cls)
    confidence = float(box.conf)
    bbox = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
    
    print(f"Detected: {model.names[class_id]} ({confidence:.2f})")
    print(f"BBox: {bbox}")
```

### Comparación de Modelos

| Model | Size (MB) | mAP@50-95 | Speed (ms) | Params (M) |
|-------|-----------|-----------|------------|------------|
| YOLOv8n | 6 | 37.3 | 1.5 | 3.2 |
| YOLOv8s | 22 | 44.9 | 2.8 | 11.2 |
| YOLOv8m | 52 | 50.2 | 5.9 | 25.9 |
| YOLOv8l | 87 | 52.9 | 9.1 | 43.7 |
| YOLOv8x | 136 | 53.9 | 12.4 | 68.2 |

**Trade-off:** nano para tiempo real (30+ FPS), xlarge para máxima precisión.

## Arquitectura YOLO v8

```
Input (640×640)
    ↓
[Backbone: CSPDarknet]
    ↓ (1× feature maps)
    ↓ (2× feature maps)
    ↓ (4× feature maps)
    ↓
[Neck: PANet + FPN]
    ↓ (multi-scale features)
    ↓
[Head: Decoupled]
    ├─→ [Classification] (80 clases COCO)
    └─→ [Regression] (bboxes)
    ↓
Output: boxes, classes, confidences
```

**Mejoras vs YOLOv5:**
- ❌ Anchor-free: no necesita anchor boxes predefinidos
- ✅ Decoupled head: separate classification y regression
- ✅ TaskAlignedAssigner: mejor loss function
- ✅ C2f modules: más eficiente que C3

## Detección Básica

```python
from ultralytics import YOLO
import cv2

model = YOLO('yolov8n.pt')

# 1. Imagen única
results = model('path/to/image.jpg')

# 2. Múltiples imágenes
results = model(['image1.jpg', 'image2.jpg'])

# 3. Video
results = model('video.mp4', stream=True)
for r in results:
    r.show()  # Mostrar frame por frame

# 4. Webcam en tiempo real
results = model(0, stream=True)  # 0 = default webcam
for r in results:
    frame = r.plot()  # Dibujar detecciones
    cv2.imshow('YOLO', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 5. YouTube stream
results = model('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
```

### Procesamiento de Detecciones

```python
results = model('image.jpg')
result = results[0]

# Bounding boxes
boxes = result.boxes.xyxy.cpu().numpy()  # [[x1, y1, x2, y2], ...]
confidences = result.boxes.conf.cpu().numpy()  # [0.95, 0.87, ...]
classes = result.boxes.cls.cpu().numpy()  # [0, 5, 2, ...]  (class IDs)

# Filtrar por confidence
high_conf = boxes[confidences > 0.7]

# Filtrar por clase (ej: solo personas = clase 0)
person_boxes = boxes[classes == 0]

# Guardar imagen con detecciones
annotated = result.plot()
cv2.imwrite('output.jpg', annotated)

# Guardar boxes como JSON
import json
detections = []
for box, conf, cls in zip(boxes, confidences, classes):
    detections.append({
        "class": model.names[int(cls)],
        "confidence": float(conf),
        "bbox": box.tolist()
    })
json.dump(detections, open('detections.json', 'w'))
```

## Entrenar Modelo Custom

### 1. Preparar Dataset

```
dataset/
├── images/
│   ├── train/
│   │   ├── img001.jpg
│   │   ├── img002.jpg
│   ├── val/
│   │   ├── img050.jpg
│   │   ├── img051.jpg
├── labels/
│   ├── train/
│   │   ├── img001.txt
│   │   ├── img002.txt
│   ├── val/
│       ├── img050.txt
│       ├── img051.txt
```

**Formato YOLO de labels** (`img001.txt`):
```
# class x_center y_center width height (normalized 0-1)
0 0.716797 0.395833 0.216406 0.147222
1 0.357031 0.422222 0.089844 0.177778
```

### 2. Dataset YAML

```yaml
# dataset.yaml
path: /path/to/dataset  # Root del dataset
train: images/train
val: images/val
test: images/test  # opcional

# Classes
names:
  0: defect_scratch
  1: defect_dent
  2: defect_crack
  3: OK

nc: 4  # Número de clases
```

### 3. Entrenar

```python
from ultralytics import YOLO

# Cargar modelo pre-entrenado (transfer learning)
model = YOLO('yolov8n.pt')

# Entrenar
results = model.train(
    data='dataset.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    device=0,  # GPU 0 (o 'cpu')
    workers=8,
    patience=20,  # Early stopping
    save=True,
    project='defect_detection',
    name='exp1'
)

# Resultados guardados en: defect_detection/exp1/
# - weights/best.pt
# - weights/last.pt
# - results.png (gráficas)
# - confusion_matrix.png
```

### Hiperparámetros

```python
model.train(
    data='dataset.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    
    # Learning rate
    lr0=0.01,        # Initial LR
    lrf=0.01,        # Final LR (lr0 * lrf)
    momentum=0.937,
    weight_decay=0.0005,
    
    # Augmentation
    hsv_h=0.015,     # Hue
    hsv_s=0.7,       # Saturation
    hsv_v=0.4,       # Value
    degrees=10.0,    # Rotation (±deg)
    translate=0.1,   # Translation (±%)
    scale=0.5,       # Scaling (±%)
    flipud=0.0,      # Vertical flip
    fliplr=0.5,      # Horizontal flip
    mosaic=1.0,      # Mosaic augmentation
    
    # Regularization
    dropout=0.0,
    label_smoothing=0.0,
    
    # Device
    device=0,        # GPU
    workers=8,
    cache=True       # Cache images in RAM
)
```

### 4. Evaluar

```python
# Cargar best model
model = YOLO('defect_detection/exp1/weights/best.pt')

# Evaluar en validation set
metrics = model.val()

print(f"mAP@50: {metrics.box.map50:.3f}")
print(f"mAP@50-95: {metrics.box.map:.3f}")
print(f"Precision: {metrics.box.p}")
print(f"Recall: {metrics.box.r}")

# Test en imágenes específicas
results = model.predict('test_images/', save=True)
```

## Técnicas Avanzadas

### 1. Data Augmentation

```python
from albumentations import Compose, HorizontalFlip, RandomBrightnessContrast, CLAHE

augment = Compose([
    HorizontalFlip(p=0.5),
    RandomBrightnessContrast(p=0.2),
    CLAHE(p=0.3)
])

# Aplicar antes de training
augmented = augment(image=image, bboxes=bboxes, class_labels=labels)
```

### 2. Ensemble de Modelos

```python
models = [
    YOLO('yolov8n.pt'),
    YOLO('yolov8s.pt'),
    YOLO('yolov8m.pt')
]

# Combinar predicciones
all_boxes = []
all_scores = []
for model in models:
    results = model('image.jpg')
    all_boxes.extend(results[0].boxes.xyxy)
    all_scores.extend(results[0].boxes.conf)

# Non-Maximum Suppression (NMS) para eliminar duplicados
from torchvision.ops import nms
keep = nms(all_boxes, all_scores, iou_threshold=0.5)
final_boxes = all_boxes[keep]
```

### 3. Test-Time Augmentation (TTA)

```python
# Predecir con múltiples augmentaciones y promediar
results = model('image.jpg', augment=True)
# Internamente hace: original + flipud + fliplr y promedia
```

### 4. Tracking (Reid)

```python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')

# Object tracking con ByteTrack
results = model.track(
    'video.mp4',
    stream=True,
    tracker='bytetrack.yaml'  # o 'botsort.yaml'
)

for r in results:
    for box in r.boxes:
        track_id = int(box.id)  # ID único del objeto
        print(f"Object {track_id} at {box.xyxy}")
```

## Optimización para Producción

### 1. Export a Formatos Optimizados

```python
model = YOLO('yolov8n.pt')

# ONNX (universal)
model.export(format='onnx')

# TensorRT (NVIDIA GPUs - 3× más rápido)
model.export(format='engine', device=0)

# CoreML (iOS/macOS)
model.export(format='coreml')

# TFLite (Android/Edge devices)
model.export(format='tflite')

# OpenVINO (Intel CPUs)
model.export(format='openvino')
```

### 2. Inference con TensorRT

```python
# Modelo exportado: yolov8n.engine
model = YOLO('yolov8n.engine')

# Inference 3× más rápido (1.5ms → 0.5ms)
results = model('image.jpg')
```

### 3. Batch Inference

```python
# Procesar múltiples imágenes a la vez
images = [f'image{i}.jpg' for i in range(100)]
results = model(images, batch=32)  # 32 imágenes por batch
```

### 4. Half Precision (FP16)

```python
model = YOLO('yolov8n.pt')
model.to('cuda')
model.half()  # FP32 → FP16 (2× más rápido, misma precisión)

results = model('image.jpg')
```

## Casos de Uso Reales

### 1. Safety Helmet Detection

```python
# Dataset: 5000 imágenes de trabajadores
# Classes: helmet, no_helmet, person

model = YOLO('yolov8s.pt')
model.train(
    data='helmet_dataset.yaml',
    epochs=100,
    imgsz=640,
    batch=16
)

# Deployment: Raspberry Pi 4 + webcam
# FPS: 8-10 con yolov8n.pt
# Alerta si detect 'no_helmet'
```

### 2. Product Quality Inspection

```python
# Dataset: 10k imágenes de piezas manufacturadas
# Classes: scratch, dent, crack, ok

# Training
model = YOLO('yolov8m.pt')
model.train(data='defects.yaml', epochs=150)

# Accuracy: 96.3% mAP@50
# Deployment: Conveyor belt @ 30 FPS
# ROI: 85% reduction in manual inspection
```

### 3. Traffic Monitoring

```python
# Detect vehicles, count traffic, detect violations
model = YOLO('yolov8l.pt')

# Classes: car, truck, bus, motorcycle, bicycle, person
results = model.track('traffic_cam.mp4', tracker='bytetrack.yaml')

# Count vehicles crossing line
line_y = 500
vehicle_count = 0

for r in results:
    for box in r.boxes:
        y_center = (box.xyxy[0][1] + box.xyxy[0][3]) / 2
        if y_center > line_y:
            vehicle_count += 1
```

## Troubleshooting

### Problema 1: Overfitting

```python
# Síntomas: train loss baja, val loss alta
# Soluciones:

# 1. Más data augmentation
model.train(
    data='dataset.yaml',
    mosaic=1.0,
    degrees=15,
    scale=0.7,
    mixup=0.1
)

# 2. Early stopping
model.train(patience=30)

# 3. Regularization
model.train(dropout=0.2, label_smoothing=0.1)
```

### Problema 2: Clases Desbalanceadas

```python
# Dataset: 90% OK, 5% defect_A, 5% defect_B

# Solución: Class weights en loss function
# (YOLOv8 hace esto automáticamente con class frequencies)

# O balancear dataset manualmente
from imblearn.over_sampling import RandomOverSampler

# Aumentar muestras de clases minoritarias
```

### Problema 3: Detecciones Pequeñas

```python
# Objetos < 32×32 píxeles difíciles de detectar

# Soluciones:

# 1. Aumentar resolución
model.train(imgsz=1280)  # Default: 640

# 2. Tile-based inference
# Dividir imagen grande en tiles, detectar en cada tile

# 3. Usar YOLOv8-P6 (diseñado para objetos pequeños)
model = YOLO('yolov8n-p6.pt')
```

## Comparación con Otros Detectores

| Model | mAP@50-95 | FPS (V100) | Params |
|-------|-----------|------------|--------|
| Faster R-CNN | 42.0 | 5 | 137M |
| SSD | 25.1 | 22 | 26M |
| RetinaNet | 40.8 | 11 | 36M |
| EfficientDet-D1 | 40.5 | 19 | 6.6M |
| **YOLOv8s** | **44.9** | **320** | **11M** |
| YOLOv7 | 51.2 | 161 | 37M |
| DINO | 58.5 | 9 | 218M |

**YOLO v8 gana en:**
- ✅ Speed (10-30× más rápido que R-CNN)
- ✅ Efficiency (menos params, menos VRAM)
- ✅ Ease of use (3 líneas de código)

**YOLO v8 pierde en:**
- ❌ Small object detection (< 32×32 px)
- ❌ Máxima precisión (DINO/DETR son mejores)

## Recursos

- **Ultralytics Docs**: [docs.ultralytics.com](https://docs.ultralytics.com)
- **YOLO Paper**: "You Only Look Once" (Redmon et al., 2016)
- **Dataset Labeling**: [Roboflow](https://roboflow.com), [Label Studio](https://labelstud.io)
- **Pre-trained Models**: [Ultralytics Hub](https://hub.ultralytics.com)

---

**Próximo:** NLP con spaCy para procesamiento de texto y Named Entity Recognition.
