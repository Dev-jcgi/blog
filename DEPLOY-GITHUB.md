# 🚀 Guía de Deploy en GitHub Pages

## ✅ PASO 1: SUBIR A GITHUB - COMPLETADO ✓

Tu código ya está en GitHub en:
**https://github.com/Dev-jcgi/blog**

---

## 🌐 PASO 2: CONFIGURAR GITHUB PAGES

### Opción A: Configuración Rápida (Recomendada)

1. **Ve a tu repositorio en GitHub:**
   ```
   https://github.com/Dev-jcgi/blog
   ```

2. **Navega a Settings (Configuración):**
   - Click en **"Settings"** (⚙️) en la barra superior del repositorio

3. **Ve a la sección Pages:**
   - En el menú lateral izquierdo, busca **"Pages"**
   - O ve directamente a: https://github.com/Dev-jcgi/blog/settings/pages

4. **Configura la fuente (Source):**
   - **Branch:** Selecciona `main`
   - **Folder:** Selecciona `/ (root)`
   - Click en **"Save"**

5. **Espera el deploy (2-5 minutos):**
   - Verás un mensaje: "Your site is live at https://dev-jcgi.github.io/blog/"
   - Puede tardar unos minutos en estar disponible

---

## 📱 PASO 3: VISUALIZAR TU BLOG

### Tu blog estará disponible en:
```
https://dev-jcgi.github.io/blog/
```

**Nota:** La URL usa tu configuración en _config.yml:
- `url: "https://dev-jcgi.github.io"`
- `baseurl: "/blog"`

---

## ⚙️ CONFIGURACIÓN ADICIONAL (Opcional)

### Custom Domain (Dominio Personalizado)

Si tienes un dominio propio (ejemplo: `miblog.com`):

1. **En GitHub Pages Settings:**
   - Ingresa tu dominio en **"Custom domain"**
   - Click **"Save"**

2. **Configurar DNS en tu proveedor:**
   ```
   Tipo  | Host | Valor
   ------|------|------------------------
   CNAME | www  | dev-jcgi.github.io
   A     | @    | 185.199.108.153
   A     | @    | 185.199.109.153
   A     | @    | 185.199.110.153
   A     | @    | 185.199.111.153
   ```

3. **Habilitar HTTPS:**
   - En GitHub Pages, marca ✅ **"Enforce HTTPS"**

---

## 🔍 VERIFICAR EL DEPLOY

### 1. Ver el estado del deploy:
```
https://github.com/Dev-jcgi/blog/actions
```
- GitHub Actions mostrará el progreso
- ✅ Verde = Deploy exitoso
- ❌ Rojo = Error (ver los logs)

### 2. Verificar que el sitio carga:
- Abre: https://dev-jcgi.github.io/blog/
- Debe mostrar tu homepage con el diseño dark tech

### 3. Probar funcionalidades:
- ✅ Navegación entre páginas
- ✅ Búsqueda de artículos
- ✅ Cambio de tema (claro/oscuro)
- ✅ Comentarios (requiere que los usuarios hagan login con GitHub)
- ✅ Compartir en redes sociales

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: "404 - No se encuentra la página"

**Solución 1: Verificar que GitHub Pages está habilitado**
```
https://github.com/Dev-jcgi/blog/settings/pages
```
Debe decir: "Your site is published at..."

**Solución 2: Verificar la rama (branch)**
- Asegúrate de que seleccionaste `main` branch
- Y `/ (root)` folder

**Solución 3: Esperar más tiempo**
- El primer deploy puede tardar hasta 10 minutos

### Problema: "Página sin estilos (solo texto blanco)"

**Causa:** URLs de assets incorrectas

**Solución:** Verificar _config.yml
```yaml
url: "https://dev-jcgi.github.io"
baseurl: "/blog"  # IMPORTANTE: debe coincidir con el nombre del repo
```

### Problema: "Imágenes no cargan"

**Causa:** Iconos PWA no generados

**Solución:** 
1. Genera los iconos siguiendo `GENERAR-ICONOS.md`
2. O comenta las referencias en `manifest.json` temporalmente

### Problema: "Comentarios no funcionan"

**Causa:** Utterances no configurado correctamente

**Solución:** Verificar _config.yml línea 93:
```yaml
utterances:
  repo: "Dev-jcgi/blog"  # Debe ser exactamente este formato
```

Además, instalar Utterances App:
1. Ve a: https://github.com/apps/utterances
2. Click "Install"
3. Selecciona tu repositorio `Dev-jcgi/blog`

---

## 📊 MONITOREO POST-DEPLOY

### 1. Google Search Console (Recomendado)
```
https://search.google.com/search-console
```
- Agregar tu sitio
- Verificar propiedad
- Enviar sitemap: https://dev-jcgi.github.io/blog/sitemap.xml

### 2. Validar Structured Data
```
https://search.google.com/test/rich-results
```
- Pegar tu URL
- Verificar que el JSON-LD sea válido

### 3. Test de Performance
```
https://pagespeed.web.dev/
```
- Analiza: https://dev-jcgi.github.io/blog/
- Objetivo: 90+ en todas las métricas

### 4. Validar Open Graph
```
https://www.opengraph.xyz/
```
- Ve cómo se verá al compartir en redes sociales

---

## 🔄 ACTUALIZACIONES FUTURAS

Para actualizar el blog después de hacer cambios:

```bash
# 1. Hacer cambios en archivos locales

# 2. Ver cambios
git status

# 3. Agregar cambios
git add .

# 4. Commit
git commit -m "Descripción de los cambios"

# 5. Push a GitHub
git push origin main

# 6. GitHub Pages se actualiza automáticamente (2-5 min)
```

---

## ✅ CHECKLIST POST-DEPLOY

- [ ] Sitio accesible en https://dev-jcgi.github.io/blog/
- [ ] Homepage carga correctamente
- [ ] Navegación funciona
- [ ] Artículos se muestran
- [ ] Búsqueda funciona
- [ ] Cambio de tema funciona
- [ ] Imágenes cargan (o generar iconos PWA)
- [ ] Comentarios configurados (instalar Utterances App)
- [ ] Analytics configurado (opcional)
- [ ] Lighthouse Score > 90 (opcional)
- [ ] Sitemap enviado a Google (opcional)

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

### Prioritarios:
1. ✅ **Generar iconos PWA** - Seguir `GENERAR-ICONOS.md`
2. ✅ **Instalar Utterances App** - Para habilitar comentarios
3. ✅ **Verificar que todo funciona** - Probar cada página

### Opcionales:
4. 📊 **Configurar Analytics** - Descomentar en _config.yml
5. 🔍 **Google Search Console** - Para aparecer en búsquedas
6. 🌐 **Custom Domain** - Si tienes dominio propio
7. 📱 **Probar PWA** - Instalar el blog como app en móvil

---

## 📞 SOPORTE

### Documentación GitHub Pages:
https://docs.github.com/en/pages

### Documentación Jekyll:
https://jekyllrb.com/docs/

### Comunidad Jekyll:
https://talk.jekyllrb.com/

---

## 🎉 ¡FELICIDADES!

Tu blog ya está en línea con:
- ✅ SEO profesional
- ✅ Accesibilidad optimizada
- ✅ PWA completo
- ✅ Diseño dark tech
- ✅ 12 funcionalidades avanzadas

**URL de tu blog:**
```
https://dev-jcgi.github.io/blog/
```

¡Comparte tu blog en redes sociales! 🚀

---

**Última actualización:** 28 de Enero, 2026
