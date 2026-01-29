# =========================================
# Script: Generar Iconos PWA
# Descripción: Genera todos los iconos PWA desde LOGO.png usando .NET
# =========================================

param(
    [string]$SourceImage = "assets/images/LOGO.png",
    [string]$OutputDir = "assets/images"
)

# Colores para output
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "[i] $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "[!] $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "[X] $msg" -ForegroundColor Red }

# Banner
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "     Generador de Iconos PWA - .NET" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# Verificar que existe la imagen fuente
if (-not (Test-Path $SourceImage)) {
    Write-Error "No se encuentra la imagen fuente: $SourceImage"
    Write-Info "Asegúrate de tener LOGO.png en assets/images/"
    exit 1
}

Write-Success "Imagen fuente encontrada: $SourceImage"

# Tamaños requeridos para PWA
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Info "Tamaños a generar: $($sizes -join ', ')"
Write-Host ""

# Cargar ensamblados .NET para manipulación de imágenes
Add-Type -AssemblyName System.Drawing

try {
    # Cargar imagen original
    $sourceImg = [System.Drawing.Image]::FromFile((Resolve-Path $SourceImage))
    Write-Info "Imagen cargada: $($sourceImg.Width)x$($sourceImg.Height) píxeles"
    Write-Host ""
    
    $generated = 0
    $failed = 0
    
    foreach ($size in $sizes) {
        $outputFile = Join-Path $OutputDir "icon-${size}x${size}.png"
        
        Write-Host "  Generando ${size}x${size}px..." -NoNewline
        
        try {
            # Crear bitmap nuevo con el tamaño deseado
            $newBitmap = New-Object System.Drawing.Bitmap($size, $size)
            
            # Crear objeto Graphics para dibujar
            $graphics = [System.Drawing.Graphics]::FromImage($newBitmap)
            
            # Configurar calidad de interpolación alta
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            
            # Dibujar imagen redimensionada
            $graphics.DrawImage($sourceImg, 0, 0, $size, $size)
            
            # Guardar como PNG
            $newBitmap.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
            
            # Limpiar
            $graphics.Dispose()
            $newBitmap.Dispose()
            
            $fileSize = (Get-Item $outputFile).Length
            $fileSizeKB = [math]::Round($fileSize / 1KB, 1)
            
            Write-Host " OK (${fileSizeKB} KB)" -ForegroundColor Green
            $generated++
            
        } catch {
            Write-Host " FAILED" -ForegroundColor Red
            Write-Warning "Error: $($_.Exception.Message)"
            $failed++
        }
    }
    
    # Limpiar imagen fuente
    $sourceImg.Dispose()
    
} catch {
    Write-Error "Error al procesar la imagen: $($_.Exception.Message)"
    exit 1
}

# Resumen
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE GENERACION" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "Iconos generados:    " -NoNewline
Write-Host "$generated" -ForegroundColor Green

if ($failed -gt 0) {
    Write-Host "Errores:             " -NoNewline
    Write-Host "$failed" -ForegroundColor Red
}

Write-Host "Ubicación:           " -NoNewline
Write-Host "$OutputDir" -ForegroundColor White

# Verificar que todos existen
Write-Host "`nVerificando archivos generados..." -ForegroundColor Cyan

$allGenerated = $true
foreach ($size in $sizes) {
    $file = Join-Path $OutputDir "icon-${size}x${size}.png"
    if (Test-Path $file) {
        $fileSize = (Get-Item $file).Length / 1KB
        $fileSizeRounded = [math]::Round($fileSize, 1)
        Write-Host "  [OK] icon-${size}x${size}.png (${fileSizeRounded} KB)" -ForegroundColor Green
    } else {
        Write-Host "  [X] icon-${size}x${size}.png (falta)" -ForegroundColor Red
        $allGenerated = $false
    }
}

Write-Host ""

if ($allGenerated -and $failed -eq 0) {
    Write-Success "Todos los iconos PWA generados exitosamente!"
    Write-Host ""
    Write-Info "Proximos pasos:"
    Write-Host "  1. Verifica los iconos en: $OutputDir"
    Write-Host "  2. El manifest.json ya esta configurado"
    Write-Host "  3. Prueba la instalacion PWA en Chrome"
    Write-Host ""
} else {
    Write-Warning "Algunos iconos no se generaron correctamente"
    Write-Info "Puedes intentar con servicios online:"
    Write-Host "  - RealFaviconGenerator: https://realfavicongenerator.net/"
    Write-Host "  - Favicon.io: https://favicon.io/favicon-converter/"
    Write-Host ""
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
