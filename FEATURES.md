# Guía de Uso - Blog Jekyll con Funcionalidades Avanzadas

## Funcionalidades Implementadas

### ✅ 1. Paginación de Posts
Los posts se muestran con paginación en la página principal. Configurado para 9 posts por página.

**Ubicación**: [blog.html](blog.html)

### ✅ 2. Página de Categorías
Muestra todos los posts organizados por categorías.

**URL**: `/categorias/`
**Ubicación**: [categorias.html](categorias.html)

### ✅ 3. Página de Tags
Nube de tags y posts organizados por etiquetas.

**URL**: `/tags/`
**Ubicación**: [tags.html](tags.html)

### ✅ 4. Búsqueda Avanzada con Lunr.js
Búsqueda en tiempo real por título, contenido, categoría y tags.

**URL**: `/buscar/`
**Ubicación**: [buscar.html](buscar.html)

### ✅ 5. Modo Claro/Oscuro
Toggle en el header para cambiar entre temas claro y oscuro.

**Implementación**: 
- CSS: Variables de color en [assets/css/main.css](assets/css/main.css)
- JS: Toggle en [assets/js/main.js](assets/js/main.js)

### ✅ 6. Compartir en Redes Sociales
Botones mejorados para compartir en Twitter, LinkedIn, Facebook, WhatsApp, Telegram y copiar enlace.

**Ubicación**: [_includes/share-buttons.html](_includes/share-buttons.html)

### ✅ 7. Sistema de Comentarios
Soporta Utterances (GitHub) y Disqus.

**Configuración en _config.yml**:
```yaml
comments:
  provider: "utterances"  # o "disqus"
  utterances:
    repo: "tu-usuario/tu-repo"
    issue-term: "pathname"
    theme: "github-dark"
```

**Ubicación**: [_includes/comments.html](_includes/comments.html)

### ✅ 8. Analytics Integrado
Soporte para Google Analytics y Plausible Analytics.

**Configuración en _config.yml**:
```yaml
google_analytics: G-XXXXXXXXXX
# o
plausible_domain: tudominio.com
```

**Ubicación**: [_includes/analytics.html](_includes/analytics.html)

### ✅ 9. PWA (Progressive Web App)
El blog funciona como una aplicación instalable y trabaja offline.

**Archivos**:
- [manifest.json](manifest.json) - Configuración de la PWA
- [sw.js](sw.js) - Service Worker para caché
- [offline.html](offline.html) - Página offline

### ✅ 10. Archivo de Posts por Fecha
Timeline con todos los posts organizados por año y mes.

**URL**: `/archivo/`
**Ubicación**: [archivo.html](archivo.html)

### ✅ 11. Posts Relacionados
Muestra automáticamente posts relacionados basados en categoría y tags.

**Ubicación**: [_includes/related-posts.html](_includes/related-posts.html)

### ✅ 12. Tabla de Contenidos Automática
Genera automáticamente un índice navegable para posts largos.

**Ubicación**: [_includes/toc.html](_includes/toc.html)

## Configuración

### 1. Actualizar _config.yml

Edita el archivo `_config.yml` con tu información:

```yaml
title: Tu Blog
description: Descripción de tu blog
author: Tu Nombre
email: tu@email.com
url: https://tudominio.com

# Comentarios
comments:
  provider: "utterances"
  utterances:
    repo: "tu-usuario/tu-repo"
    issue-term: "pathname"
    theme: "github-dark"

# Analytics
google_analytics: G-XXXXXXXXXX

# PWA
pwa:
  enabled: true
  theme_color: "#00d4ff"
  background_color: "#0a0e27"
```

### 2. Crear Posts

Crea archivos en `_posts/` con el formato: `YYYY-MM-DD-titulo.md`

```markdown
---
layout: post
title: "Título del Post"
date: 2026-01-28
category: "Machine Learning"
tags: [IA, Tutorial, Python]
excerpt: "Breve descripción del post"
image: "URL_de_imagen" (opcional)
comments: true
---

Tu contenido aquí...

## Sección 1
Contenido...

## Sección 2
Más contenido...
```

### 3. Iconos PWA (Opcional)

Para la PWA, crea iconos en `assets/images/` con los siguientes tamaños:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

Puedes usar herramientas online como https://realfavicongenerator.net/

### 4. Configurar Comentarios

#### Para Utterances (Recomendado):
1. Instala Utterances en tu repositorio de GitHub
2. Actualiza `_config.yml` con tu repo

#### Para Disqus:
1. Crea una cuenta en Disqus
2. Obtén tu shortname
3. Actualiza `_config.yml`

### 5. Configurar Analytics

#### Google Analytics:
1. Crea una propiedad en Google Analytics
2. Obtén tu ID (G-XXXXXXXXXX)
3. Añade al `_config.yml`

#### Plausible (alternativa privacy-focused):
1. Registra tu dominio en Plausible
2. Añade el dominio al `_config.yml`

## Uso

### Ejecutar localmente

```powershell
# Instalar dependencias
bundle install

# Servir el sitio
bundle exec jekyll serve

# O usar el script
.\serve.ps1
```

Visita: http://localhost:4000

### Desplegar

#### GitHub Pages:
1. Push a tu repositorio
2. Habilita GitHub Pages en Settings > Pages
3. Selecciona la rama `main` o `gh-pages`

#### Netlify/Vercel:
1. Conecta tu repositorio
2. Build command: `jekyll build`
3. Publish directory: `_site`

## Personalización

### Colores
Edita las variables CSS en [assets/css/main.css](assets/css/main.css):

```css
:root {
    --primary: #00d4ff;
    --accent: #8338ec;
    /* ... más colores */
}
```

### Tema Claro
El tema claro se define en la sección `[data-theme="light"]` del CSS.

## Características Adicionales

- **Barra de progreso de lectura** en posts
- **Lazy loading** de imágenes
- **Smooth scrolling** en navegación
- **Responsive design** optimizado para móviles
- **SEO optimizado** con Jekyll SEO Tag
- **RSS Feed** automático
- **Sitemap** generado automáticamente

## Troubleshooting

### Los posts no aparecen
- Verifica que el formato de fecha sea correcto: `YYYY-MM-DD`
- Asegúrate de que la fecha no sea futura

### La búsqueda no funciona
- Verifica que Lunr.js se esté cargando correctamente
- Revisa la consola del navegador para errores

### PWA no se instala
- Asegúrate de servir el sitio por HTTPS
- Verifica que manifest.json y sw.js estén accesibles
- Comprueba la consola de DevTools > Application

### Comentarios no aparecen
- Para Utterances: verifica que el repo sea público
- Para Disqus: confirma el shortname correcto

## Soporte

Para reportar problemas o sugerencias, crea un issue en el repositorio del proyecto.

## Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.
