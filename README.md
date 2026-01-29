# 🤖 AI Tech Blog

Blog moderno sobre Inteligencia Artificial con diseño dark tech, optimizado para GitHub Pages y Jekyll.

![Jekyll](https://img.shields.io/badge/Jekyll-CC0000?style=flat-square&logo=jekyll&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222?style=flat-square&logo=github&logoColor=white)
![Status](https://img.shields.io/badge/Status-Ready-success?style=flat-square)

## ✨ Características

- 🎨 **Diseño Dark Tech** responsive con efectos cyanpúrpura
- 💬 **Comentarios con Utterances** (GitHub Issues)
- 🔍 **Búsqueda real-time** con Lunr.js
- 📑 **Categorías y Tags** dinámicos
- 📅 **Archivo temporal** con timeline visual
- 🔗 **Posts relacionados** inteligentes
- 📖 **Tabla de contenidos** automática
- 📱 **PWA** con soporte offline
- ⚡ **GitHub Pages ready** - Deploy automático

## 🚀 Deploy en 3 Pasos

### 1. Actualiza `_config.yml`

```yaml
title: AI Tech Blog
author: Tu Nombre
email: tu@email.com
url: "https://tu-usuario.github.io"
baseurl: "/blogtc"

# Comentarios (importantes)
comments:
  utterances:
    repo: "tu-usuario/blogtc"  # ← Cambia esto
```

### 2. Habilita GitHub Pages

```bash
git add .
git commit -m "Configurar blog"
git push origin main
```

En GitHub: **Settings** → **Pages** → Source: `main` / → Save

### 3. Activa Utterances

1. Habilita **Issues** en tu repositorio
2. Instala: https://github.com/apps/utterances
3. Autoriza tu repositorio

**¡Listo!** Tu blog está en: `https://tu-usuario.github.io/blogtc`

## 📝 Publicar Artículos

### Desde GitHub Web

1. Ve a `_posts/`
2. **Add file** → **Create new file**
3. Nombre: `2026-01-28-mi-articulo.md`
4. Contenido:

```yaml
---
title: "Mi Artículo"
date: 2026-01-28 10:00:00 -0600
author: "Tu Nombre"
category: "Machine Learning"
tags: ["AI", "Tutorial"]
description: "Descripción breve"
comments: true
---

# Contenido

Tu artículo aquí en Markdown...
```

5. **Commit** → Espera 1-2 min → ¡Publicado!

### Desde tu computadora

```bash
# Crear artículo
nano _posts/2026-01-28-titulo.md

# Publicar
git add _posts/
git commit -m "Nuevo artículo"
git push origin main
```

## 🛠️ Desarrollo Local

```bash
# Instalar
bundle install

# Ejecutar
bundle exec jekyll serve --livereload

# Abrir
http://localhost:4000
```

## 🎨 Personalización

### Cambiar colores

Edita `assets/css/main.css`:

```css
:root {
    --primary: #00d4ff;      /* Cyan */
    --accent: #b794f6;       /* Púrpura */
    --bg-dark: #0a0e27;      /* Background */
    --bg-card: #0f1729;      /* Cards */
}
```

### Agregar Analytics

En `_config.yml`:

```yaml
# Google Analytics
google_analytics: G-XXXXXXXXXX

# O Plausible
plausible_domain: tu-dominio.com
```

### Dominio personalizado

Crea `CNAME`:
```
miblog.com
```

Configura DNS A records:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

## 📁 Estructura

```
blogtc/
├── _config.yml          # Configuración
├── _includes/           # Componentes
│   ├── header.html
│   ├── footer.html
│   ├── comments.html
│   └── toc.html
├── _layouts/            # Plantillas
│   ├── default.html
│   └── post.html
├── _posts/              # Artículos
│   └── YYYY-MM-DD-titulo.md
├── assets/
│   ├── css/main.css     # Estilos
│   └── js/main.js       # JavaScript
├── blog.html            # Paginación
├── categorias.html      # Categorías
├── tags.html            # Tags
├── buscar.html          # Búsqueda
└── index.html           # Home
```

## 🔌 Plugins Incluidos

- `jekyll-feed` - RSS feed
- `jekyll-seo-tag` - Meta tags SEO
- `jekyll-sitemap` - Sitemap XML
- `jekyll-paginate` - Paginación

Todos compatibles con GitHub Pages.

## 💡 Tips

### Optimizar imágenes

```markdown
![Alt]({{ '/assets/images/foto.jpg' | relative_url }})
```

### Links internos

```markdown
[Post]({{ site.baseurl }}{% post_url 2026-01-28-titulo %})
```

### Código con sintaxis

\`\`\`python
def hello():
    print("Hola AI!")
\`\`\`

## 🆘 Solución de Problemas

### Jekyll no instala

```bash
# Windows con RubyInstaller
ridk install

# Install gems
gem install jekyll bundler
```

### GitHub Pages no actualiza

- Espera 2-5 minutos
- Revisa **Actions** tab para errores
- Hard refresh: Ctrl+Shift+R

### Comentarios no aparecen

1. Verifica que Issues esté habilitado
2. Confirma Utterances instalado
3. Checa el `repo` en `_config.yml`

## 📚 Documentación

- **Guía completa:** [GITHUB-PAGES.md](GITHUB-PAGES.md)
- **Jekyll Docs:** https://jekyllrb.com/docs/
- **GitHub Pages:** https://docs.github.com/pages
- **Utterances:** https://utteranc.es/

## 📄 Licencia

MIT License - Uso libre personal y comercial

## 🤝 Contribuir

1. Fork el proyecto
2. Crea branch (`git checkout -b feature/mejora`)
3. Commit (`git commit -m 'Agregar mejora'`)
4. Push (`git push origin feature/mejora`)
5. Abre Pull Request

---

**💰 Costos:** $0/mes  
**🚀 Deploy:** Automático con cada push  
**⚙️ Mantenimiento:** Mínimo

**Hecho con ❤️ para la comunidad de IA**

⭐ **¿Te gusta el proyecto? ¡Dale una estrella!**
