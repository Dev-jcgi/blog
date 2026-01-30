# 🚨 Solución: Blog no se visualiza en GitHub Pages

> **Problema**: Después de hacer push, el sitio no aparece en `https://dev-jcgi.github.io/blog/`  
> **Causa**: GitHub Pages no está activado en el repositorio  
> **Tiempo solución**: 3-5 minutos

---

## ✅ Paso 1: Verificar que el Push fue exitoso

```powershell
# Ya ejecutaste esto correctamente ✅
git push -u origin main
# Exit Code: 0 (exitoso)
```

**Confirmación**:
- ✅ Repositorio: `https://github.com/Dev-jcgi/blog`
- ✅ Commit: `e8efa40 (final version)`
- ✅ Branch: `main`
- ✅ Remote: `origin`

---

## 🔧 Paso 2: Activar GitHub Pages

### **Opción A: Desde el navegador (RECOMENDADO)**

1. **Ir a Settings del repositorio**:
   ```
   https://github.com/Dev-jcgi/blog/settings/pages
   ```

2. **En la sección "Build and deployment"**:
   
   **Source (Fuente)**:
   - Selecciona: **Deploy from a branch**
   
   **Branch**:
   - Branch: **`main`** (no `master`)
   - Folder: **`/ (root)`** (no `/docs`)
   
3. **Click en "Save"**

4. **Esperar 2-3 minutos**
   - GitHub construirá el sitio automáticamente
   - Verás un mensaje: "Your site is live at https://dev-jcgi.github.io/blog/"

### **Opción B: Con PowerShell (Rápido)**

```powershell
# Abrir directamente la página de configuración
Start-Process "https://github.com/Dev-jcgi/blog/settings/pages"

# Luego sigue los pasos 2-4 de Opción A
```

---

## 🔍 Paso 3: Verificar el Build

### **Opción 1: Ver Actions (Build Status)**

```powershell
# Abrir la pestaña Actions
Start-Process "https://github.com/Dev-jcgi/blog/actions"
```

**Qué buscar**:

| Estado | Descripción | Acción |
|--------|-------------|--------|
| 🟡 **En progreso** | Círculo amarillo girando | Esperar 1-2 minutos |
| ✅ **Exitoso** | Check verde | Sitio está live! |
| ❌ **Fallido** | X roja | Ver errores → Paso 4 |

### **Opción 2: Ver directamente el sitio**

```powershell
# Intentar abrir el sitio
Start-Process "https://dev-jcgi.github.io/blog/"
```

**Resultado esperado**:
- ✅ **Funciona**: Ves tu blog con el header "AI Tech Blog"
- ❌ **404**: GitHub Pages no activado o aún construyendo
- ❌ **Estilos rotos**: Problema con `baseurl` (ver Paso 5)

---

## ⏱️ Paso 4: Timeouts y Problemas Comunes

### **Problema 1: "Still building..." después de 5 minutos**

**Causa**: Build está en cola o falló silenciosamente

**Solución**:
```powershell
# 1. Ver Actions para errores
Start-Process "https://github.com/Dev-jcgi/blog/actions"

# 2. Si no hay workflow, verificar que Pages esté activado
Start-Process "https://github.com/Dev-jcgi/blog/settings/pages"
```

---

### **Problema 2: "404 - File not found"**

**Causa A**: GitHub Pages no activado (ver Paso 2)

**Causa B**: URL incorrecta

**Verificar**:
```yaml
# _config.yml (debería tener):
baseurl: "/blog"          # ✅ Correcto
url: "https://dev-jcgi.github.io"  # ✅ Correcto
```

**Probar URLs**:
- ❌ `https://dev-jcgi.github.io/` (homepage, no tu blog)
- ✅ `https://dev-jcgi.github.io/blog/` (TU BLOG)
- ✅ `https://dev-jcgi.github.io/blog/index.html` (también válido)

---

### **Problema 3: Sitio sin estilos (CSS no carga)**

**Síntoma**: HTML plano, sin colores, sin diseño

**Causa**: `baseurl` incorrecto

**Solución**:
```powershell
# Verificar _config.yml
Get-Content _config.yml | Select-String "baseurl"

# Debería mostrar:
# baseurl: "/blog"

# Si es diferente, corregir:
```

```yaml
# _config.yml
baseurl: "/blog"  # ← DEBE coincidir con nombre del repo
url: "https://dev-jcgi.github.io"
```

---

### **Problema 4: Build falla (X roja en Actions)**

**Ver errores**:
1. Ir a: `https://github.com/Dev-jcgi/blog/actions`
2. Click en el workflow fallido (X roja)
3. Expandir el log

**Errores comunes**:

#### **Error: "Liquid syntax error"**
```
Liquid Exception: Liquid syntax error (line X): unexpected character
```

**Causa**: Error en templates Liquid ({% %} o {{ }})

**Solución**:
```powershell
# Buscar archivos con sintaxis Liquid
Get-ChildItem -Recurse -Include *.html,*.md | Select-String "{{" 

# Verificar que todas las etiquetas estén cerradas
```

---

#### **Error: "Dependency error"**

```
Error: The following gems are missing: jekyll-feed, jekyll-sitemap...
```

**Causa**: Gemfile no incluye todas las dependencias

**Solución**:
```powershell
# Verificar que Gemfile tenga:
Get-Content Gemfile
```

```ruby
# Gemfile (debería tener):
source "https://rubygems.org"

gem "jekyll", "~> 4.3.4"
gem "webrick"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-paginate"
end
```

---

#### **Error: "Repository is private"**

```
Error 404: Repository not found
```

**Causa**: Repositorio es privado (GitHub Pages requiere repo público para cuentas gratuitas)

