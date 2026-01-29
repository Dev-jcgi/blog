/* ================================================
   BOOKMARKS SYSTEM - LOCAL STORAGE
   ================================================
   
   Sistema de marcadores locales sin backend.
   Usa localStorage para persistir favoritos del usuario.
   
   Características:
   - Agregar/quitar bookmarks con un click
   - Persistencia local (no requiere cuenta)
   - Página dedicada para ver todos los bookmarks
   - Sincronización automática entre pestañas
   - Exportar/importar bookmarks (JSON)
================================================ */

(function() {
    'use strict';
    
    const STORAGE_KEY = 'ai-tech-blog-bookmarks';
    const MAX_BOOKMARKS = 100; // Límite para evitar problemas de storage
    
    // ================================================
    // CLASE PRINCIPAL
    // ================================================
    
    class BookmarkManager {
        constructor() {
            this.bookmarks = this.loadBookmarks();
            this.init();
        }
        
        // Cargar bookmarks desde localStorage
        loadBookmarks() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                console.error('Error loading bookmarks:', e);
                return [];
            }
        }
        
        // Guardar bookmarks en localStorage
        saveBookmarks() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bookmarks));
                this.dispatchUpdateEvent();
                return true;
            } catch (e) {
                console.error('Error saving bookmarks:', e);
                return false;
            }
        }
        
        // Agregar bookmark
        add(url, title, excerpt = '', category = '', date = '') {
            // Verificar si ya existe
            if (this.exists(url)) {
                return { success: false, message: 'Ya está en bookmarks' };
            }
            
            // Verificar límite
            if (this.bookmarks.length >= MAX_BOOKMARKS) {
                return { success: false, message: 'Límite de bookmarks alcanzado' };
            }
            
            const bookmark = {
                url: url,
                title: title,
                excerpt: excerpt,
                category: category,
                date: date,
                addedAt: new Date().toISOString(),
                id: this.generateId()
            };
            
            this.bookmarks.unshift(bookmark); // Agregar al inicio
            this.saveBookmarks();
            
            return { success: true, message: 'Agregado a bookmarks', bookmark: bookmark };
        }
        
        // Quitar bookmark
        remove(url) {
            const initialLength = this.bookmarks.length;
            this.bookmarks = this.bookmarks.filter(b => b.url !== url);
            
            if (this.bookmarks.length < initialLength) {
                this.saveBookmarks();
                return { success: true, message: 'Quitado de bookmarks' };
            }
            
            return { success: false, message: 'No encontrado' };
        }
        
        // Verificar si existe
        exists(url) {
            return this.bookmarks.some(b => b.url === url);
        }
        
        // Obtener todos los bookmarks
        getAll() {
            return this.bookmarks;
        }
        
        // Obtener por categoría
        getByCategory(category) {
            return this.bookmarks.filter(b => b.category === category);
        }
        
        // Buscar bookmarks
        search(query) {
            const lowerQuery = query.toLowerCase();
            return this.bookmarks.filter(b => 
                b.title.toLowerCase().includes(lowerQuery) ||
                b.excerpt.toLowerCase().includes(lowerQuery) ||
                b.category.toLowerCase().includes(lowerQuery)
            );
        }
        
        // Limpiar todos
        clear() {
            if (confirm('¿Eliminar todos los bookmarks? Esta acción no se puede deshacer.')) {
                this.bookmarks = [];
                this.saveBookmarks();
                return { success: true, message: 'Bookmarks eliminados' };
            }
            return { success: false, message: 'Cancelado' };
        }
        
        // Exportar bookmarks a JSON
        export() {
            const data = {
                bookmarks: this.bookmarks,
                exportedAt: new Date().toISOString(),
                version: '1.0'
            };
            
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ai-tech-blog-bookmarks.json';
            a.click();
            
            URL.revokeObjectURL(url);
            return { success: true, message: 'Bookmarks exportados' };
        }
        
        // Importar bookmarks desde JSON
        import(file) {
            const reader = new FileReader();
            
            return new Promise((resolve, reject) => {
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
                            reject({ success: false, message: 'Formato inválido' });
                            return;
                        }
                        
                        // Merge sin duplicados
                        const existingUrls = new Set(this.bookmarks.map(b => b.url));
                        const newBookmarks = data.bookmarks.filter(b => !existingUrls.has(b.url));
                        
                        this.bookmarks = [...this.bookmarks, ...newBookmarks];
                        this.saveBookmarks();
                        
                        resolve({ 
                            success: true, 
                            message: `${newBookmarks.length} bookmarks importados`,
                            count: newBookmarks.length
                        });
                    } catch (error) {
                        reject({ success: false, message: 'Error al importar' });
                    }
                };
                
                reader.onerror = () => {
                    reject({ success: false, message: 'Error al leer archivo' });
                };
                
                reader.readAsText(file);
            });
        }
        
        // Generar ID único
        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        }
        
        // Disparar evento personalizado
        dispatchUpdateEvent() {
            window.dispatchEvent(new CustomEvent('bookmarksUpdated', {
                detail: { bookmarks: this.bookmarks }
            }));
        }
        
        // Inicializar UI
        init() {
            // Escuchar cambios de storage (sincronización entre pestañas)
            window.addEventListener('storage', (e) => {
                if (e.key === STORAGE_KEY) {
                    this.bookmarks = this.loadBookmarks();
                    this.dispatchUpdateEvent();
                }
            });
            
            // Inicializar botones de bookmark en posts
            this.initPostButtons();
        }
        
        // Inicializar botones en posts
        initPostButtons() {
            const postHeader = document.querySelector('.post-header');
            if (!postHeader) return;
            
            const currentUrl = window.location.pathname;
            const postTitle = document.querySelector('.post-title, h1')?.textContent || 'Post';
            const postExcerpt = document.querySelector('.post-excerpt')?.textContent || '';
            const postCategory = document.querySelector('.category-label')?.textContent || '';
            const postDate = document.querySelector('.post-date')?.textContent || '';
            
            // Crear botón de bookmark
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'bookmark-btn';
            bookmarkBtn.setAttribute('aria-label', 'Guardar en bookmarks');
            bookmarkBtn.innerHTML = this.getBookmarkIcon(this.exists(currentUrl));
            
            // Event listener
            bookmarkBtn.addEventListener('click', () => {
                if (this.exists(currentUrl)) {
                    const result = this.remove(currentUrl);
                    if (result.success) {
                        bookmarkBtn.innerHTML = this.getBookmarkIcon(false);
                        this.showNotification(result.message);
                    }
                } else {
                    const result = this.add(currentUrl, postTitle, postExcerpt, postCategory, postDate);
                    if (result.success) {
                        bookmarkBtn.innerHTML = this.getBookmarkIcon(true);
                        this.showNotification(result.message);
                    }
                }
            });
            
            // Agregar al header
            postHeader.appendChild(bookmarkBtn);
        }
        
        // Icono de bookmark
        getBookmarkIcon(isSaved) {
            if (isSaved) {
                return `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <span>Guardado</span>
                `;
            } else {
                return `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>Guardar</span>
                `;
            }
        }
        
        // Mostrar notificación
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'bookmark-notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Animar
            setTimeout(() => notification.classList.add('show'), 10);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    }
    
    // ================================================
    // EXPORTAR INSTANCIA GLOBAL
    // ================================================
    
    window.BookmarkManager = window.BookmarkManager || new BookmarkManager();
    
})();
