# ════════════════════════════════════════════════════════════════
# Script de Optimización de Imágenes para Jekyll Blog
# ════════════════════════════════════════════════════════════════
# 
# Este script automatiza la creación de múltiples tamaños y formatos
# de imágenes para un blog Jekyll con imágenes responsivas.
#
# REQUISITOS:
# - ImageMagick instalado: https://imagemagick.org/script/download.php
#   O chocolatey: choco install imagemagick
#
# USO:
# 1. Coloca imágenes originales en: assets/images/originals/
# 2. Ejecuta: .\optimize-images.ps1
# 3. Las imágenes optimizadas se guardan en: assets/images/
#
# ════════════════════════════════════════════════════════════════

param(
    [string]$SourcePath = ".\assets\images\originals",
    [string]$OutputPath = ".\assets\images",
    [int[]]$Sizes = @(400, 800, 1200, 1600),
    [switch]$WebP = $true,
    [switch]$Progressive = $true,
    [int]$Quality = 85
)

# Colores para output
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }

# Banner
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   📸 OPTIMIZADOR DE IMÁGENES JEKYLL" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar ImageMagick
Write-Info "Verificando ImageMagick..."
try {
    $magickVersion = magick -version 2>$null
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Success "ImageMagick encontrado"
} catch {
    Write-Error "ImageMagick no está instalado o no está en PATH"
    Write-Info "Instala con: choco install imagemagick"
    Write-Info "O descarga: https://imagemagick.org/script/download.php"
    exit 1
}

# Verificar directorios
if (-not (Test-Path $SourcePath)) {
    Write-Warning "Carpeta de origen no existe: $SourcePath"
    Write-Info "Creando carpeta..."
    New-Item -ItemType Directory -Path $SourcePath -Force | Out-Null
    Write-Info "Coloca tus imágenes originales en: $SourcePath"
    exit 0
}

if (-not (Test-Path $OutputPath)) {
    Write-Info "Creando carpeta de salida: $OutputPath"
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

# Obtener imágenes
$images = Get-ChildItem $SourcePath -Include *.jpg,*.jpeg,*.png -Recurse
$totalImages = $images.Count

if ($totalImages -eq 0) {
    Write-Warning "No se encontraron imágenes en: $SourcePath"
    Write-Info "Formatos soportados: JPG, JPEG, PNG"
    exit 0
}

Write-Info "Encontradas $totalImages imagen(es) para optimizar"
Write-Info "Tamaños a generar: $($Sizes -join ', ')px"
Write-Info "Calidad: $Quality%"
Write-Info "WebP: $($WebP ? 'Sí' : 'No')"
Write-Host ""

# Contador
$processed = 0
$failed = 0
$totalFiles = 0

# Procesar cada imagen
foreach ($image in $images) {
    $processed++
    $basename = [System.IO.Path]::GetFileNameWithoutExtension($image.Name)
    $extension = $image.Extension.ToLower()
    
    Write-Host "[$processed/$totalImages] Procesando: " -NoNewline
    Write-Host "$basename$extension" -ForegroundColor White
    
    try {
        foreach ($size in $Sizes) {
            # Nombre de archivo de salida
            $outputName = "$basename-$size"
            
            # JPG/PNG optimizado
            $outputFile = Join-Path $OutputPath "$outputName$extension"
            
            if ($Progressive -and $extension -eq ".jpg") {
                # JPG progresivo
                magick $image.FullName -resize "${size}x>" -quality $Quality -interlace Plane $outputFile 2>$null
            } else {
                # PNG o JPG normal
                magick $image.FullName -resize "${size}x>" -quality $Quality $outputFile 2>$null
            }
            
            if ($LASTEXITCODE -eq 0) {
                $fileSize = (Get-Item $outputFile).Length / 1KB
                Write-Host "   → ${size}px: " -NoNewline -ForegroundColor DarkGray
                Write-Host "$outputName$extension " -NoNewline -ForegroundColor White
                Write-Host "($([math]::Round($fileSize, 1)) KB)" -ForegroundColor DarkGray
                $totalFiles++
            } else {
                throw "Error al redimensionar $extension"
            }
            
            # WebP
            if ($WebP) {
                $outputWebP = Join-Path $OutputPath "$outputName.webp"
                magick $outputFile -quality $Quality $outputWebP 2>$null
                
                if ($LASTEXITCODE -eq 0) {
                    $webpSize = (Get-Item $outputWebP).Length / 1KB
                    Write-Host "   → ${size}px: " -NoNewline -ForegroundColor DarkGray
                    Write-Host "$outputName.webp " -NoNewline -ForegroundColor White
                    Write-Host "($([math]::Round($webpSize, 1)) KB)" -ForegroundColor DarkGray
                    $totalFiles++
                } else {
                    Write-Warning "   No se pudo crear WebP para ${size}px"
                }
            }
        }
        
        Write-Success "   Completado"
        Write-Host ""
        
    } catch {
        $failed++
        Write-Error "   Error: $_"
        Write-Host ""
    }
}

# Resumen
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   📊 RESUMEN" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Imágenes procesadas: " -NoNewline
Write-Host "$processed" -ForegroundColor Green
Write-Host "Archivos generados:  " -NoNewline
Write-Host "$totalFiles" -ForegroundColor Green
Write-Host "Errores:             " -NoNewline
Write-Host "$failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host ""
Write-Host "Ubicación: " -NoNewline
Write-Host "$OutputPath" -ForegroundColor Cyan
Write-Host ""

if ($failed -eq 0) {
    Write-Success "¡Optimización completada exitosamente!"
} else {
    Write-Warning "Optimización completada con $failed error(es)"
}

Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Copia las rutas de las imágenes" -ForegroundColor White
Write-Host "2. Úsalas en tus posts con el componente responsive-image" -ForegroundColor White
Write-Host "3. Ejemplo:" -ForegroundColor White
Write-Host '   {% include responsive-image.html src="/assets/images/mi-imagen-800.jpg" alt="Descripción" %}' -ForegroundColor DarkGray
Write-Host ""

# Preguntar si eliminar originales
if ($processed -gt 0 -and $failed -eq 0) {
    $response = Read-Host "¿Deseas mover las imágenes originales a una carpeta de respaldo? (S/N)"
    if ($response -eq "S" -or $response -eq "s") {
        $backupPath = Join-Path $SourcePath "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
        Move-Item "$SourcePath\*.*" $backupPath -Exclude "backup-*"
        Write-Success "Originales movidos a: $backupPath"
    }
}

Write-Host ""
