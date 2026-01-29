# 📝 Plantilla para Nuevos Posts

Copia este contenido para crear un nuevo artículo en tu blog.

---

## 📋 Instrucciones Rápidas

1. **Crea un archivo** en la carpeta `_posts/` con el formato:
   ```
   YYYY-MM-DD-titulo-del-articulo.md
   ```
   Ejemplo: `2026-01-28-introduccion-machine-learning.md`

2. **Copia el contenido de abajo** (desde el primer `---` hasta el final)

3. **Personaliza** el front matter y el contenido

4. **Guarda** y haz commit

---

## 📄 PLANTILLA PARA COPIAR

```markdown
---
title: "Tu Título Aquí"
date: 2026-01-28 10:00:00 -0600
author: "Tu Nombre"
category: "Machine Learning"
tags: ["AI", "Tutorial", "Python"]
description: "Descripción breve de 1-2 líneas para SEO y previews en redes sociales"
comments: true
---

# Introducción

Comienza tu artículo con una introducción atractiva que enganche al lector. Explica de qué trata el artículo y qué aprenderá.

## Primera Sección

### Subsección

Desarrolla tu contenido aquí. Puedes usar:

- **Negrita** para resaltar
- *Cursiva* para énfasis
- `código inline` para comandos o código corto

### Ejemplo con Lista

Elementos importantes:

1. Primer punto
2. Segundo punto
3. Tercer punto

O lista con viñetas:

- Punto A
- Punto B
  - Sub-punto B.1
  - Sub-punto B.2
- Punto C

## Segunda Sección: Código

### Código Python

```python
# Ejemplo de código Python
import numpy as np
import pandas as pd

def entrenar_modelo(datos):
    """
    Función de ejemplo para entrenar un modelo
    """
    modelo = RandomForestClassifier()
    modelo.fit(datos.X, datos.y)
    return modelo

# Uso
resultado = entrenar_modelo(mis_datos)
print(f"Precisión: {resultado.score():.2f}")
```

### Código JavaScript

```javascript
// Ejemplo de código JavaScript
const analizarDatos = (datos) => {
  const resultado = datos.map(item => {
    return {
      id: item.id,
      procesado: procesarItem(item)
    };
  });
  
  return resultado;
};
```

### Comando de Terminal

```bash
# Instalación de dependencias
pip install tensorflow numpy pandas matplotlib

# Ejecutar script
python entrenar_modelo.py --epochs 100 --batch-size 32
```

## Tercera Sección: Multimedia

### Agregar Imágenes

Desde una URL:

![Descripción de la imagen](https://ejemplo.com/imagen.jpg)

Desde assets local:

![Red neuronal]({{ '/assets/images/red-neuronal.png' | relative_url }})

### Agregar Enlaces

Visita [mi sitio web](https://ejemplo.com) para más información.

Enlace a otro post del blog:

```liquid
[Ver artículo relacionado]({{ site.baseurl }}{% post_url 2026-01-25-titulo-del-post %})
```

Reemplaza `2026-01-25-titulo-del-post` con la fecha y título real de otro artículo en tu blog.

## Cuarta Sección: Tablas y Citas

### Tabla de Comparación

| Modelo | Precisión | Velocidad | Memoria |
|--------|-----------|-----------|---------|
| BERT   | 95%       | Media     | Alta    |
| GPT-3  | 92%       | Baja      | Muy Alta|
| RoBERTa| 96%       | Media     | Alta    |

### Cita Importante

> "La inteligencia artificial es la nueva electricidad."
> — Andrew Ng

O una cita más larga:

> La IA no es solo tecnología, es una forma de pensar sobre problemas complejos
> y encontrar soluciones innovadoras que antes no eran posibles.

## Quinta Sección: Elementos Especiales

### Matemáticas (si tienes MathJax)

Fórmula inline: $E = mc^2$

Fórmula en bloque:

$$
f(x) = \int_{-\infty}^{\infty} e^{-x^2} dx
$$

### Advertencias y Notas

**⚠️ Importante:** Este paso es crucial para el funcionamiento correcto.

**💡 Tip:** Para mejores resultados, usa un learning rate bajo.

**📝 Nota:** Los resultados pueden variar según tu hardware.

### Lista de Tareas

- [x] Tarea completada
- [x] Otra tarea completada
- [ ] Tarea pendiente
- [ ] Otra tarea pendiente

## Conclusión

Resumen de los puntos clave:

1. Primer punto importante
2. Segundo punto importante
3. Llamado a la acción o próximos pasos

Gracias por leer. Si tienes preguntas, déjalas en los comentarios abajo 👇

---

### Referencias

- [Referencia 1](https://ejemplo.com)
- [Referencia 2](https://ejemplo.com)
- [Paper importante](https://arxiv.org/abs/xxxxx)

### Etiquetas

#MachineLearning #AI #Tutorial #Python
```

