# Guía de Optimización de Performance

## 🚀 Optimizaciones Implementadas

### ✅ Completadas

1. **Lazy Loading de Imágenes**
   - Atributo `loading="lazy"` en todas las imágenes
   - Atributo `decoding="async"` para rendering asíncrono
   - Dimensiones width/height especificadas (previene layout shift)

2. **SEO Avanzado**
   - Open Graph meta tags
   - Twitter Cards
   - JSON-LD structured data (BlogPosting, BreadcrumbList)
   - Canonical URLs
   - robots.txt y sitemap.xml

3. **Accesibilidad (A11y)**
   - Skip-to-content link
   - ARIA labels y roles apropiados
   - Focus visible mejorado
   - Navegación por teclado optimizada

4. **PWA Optimizado**
   - Service Worker con estrategia Network-First
   - Manifest.json completo
   - Página offline funcional
   - Caché inteligente de assets

5. **Analytics con Privacidad**
   - Soporte para Google Analytics 4 (con anonymize_ip)
   - Plausible Analytics (privacidad-primero)
   - GoatCounter (open source)

## 🔧 Optimizaciones Pendientes (Requieren Plugins)

### 1. Minificación de CSS/JS

**Opción A: Jekyll Minifier**
```ruby
# Gemfile
group :jekyll_plugins do
  gem 'jekyll-minifier'
end
```

**Opción B: Comprimir manualmente**
```bash
# Instalar herramientas
npm install -g csso-cli terser

# Minificar CSS
csso assets/css/main.css -o assets/css/main.min.css

# Minificar JS
terser assets/js/main.js -o assets/js/main.min.js -c -m
```

### 2. Critical CSS Inline

El Critical CSS son los estilos mínimos necesarios para el "above-the-fold" (lo que se ve sin scroll).

**Herramientas recomendadas:**
- https://jonassebastianohlsson.com/criticalpathcssgenerator/
- npm package: `critical`

**Implementación:**
```html
<!-- En _layouts/default.html, en <head> -->
<style>
  /* Critical CSS inline aquí */
  :root{--primary:#00d4ff;--bg-dark:#0a0e27}
  body{font-family:Inter,sans-serif;background:var(--bg-dark);color:#fff}
  .header{padding:1rem 0}
  /* ... más estilos críticos */
</style>

<!-- Cargar CSS completo asíncronamente -->
<link rel="preload" href="/assets/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/assets/css/main.css"></noscript>
```

### 3. Optimización de Fuentes

**Actual:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

**Optimizado:**
```html
<!-- Preconnect para reducir latencia -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Cargar fuentes con font-display: swap -->
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap" media="print" onload="this.media='all'">
```

**Mejor aún: Self-host las fuentes**
1. Descarga fuentes de Google Fonts
2. Usa `@font-face` en tu CSS
3. Sirve con `font-display: swap`

### 4. Compresión de Imágenes

**Herramientas recomendadas:**
- **TinyPNG**: https://tinypng.com/ (GUI)
- **ImageOptim**: https://imageoptim.com/ (Mac)
- **Squoosh**: https://squoosh.app/ (Web)

**Línea de comandos:**
```bash
# Instalar ImageMagick
# Windows: choco install imagemagick
# macOS: brew install imagemagick

# Optimizar todas las imágenes JPG
mogrify -quality 85 -strip assets/images/*.jpg

# Convertir a WebP (mejor compresión)
for file in assets/images/*.jpg; do
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done
```

**Implementar <picture> para WebP con fallback:**
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

### 5. Preload de Recursos Críticos

```html
<!-- En _layouts/default.html -->
<head>
  <!-- Preload del CSS principal -->
  <link rel="preload" href="/assets/css/main.css" as="style">
  
  <!-- Preload de la fuente principal -->
  <link rel="preload" href="/assets/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- DNS Prefetch para dominios externos -->
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
</head>
```

### 6. Lazy Loading de Scripts No Críticos

```html
<!-- Cargar Lunr.js solo en la página de búsqueda -->
{% if page.url contains '/buscar' %}
<script src="https://unpkg.com/lunr/lunr.js" defer></script>
{% endif %}

<!-- Cargar Analytics de forma asíncrona -->
<script async src="analytics.js"></script>
```

## 📊 Métricas Objetivo (Lighthouse)

| Métrica | Actual | Objetivo |
|---------|--------|----------|
| Performance | ~70 | 90+ |
| Accessibility | ~75 | 95+ |
| Best Practices | ~85 | 95+ |
| SEO | ~80 | 100 |

### Core Web Vitals Objetivos:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🛠️ Testing y Validación

### Herramientas de Testing:

1. **Lighthouse** (Chrome DevTools)
   ```bash
   lighthouse https://tu-blog.com --view
   ```

2. **PageSpeed Insights**
   https://pagespeed.web.dev/

3. **WebPageTest**
   https://www.webpagetest.org/

4. **GTmetrix**
   https://gtmetrix.com/

### Validadores:

- **HTML**: https://validator.w3.org/
- **CSS**: https://jigsaw.w3.org/css-validator/
- **Accesibilidad**: https://wave.webaim.org/
- **PWA**: Chrome DevTools > Lighthouse > PWA
- **Structured Data**: https://search.google.com/test/rich-results

## 📝 Checklist Pre-Deploy

- [ ] Ejecutar `bundle exec jekyll build` sin errores
- [ ] Validar HTML/CSS
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse SEO = 100
- [ ] PWA Installable = ✅
- [ ] Todos los links funcionan (HTMLProofer)
- [ ] Imágenes optimizadas (< 200KB cada una)
- [ ] Open Graph tags correctos (compartir en redes sociales)
- [ ] Sitemap.xml generado
- [ ] robots.txt configurado

## 🚀 Despliegue Optimizado en GitHub Pages

1. **Asegurar que Gemfile use github-pages gem**
   ```ruby
   gem "github-pages", "~> 232", group: :jekyll_plugins
   ```

2. **Configurar GitHub Actions para builds más rápidos** (opcional)
   ```yaml
   # .github/workflows/jekyll.yml
   name: Build and Deploy
   on: [push]
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: ruby/setup-ruby@v1
         - run: bundle install
         - run: bundle exec jekyll build
         - uses: actions/upload-pages-artifact@v1
   ```

3. **Habilitar compresión GZIP** (GitHub Pages lo hace automáticamente)

4. **Configurar CDN** (GitHub Pages usa Fastly CDN automáticamente)

## 📚 Recursos Adicionales

- **Web.dev**: https://web.dev/learn/
- **MDN Performance**: https://developer.mozilla.org/en-US/docs/Web/Performance
- **CSS Tricks**: https://css-tricks.com/snippets/
- **Can I Use**: https://caniuse.com/

---

**Estado Actual**: ✅ LISTO PARA DEPLOY (con optimizaciones manuales pendientes)
