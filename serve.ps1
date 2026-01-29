# Script rápido - Solo inicia el servidor
# Usa este después de haber ejecutado start-blog.ps1 al menos una vez

Write-Host "`n🚀 Iniciando servidor Jekyll...`n" -ForegroundColor Cyan
Write-Host "📌 Blog en: http://localhost:4000" -ForegroundColor Green
Write-Host "📌 Ctrl+C para detener`n" -ForegroundColor Yellow

bundle exec jekyll serve --livereload
