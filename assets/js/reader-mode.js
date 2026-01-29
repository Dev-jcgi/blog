/* ================================================
   READER MODE - AI TECH BLOG
   ================================================
   
   Modo de lectura sin distracciones para posts.
   Oculta elementos secundarios y optimiza la tipografía.
   
   Características:
   - Toggle de un click
   - Persistencia con localStorage
   - Transiciones suaves
   - Diseño minimalista
   - Tipografía optimizada para lectura
================================================ */

(function() {
    'use strict';
    
    const STORAGE_KEY = 'ai-tech-blog-reader-mode';
    
    // ================================================
    // CLASE PRINCIPAL
    // ================================================
    
    class ReaderMode {
        constructor() {
            this.isActive = this.loadState();
            this.init();
        }
        
        // Cargar estado desde localStorage
        loadState() {
            try {
                return localStorage.getItem(STORAGE_KEY) === 'true';
            } catch (e) {
                return false;
            }
        }
        
        // Guardar estado en localStorage
        saveState() {
            try {
                localStorage.setItem(STORAGE_KEY, this.isActive);
            } catch (e) {
                console.error('Error saving reader mode state:', e);
            }
        }
        
        // Activar reader mode
        enable() {
            document.body.classList.add('reader-mode');
            this.isActive = true;
            this.saveState();
            this.updateButton();
            this.showNotification('Modo lectura activado');
        }
        
        // Desactivar reader mode
        disable() {
            document.body.classList.remove('reader-mode');
            this.isActive = false;
            this.saveState();
            this.updateButton();
            this.showNotification('Modo lectura desactivado');
        }
        
        // Toggle
        toggle() {
            if (this.isActive) {
                this.disable();
            } else {
                this.enable();
            }
        }
        
        // Actualizar botón
        updateButton() {
            const button = document.getElementById('reader-mode-toggle');
            if (!button) return;
            
            if (this.isActive) {
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                button.innerHTML = this.getIcon(true);
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-pressed', 'false');
                button.innerHTML = this.getIcon(false);
            }
        }
        
        // Icono del botón
        getIcon(isActive) {
            if (isActive) {
                return `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>Salir de modo lectura</span>
                `;
            } else {
                return `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <span>Modo lectura</span>
                `;
            }
        }
        
        // Mostrar notificación
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'reader-mode-notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Animar
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
        
        // Inicializar
        init() {
            // Aplicar estado inicial
            if (this.isActive) {
                document.body.classList.add('reader-mode');
            }
            
            // Solo en páginas de posts
            if (!document.querySelector('.post-content')) {
                return;
            }
            
            // Crear botón
            this.createButton();
            
            // Keyboard shortcut: Ctrl/Cmd + Shift + R
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                    e.preventDefault();
                    this.toggle();
                }
            });
        }
        
        // Crear botón
        createButton() {
            const postHeader = document.querySelector('.post-header');
            if (!postHeader) return;
            
            const button = document.createElement('button');
            button.id = 'reader-mode-toggle';
            button.className = 'reader-mode-toggle';
            button.setAttribute('aria-label', 'Toggle reader mode');
            button.setAttribute('aria-pressed', this.isActive);
            button.innerHTML = this.getIcon(this.isActive);
            
            // Event listener
            button.addEventListener('click', () => this.toggle());
            
            // Insertar en el header
            postHeader.appendChild(button);
        }
    }
    
    // ================================================
    // EXPORTAR INSTANCIA GLOBAL
    // ================================================
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.ReaderMode = new ReaderMode();
        });
    } else {
        window.ReaderMode = new ReaderMode();
    }
    
})();
