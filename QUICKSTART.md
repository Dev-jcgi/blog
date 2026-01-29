# 🚀 Guía de Inicio Rápido - Jekyll

## ⚡ Opción 1: Desarrollo Local (Windows)

### 1. Instalar Ruby

Descarga e instala Ruby desde: https://rubyinstaller.org/

**Pasos**:
1. Descarga "Ruby+Devkit 3.2.X (x64)"
2. Ejecuta el instalador
3. En la última pantalla, marca "Run 'ridk install'"
4. En la consola que aparece, presiona Enter (opción 1, 2, 3)

### 2. Verificar Instalación

```powershell
ruby -v
gem -v
```

### 3. Instalar Jekyll y Bundler

```powershell
gem install jekyll bundler
```

### 4. Navegar al Proyecto e Instalar Dependencias

```powershell
cd d:\jc-gi\blogtc
bundle install
```

### 5. Ejecutar el Servidor Local

```powershell
bundle exec jekyll serve
```

### 6. Ver el Blog

Abre tu navegador en: `http://localhost:4000`

**¡Listo! El blog está corriendo localmente.**

---

## 🌐 Opción 2: Desplegar en GitHub Pages

### Paso 1: Inicializar Git (si no lo has hecho)

```powershell
cd d:\jc-gi\blogtc
git init
```

### Paso 2: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `ai-tech-blog` (o el que quieras)
3. **Público**
4. **NO** marques "Initialize with README"
5. Click "Create repository"

### Paso 3: Conectar y Subir

```powershell
git add .
git commit -m "Initial commit: AI Tech Blog con Jekyll"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/ai-tech-blog.git
git push -u origin main
```

### Paso 4: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** (⚙️) → **Pages** (en el menú lateral)
3. En **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**

### Paso 5: Esperar y Verificar

- Espera 2-5 minutos
- Tu blog estará en: `https://TU-USUARIO.github.io/ai-tech-blog`
- Verás una notificación verde en Settings → Pages con la URL

---

## ✍️ Crear Tu Primer Post

### 1. Crear Archivo

Crea un nuevo archivo en la carpeta `_posts/` con el nombre:
```
2026-01-28-mi-primer-post.md
```

### 2. Añadir Contenido

```markdown
---
layout: post
title: "Mi Primera Publicación sobre IA"
date: 2026-01-28
category: Tutorial
excerpt: "Aprende a crear contenido increíble en este blog de IA"
image: https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800
tags:
  - Tutorial
  - Primeros Pasos
  - IA
author: Tu Nombre
---

## Introducción

¡Bienvenido a mi blog de Inteligencia Artificial!

Este es mi primer post y estoy emocionado de compartir...

## Contenido

### Subtítulo

Aquí puedes escribir sobre:

- Machine Learning
- Deep Learning
- NLP
- Y mucho más

### Código

```python
def saludar():
    print("¡Hola, Mundo de la IA!")

saludar()
```

## Conclusión

Este es solo el comienzo de una gran aventura...
```

### 3. Guardar y Ver

**Si estás en local**:
- Guarda el archivo
- Jekyll detectará el cambio automáticamente
- Refresca el navegador

**Si estás en GitHub**:
```powershell
git add _posts/2026-01-28-mi-primer-post.md
git commit -m "Nuevo post: Mi primera publicación"
git push
```

---

## 🎨 Personalización Rápida

### Cambiar Información del Sitio

Edita `_config.yml`:

```yaml
title: Mi Blog de IA              # ← Cambia esto
description: Mi descripción       # ← Y esto
author: Tu Nombre                 # ← Tu nombre
email: tu@email.com              # ← Tu email
github_username: tu-usuario      # ← Tu usuario GitHub
```

**Importante**: Después de editar `_config.yml`, reinicia el servidor:
```powershell
# Ctrl+C para detener
bundle exec jekyll serve
```

### Cambiar Colores

Edita `assets/css/main.css` (alrededor de la línea 2):

```css
:root {
    --primary: #00d4ff;      /* ← Color principal */
    --secondary: #ff006e;    /* ← Color secundario */
    --accent: #8338ec;       /* ← Color de acento */
}
```

---

## ⚡ Comandos Útiles

### Desarrollo Local

```powershell
# Iniciar servidor
bundle exec jekyll serve

# Iniciar con drafts (borradores)
bundle exec jekyll serve --drafts

# Forzar reconstrucción
bundle exec jekyll serve --force_polling

# Build sin servir
bundle exec jekyll build
```

### Git

```powershell
# Ver estado
git status

# Agregar todos los cambios
git add .

# Commit con mensaje
git commit -m "Descripción de cambios"

# Push a GitHub
git push

# Ver últimos commits
git log --oneline
```

---

## 🆘 Solución Rápida de Problemas

### "Jekyll no se reconoce"

Cierra y abre PowerShell de nuevo, o ejecuta:
```powershell
refreshenv
```

### "Could not find gem"

```powershell
bundle update
bundle install
```

### Puerto 4000 ocupado

```powershell
# Usa otro puerto
bundle exec jekyll serve --port 4001
```

### Cambios no se ven

1. Detén el servidor (Ctrl+C)
2. Borra `.jekyll-cache` y `_site`:
   ```powershell
   Remove-Item -Recurse -Force .jekyll-cache, _site
   ```
3. Reinicia: `bundle exec jekyll serve`

---

## 📝 Checklist de Configuración Inicial

- [ ] Ruby instalado
- [ ] Jekyll y Bundler instalados
- [ ] Dependencias instaladas (`bundle install`)
- [ ] Servidor local funcionando
- [ ] `_config.yml` personalizado con tu información
- [ ] Primer post creado
- [ ] Git inicializado
- [ ] Repositorio en GitHub creado
- [ ] Código subido a GitHub
- [ ] GitHub Pages activado
- [ ] Blog accesible en la URL de GitHub Pages

---

¡Felicidades! 🎉 Tu blog de IA está listo.

**Próximos pasos**: Crea más posts, personaliza el diseño, y comparte tu conocimiento con el mundo.