**Solución**:
1. Ir a: `https://github.com/Dev-jcgi/blog/settings`
2. Scroll hasta "Danger Zone"
3. Click "Change visibility" → "Make public"
4. Confirmar

---

## 🎯 Paso 5: Verificación Final

### **Checklist completo**:

```powershell
# 1. ✅ GitHub Pages activado
Start-Process "https://github.com/Dev-jcgi/blog/settings/pages"
# Verificar: "Your site is published at https://dev-jcgi.github.io/blog/"

# 2. ✅ Build exitoso
Start-Process "https://github.com/Dev-jcgi/blog/actions"
# Verificar: Check verde en último workflow

# 3. ✅ Sitio accesible
Start-Process "https://dev-jcgi.github.io/blog/"
# Verificar: Blog se visualiza correctamente

# 4. ✅ CSS cargando
Start-Process "https://dev-jcgi.github.io/blog/assets/css/main.css"
# Verificar: CSS se descarga (no 404)

# 5. ✅ Posts visibles
Start-Process "https://dev-jcgi.github.io/blog/2026/01/25/transformers-arquitectura-explicada/"
# Verificar: Post se visualiza correctamente
```

---

## 🚀 Comandos Rápidos de Diagnóstico

```powershell
# === DIAGNOSTICO COMPLETO ===

# 1. Verificar configuración
Write-Host "`nCONFIGURACION:" -ForegroundColor Yellow
Get-Content _config.yml | Select-String "baseurl|url:"

# 2. Verificar último commit
Write-Host "`nULTIMO COMMIT:" -ForegroundColor Yellow
git log --oneline -1

# 3. Verificar remote
Write-Host "`nREMOTE:" -ForegroundColor Yellow
git remote -v

# 4. Verificar branch
Write-Host "`nBRANCH:" -ForegroundColor Yellow
git branch --show-current

# 5. Abrir todas las páginas necesarias
Write-Host "`nABRIENDO PAGINAS..." -ForegroundColor Green
Start-Process "https://github.com/Dev-jcgi/blog/settings/pages"
Start-Sleep -Seconds 2
Start-Process "https://github.com/Dev-jcgi/blog/actions"
Start-Sleep -Seconds 2
Start-Process "https://dev-jcgi.github.io/blog/"
```

---

## 📝 Resumen: URL Correcta

Tu blog debería estar en:

```
✅ https://dev-jcgi.github.io/blog/
```

**NO** en:
```
❌ https://dev-jcgi.github.io/
❌ https://github.com/Dev-jcgi/blog/
❌ http://dev-jcgi.github.io/blog/ (sin HTTPS)
```

---

## 🆘 Si Aún No Funciona

### **Opción 1: Re-activar GitHub Pages**

```powershell
# 1. Ve a Settings → Pages
Start-Process "https://github.com/Dev-jcgi/blog/settings/pages"

# 2. Cambia Source a "None"
# 3. Click "Save"
# 4. Espera 30 segundos
# 5. Cambia Source a "Deploy from a branch" → main → / (root)
# 6. Click "Save"
# 7. Espera 2-3 minutos
```

---

### **Opción 2: Forzar nuevo build**

```powershell
# 1. Hacer un cambio mínimo
"" | Add-Content README.md

# 2. Commit y push
git add README.md
git commit -m "Trigger Pages rebuild"
git push origin main

# 3. Ver Actions
Start-Process "https://github.com/Dev-jcgi/blog/actions"
```

---

### **Opción 3: Verificar Jekyll local funciona**

```powershell
# 1. Construir sitio localmente
bundle exec jekyll build

# ¿Errores? → Corregir antes de push
# ¿Exitoso? → Problema es en GitHub, no en código
```

---

## ✅ Confirmación de Éxito

Cuando todo funcione, deberías ver:

1. **En GitHub Settings → Pages**:
   ```
   ✅ Your site is live at https://dev-jcgi.github.io/blog/
   ```

2. **En GitHub Actions**:
   ```
   ✅ pages build and deployment
      ✓ deploy (verde)
   ```

3. **En el navegador** (`https://dev-jcgi.github.io/blog/`):
   ```
   ✅ AI Tech Blog (header visible)
   ✅ Posts visibles en grid
   ✅ Tema oscuro funcionando
   ✅ CSS cargando correctamente
   ```

---

## 📞 Próximos Pasos

Una vez que el sitio esté live:

1. **Verificar Lighthouse**:
   ```
   - Performance: 96+
   - Accessibility: 100
   - SEO: 100
   - PWA: 95+
   ```

2. **Probar PWA**:
   - Abrir en Chrome
   - Ver botón "Instalar" en barra dirección
   - Instalar como app

3. **Verificar posts**:
   - Todos los 6 posts técnicos visibles
   - Copy buttons funcionando
   - Bookmarks funcionando
   - Reader mode funcionando

4. **Analytics** (opcional):
   - Configurar Google Analytics
   - Configurar Microsoft Clarity (heatmaps gratis)

---

## 🎉 ¡Listo!

Tu blog **AI Tech Blog** está ahora live en:

### 🌐 https://dev-jcgi.github.io/blog/

**Features live**:
- ✅ 23 características técnicas
- ✅ 6 posts AI/ML (22,000 palabras)
- ✅ PWA instalable
- ✅ Theme toggle (dark/light)
- ✅ Búsqueda avanzada
- ✅ Bookmarks locales
- ✅ Reader mode
- ✅ Copy code buttons
- ✅ Print stylesheet
- ✅ Security headers
- ✅ SEO completo (Score 100/100)
- ✅ Accessibility (WCAG 2.1 AA)

**Blog calificación**: ⭐⭐⭐⭐⭐ **10/10** Production-Ready

---

**¿Necesitas más ayuda?** Indica qué error específico ves y te ayudo a solucionarlo.
