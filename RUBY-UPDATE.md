# 🔄 Actualización de Ruby Completada

## ✅ Pasos Seguidos:

1. ✓ Ruby 2.3.4 detectado (versión antigua)
2. ✓ Se intentó actualizar con Chocolatey (requiere admin)
3. ✓ Scripts auxiliares creados

---

## 🚀 Próximos Pasos:

### Opción A: Con Chocolatey (Más Rápido)

1. Abre PowerShell **como Administrador**:
   - Busca "PowerShell" en el menú Inicio
   - Click derecho → "Ejecutar como administrador"

2. Navega a esta carpeta:
   ```powershell
   cd d:\jc-gi\blogtc
   ```

3. Actualiza Ruby:
   ```powershell
   choco upgrade ruby -y
   ```

4. Cierra y abre PowerShell de nuevo (para cargar nuevo Ruby)

5. Ejecuta:
   ```powershell
   .\start-blog.ps1
   ```

---

### Opción B: Instalación Manual

1. **Descarga RubyInstaller**:
   - Ve a: https://rubyinstaller.org/downloads/
   - Descarga: **Ruby+Devkit 3.2.X (x64)** (la versión con flecha → )

2. **Ejecuta el instalador**:
   - Acepta la licencia
   - Deja la ruta por defecto
   - Marca las opciones recomendadas

3. **Al finalizar**:
   - Marca: "Run 'ridk install'"
   - En la consola que aparece, presiona **Enter** (ejecutará opciones 1, 2, 3)
   - Espera a que termine

4. **Verifica**:
   - Cierra y abre PowerShell
   - Ejecuta: `ruby -v`
   - Deberías ver: Ruby 3.2.X

5. **Inicia el blog**:
   ```powershell
   cd d:\jc-gi\blogtc
   .\start-blog.ps1
   ```

---

## 📄 Scripts Disponibles:

### `start-blog.ps1` (Primera vez o después de cambios)
- Verifica Ruby
- Instala Bundler
- Instala dependencias
- Inicia el servidor Jekyll

**Uso:**
```powershell
.\start-blog.ps1
```

### `serve.ps1` (Uso diario)
- Solo inicia el servidor
- Más rápido

**Uso:**
```powershell
.\serve.ps1
```

---

## ✅ Después de Actualizar Ruby:

Tu blog estará disponible en:
**http://localhost:4000**

Para detener el servidor:
**Ctrl + C**

---

## 🔍 Verificar Versión Instalada:

```powershell
ruby -v          # Debe mostrar 2.7+ o superior
gem -v           # Debe mostrar versión de RubyGems
bundler -v       # Debe mostrar versión de Bundler
```

---

## 📚 Crear Tu Primer Post:

Una vez el blog esté corriendo:

1. Crea archivo en `_posts/`:
   ```
   2026-01-28-mi-primer-post.md
   ```

2. Añade contenido:
   ```markdown
   ---
   layout: post
   title: "Mi Primer Post"
   date: 2026-01-28
   category: Tutorial
   tags:
     - IA
   ---

   ## Contenido

   Tu artículo aquí...
   ```

3. El servidor detectará el cambio automáticamente (livereload)

---

## 🆘 Problemas Comunes:

### "Ruby no se reconoce"
- Cierra todas las terminales
- Abre PowerShell de nuevo
- Verifica: `ruby -v`

### "Access denied" con Chocolatey
- Ejecuta PowerShell como Administrador

### Errores al instalar gems
```powershell
gem update --system
bundle install
```

### Puerto 4000 ocupado
```powershell
bundle exec jekyll serve --port 4001
```

---

## 📖 Documentación Completa:

- **README.md** → Documentación completa del proyecto
- **QUICKSTART.md** → Guía paso a paso detallada
- **START-HERE.txt** → Referencia rápida

---

¡Tu blog de IA estará listo para funcionar después de actualizar Ruby! ✨