---

## 🎯 Campos del Front Matter

### Obligatorios:

- **title**: El título principal del artículo
- **date**: Fecha en formato `YYYY-MM-DD HH:MM:SS -0600`
- **author**: Nombre del autor
- **category**: UNA categoría (singular)

### Opcionales:

- **tags**: Array de tags `["Tag1", "Tag2"]`
- **description**: Descripción para SEO
- **comments**: `true` o `false`
- **image**: URL de imagen destacada
- **excerpt**: Resumen personalizado

---

## 📚 Categorías Disponibles

Elige UNA de estas categorías:

- Machine Learning
- Deep Learning
- NLP
- Computer Vision
- Robótica
- Ética IA
- Tutorial
- Noticias
- Investigación

---

## 🏷️ Tags Sugeridos

Ejemplos de tags populares:

**Temas Generales:**
- AI, IA, Artificial Intelligence
- Machine Learning, ML
- Deep Learning, DL
- Neural Networks

**Frameworks/Herramientas:**
- TensorFlow, PyTorch, Keras
- Scikit-learn, NumPy, Pandas
- Transformers, Hugging Face
- OpenAI, GPT, BERT

**Lenguajes:**
- Python, Java, C++, Julia
- R, MATLAB

**Tipos de Contenido:**
- Tutorial, Guía, Introducción
- Avanzado, Principiantes
- Investigación, Paper
- Noticia, Actualidad
- Opinión, Análisis

**Dominios:**
- NLP, Computer Vision, Speech
- Reinforcement Learning
- Generative AI, LLM
- MLOps, AutoML

---

## ✅ Checklist Antes de Publicar

Verifica que tu artículo tenga:

- [ ] Nombre de archivo: `YYYY-MM-DD-titulo.md`
- [ ] Front matter completo entre `---`
- [ ] Título descriptivo y atractivo
- [ ] Fecha correcta
- [ ] Categoría válida
- [ ] Al menos 2-3 tags
- [ ] Introducción clara
- [ ] Secciones bien estructuradas con `##` y `###`
- [ ] Código con sintaxis highlight (especificar lenguaje)
- [ ] Imágenes con alt text descriptivo
- [ ] Enlaces funcionando
- [ ] Conclusión o resumen
- [ ] Revisión ortográfica
- [ ] Mínimo 300-500 palabras

---

## 🚀 Publicar el Artículo

### Opción 1: Desde GitHub Web

1. Ve a `_posts/` en tu repositorio
2. Click "Add file" → "Create new file"
3. Nombre: `2026-01-28-titulo.md`
4. Pega el contenido
5. Commit

### Opción 2: Desde tu Computadora

```powershell
# Crear archivo
code _posts\2026-01-28-mi-articulo.md

# (Editar y guardar)

# Publicar
git add _posts/
git commit -m "Nuevo artículo: Mi Artículo"
git push origin main
```

### Opción 3: Probar Localmente Primero

```powershell
# Crear el archivo
code _posts\2026-01-28-mi-articulo.md

# Iniciar servidor local
bundle exec jekyll serve --livereload

# Ver en: http://localhost:4000

# Cuando esté listo, publicar
git add _posts/
git commit -m "Nuevo artículo: Mi Artículo"
git push origin main
```

---

## 💡 Tips Extra

### URLs Amigables

El nombre del archivo determina la URL:

```
_posts/2026-01-28-introduccion-tensorflow.md
→ https://tu-blog.com/2026/01/28/introduccion-tensorflow/
```

### Programar Publicación

Pon fecha futura = no se muestra hasta esa fecha:

```yaml
date: 2026-02-15 10:00:00 -0600  # Se publicará el 15 de febrero
```

### Borradores

Crea carpeta `_drafts/` y guarda sin fecha:

```
_drafts/articulo-en-progreso.md
```

Ver borradores:
```bash
bundle exec jekyll serve --drafts
```

---

¡Listo para crear contenido increíble! 🎉
