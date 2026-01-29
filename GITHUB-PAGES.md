# 🚀 Despliegue en GitHub Pages

Este blog está configurado para desplegarse automáticamente en GitHub Pages con Jekyll.

## 📋 Requisitos

- Repositorio en GitHub
- GitHub Pages habilitado
- Cuenta de GitHub para comentarios (Utterances)

## ⚙️ Configuración Inicial

### 1. Actualizar configuración del repositorio

Edita [_config.yml](_config.yml) y actualiza:

```yaml
# Información básica
title: AI Tech Blog
description: Tu descripción aquí
author: Tu Nombre
email: tu@email.com
url: "https://tu-usuario.github.io"  # O tu dominio personalizado
baseurl: "/blogtc"  # Si el repo no es tu-usuario.github.io, usa /nombre-repo

# Comentarios
comments:
  utterances:
    repo: "tu-usuario/blogtc"  # ⚠️ IMPORTANTE: Cambia esto
```

### 2. Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. **Settings** → **Pages**
3. En **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click en **Save**
5. Espera 1-2 minutos

Tu sitio estará en: `https://tu-usuario.github.io/blogtc/`

### 3. Configurar Utterances (Comentarios)

Los comentarios se almacenan como GitHub Issues en tu repositorio.

1. Ve a tu repositorio en GitHub
2. **Settings** → **Features**
3. Asegúrate que **Issues** esté habilitado ✓

4. Instala la app de Utterances:
   - Ve a: https://github.com/apps/utterances
   - Click en **Install**
   - Selecciona tu repositorio
   - Autoriza la app

5. Actualiza `_config.yml`:
   ```yaml
   comments:
     utterances:
       repo: "tu-usuario/blogtc"  # Tu usuario y repositorio
   ```

¡Listo! Los comentarios funcionarán automáticamente.

## 📝 Publicar Nuevos Artículos

### Método 1: Desde tu computadora (recomendado)

1. Crea archivo en `_posts/YYYY-MM-DD-titulo.md`
2. Agrega el front matter:
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
   ```
3. Escribe contenido en Markdown
4. Commit y push:
   ```bash
   git add _posts/
   git commit -m "Nuevo artículo: Mi Artículo"
   git push origin main
   ```
5. GitHub Pages rebuilds automáticamente (1-2 min)

### Método 2: Desde GitHub Web

1. Ve a tu repositorio en GitHub
2. Navega a `_posts/`
3. Click en **Add file** → **Create new file**
4. Nombra: `2026-01-28-mi-articulo.md`
5. Agrega contenido con front matter
6. Click en **Commit new file**
7. Espera rebuild automático

## 🎨 Personalizar el Diseño

El diseño dark tech está en [assets/css/main.css](assets/css/main.css).

### Cambiar colores principales:

```css
:root {
    --primary: #00d4ff;    /* Cyan - Color principal */
    --accent: #b794f6;     /* Púrpura - Acento */
    --bg-dark: #0a0e27;    /* Background oscuro */
    --bg-card: #0f1729;    /* Cards */
}
```

## 🌐 Dominio Personalizado (Opcional)

Si tienes un dominio propio (ej: `miblog.com`):

1. Crea archivo `CNAME` en la raíz:
   ```
   miblog.com
   ```

2. Configura DNS en tu proveedor:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   ```

3. Espera propagación DNS (hasta 24 horas)

4. En GitHub Pages settings:
   - Custom domain: `miblog.com`
   - ☑ Enforce HTTPS

## 📊 Analytics (Opcional)

### Google Analytics

1. Crea cuenta en [analytics.google.com](https://analytics.google.com)
2. Obtén tu ID (formato: `G-XXXXXXXXXX`)
3. Descomenta en `_config.yml`:
   ```yaml
   google_analytics: G-XXXXXXXXXX
   ```

### Plausible Analytics (alternativa privacy-friendly)

1. Crea cuenta en [plausible.io](https://plausible.io)
2. Descomenta en `_config.yml`:
   ```yaml
   plausible_domain: tu-dominio.com
   ```

## 🔧 Desarrollo Local

### Instalar dependencias:
```bash
bundle install
```

### Ejecutar servidor local:
```bash
bundle exec jekyll serve --livereload
```

Abre: http://localhost:4000/blogtc/

### Build para producción:
```bash
bundle exec jekyll build
```

## 📱 PWA (Progressive Web App)

El blog incluye funcionalidad PWA:
- **Offline**: Funciona sin internet
- **Instalable**: Se puede instalar en móvil/escritorio
- **Rápido**: Cache inteligente

Los archivos PWA son:
- [manifest.json](manifest.json)
- [sw.js](sw.js)
- [offline.html](offline.html)

## ✅ Checklist de Despliegue

- [ ] Actualizar `url` y `baseurl` en `_config.yml`
- [ ] Actualizar `repo` de Utterances en `_config.yml`
- [ ] GitHub Pages habilitado en Settings
- [ ] Issues habilitados en repositorio
- [ ] Utterances app instalada
- [ ] Primer artículo publicado
- [ ] Sitio accesible en GitHub Pages
- [ ] Comentarios funcionando

## 🆘 Solución de Problemas

### El sitio no se despliega

**Error:** `Page build failed`

**Solución:**
1. Ve a Actions tab en GitHub
2. Revisa el log del último workflow
3. Busca errores de Jekyll
4. Verifica sintaxis en `_config.yml`

### Los comentarios no aparecen

**Causa:** Utterances no configurado

**Solución:**
1. Verifica que Issues esté habilitado
2. Instala Utterances app
3. Confirma el repo en `_config.yml`
4. Hard refresh (Ctrl+Shift+R)

### CSS/JS no carga

**Causa:** `baseurl` incorrecto

**Solución:**
```yaml
# Si tu repo es: github.com/usuario/blogtc
# Y el sitio es: usuario.github.io/blogtc
baseurl: "/blogtc"

# Si tu repo es: github.com/usuario/usuario.github.io
baseurl: ""
```

### Imágenes rotas

**Usa rutas relativas:**
```markdown
![Imagen]({{ '/assets/images/foto.jpg' | relative_url }})
```

## 📚 Recursos

- **Jekyll Docs:** https://jekyllrb.com/docs/
- **GitHub Pages Docs:** https://docs.github.com/pages
- **Utterances:** https://utteranc.es/
- **Markdown Guide:** https://www.markdownguide.org/

## 🎉 ¡Listo!

Tu blog ahora está completamente funcional con:
- ✅ Hosting gratuito en GitHub Pages
- ✅ HTTPS automático
- ✅ Comentarios con GitHub Issues
- ✅ Diseño dark tech responsive
- ✅ PWA offline-first
- ✅ Sin dependencias externas (Disqus, Netlify)
- ✅ 100% open source

---

**Costos:** $0/mes
**Deploy:** Automático con git push
**Mantenimiento:** Mínimo

¡Feliz blogging! 🚀
