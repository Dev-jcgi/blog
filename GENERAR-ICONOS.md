# Guía para Generar Iconos PWA

## ⚠️ ACCIÓN REQUERIDA

Los iconos PWA son necesarios para que la aplicación web progresiva funcione correctamente. Necesitas generar estos iconos manualmente.

## Opciones para Generar Iconos

### Opción 1: RealFaviconGenerator (Recomendado)
1. Ve a https://realfavicongenerator.net/
2. Sube tu logo (mínimo 512x512px)
3. Personaliza colores:
   - **Background color**: `#0a0e27` (tema oscuro)
   - **Theme color**: `#00d4ff` (cyan)
4. Descarga el paquete completo
5. Extrae los archivos en `assets/images/`

### Opción 2: PWA Asset Generator
```bash
npm install -g pwa-asset-generator
pwa-asset-generator logo.svg assets/images/ --icon-only
```

### Opción 3: Crear Manualmente con Photoshop/GIMP
Crea estas imágenes:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Opción Temporal: Usar Placeholder

Si quieres probar el PWA inmediatamente, puedes crear un logo SVG simple:

### Logo SVG Temporal (Guárdalo como assets/images/logo.svg)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8338ec;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#0a0e27"/>
  <circle cx="256" cy="200" r="80" fill="url(#grad)"/>
  <path d="M 180 320 Q 256 380 332 320" fill="none" stroke="url(#grad)" stroke-width="20" stroke-linecap="round"/>
  <text x="256" y="450" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="url(#grad)" text-anchor="middle">AI</text>
</svg>
```

Luego convierte el SVG a PNG en diferentes tamaños usando:
- https://cloudconvert.com/svg-to-png
- O con ImageMagick: `convert logo.svg -resize 192x192 icon-192x192.png`

## Verificación

Después de generar los iconos, verifica que existan estos archivos:
```
assets/images/
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
├── icon-512x512.png
├── og-default.jpg (1200x630px para Open Graph)
└── logo.png (opcional, para el header)
```

## Imagen Open Graph por Defecto

También necesitas una imagen Open Graph (1200x630px) para redes sociales:
- Crea una imagen con tu logo y el título del blog
- Guárdala como `assets/images/og-default.jpg`
- Usa herramientas como Canva, Figma, o Photoshop

## Recursos Útiles

- **Canva**: Templates gratuitos para logos e imágenes sociales
- **Figma**: Diseño vectorial gratuito
- **Unsplash**: Imágenes libres de derechos
- **Flaticon**: Iconos gratuitos

## Instalación Rápida con NPM (Si tienes Node.js)

```bash
# Instalar herramienta
npm install -g sharp-cli

# Convertir SVG a PNG en múltiples tamaños
sharp -i logo.svg -o icon-72x72.png resize 72 72
sharp -i logo.svg -o icon-96x96.png resize 96 96
sharp -i logo.svg -o icon-128x128.png resize 128 128
sharp -i logo.svg -o icon-144x144.png resize 144 144
sharp -i logo.svg -o icon-152x152.png resize 152 152
sharp -i logo.svg -o icon-192x192.png resize 192 192
sharp -i logo.svg -o icon-384x384.png resize 384 384
sharp -i logo.svg -o icon-512x512.png resize 512 512
```

## Testing

Después de generar los iconos:
1. Ejecuta el blog localmente: `bundle exec jekyll serve`
2. Abre Chrome DevTools > Application > Manifest
3. Verifica que todos los iconos carguen correctamente
4. Usa Lighthouse para validar el PWA

---

**Estado**: ⚠️ PENDIENTE - Genera los iconos antes de desplegar
