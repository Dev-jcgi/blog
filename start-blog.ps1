# Script para iniciar el blog Jekyll después de actualizar Ruby
# Ejecuta este script después de instalar Ruby 2.7+

Write-Host "`n═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Iniciando Blog Jekyll - AI Tech Blog" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════`n" -ForegroundColor Cyan

# Verificar Ruby
Write-Host "Verificando Ruby..." -ForegroundColor White
ruby -v

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Ruby no está instalado correctamente" -ForegroundColor Red
    Write-Host "Por favor, instala Ruby desde: https://rubyinstaller.org/`n" -ForegroundColor Yellow
    exit 1
}

# Verificar versión mínima de Ruby
$rubyVersion = ruby -v | Select-String -Pattern "(\d+\.\d+)"
if ($rubyVersion -match "(\d+)\.(\d+)") {
    $major = [int]$matches[1]
    $minor = [int]$matches[2]
    
    if ($major -lt 2 -or ($major -eq 2 -and $minor -lt 7)) {
        Write-Host "`n❌ Ruby $major.$minor no es compatible" -ForegroundColor Red
        Write-Host "Se requiere Ruby 2.7 o superior" -ForegroundColor Yellow
        Write-Host "Actualiza Ruby desde: https://rubyinstaller.org/`n" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "✅ Ruby OK`n" -ForegroundColor Green

# Instalar Bundler
Write-Host "Instalando Bundler..." -ForegroundColor White
gem install bundler --no-document

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Error al instalar Bundler" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Bundler instalado`n" -ForegroundColor Green

# Instalar dependencias
Write-Host "Instalando dependencias de Jekyll (esto puede tardar)..." -ForegroundColor White
bundle install

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Error al instalar dependencias" -ForegroundColor Red
    Write-Host "Intenta ejecutar manualmente: bundle install`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Dependencias instaladas`n" -ForegroundColor Green

# Iniciar servidor
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Iniciando servidor Jekyll..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════`n" -ForegroundColor Cyan

Write-Host "📌 El blog estará disponible en: http://localhost:4000" -ForegroundColor Green
Write-Host "📌 Presiona Ctrl+C para detener el servidor`n" -ForegroundColor Yellow

bundle exec jekyll serve --livereload
