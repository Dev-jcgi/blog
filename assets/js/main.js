// Blog Frontend Script
// Gestión de posts y visualización

// Cargar posts desde localStorage
function loadPosts() {
    const posts = localStorage.getItem('blogPosts');
    return posts ? JSON.parse(posts) : [];
}

// Formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Convertir Markdown básico a HTML
function markdownToHTML(text) {
    if (!text) return '';
    
    return text
        // Encabezados
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Negrita
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Cursiva
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Código inline
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        // Listas
        .replace(/^\- (.+)$/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        // Párrafos
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gim, '<p>$1</p>')
        // Limpiar tags p duplicados
        .replace(/<p><h/g, '<h')
        .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
        .replace(/<p><ul>/g, '<ul>')
        .replace(/<\/ul><\/p>/g, '</ul>');
}

// Renderizar posts
function renderPosts(postsToRender = null) {
    const posts = postsToRender || loadPosts();
    const container = document.getElementById('postsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (!posts || posts.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    // Ordenar posts por fecha (más recientes primero)
    const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedPosts.map(post => `
        <article class="post-card" onclick="openPost('${post.id}')">
            ${post.image 
                ? `<img src="${post.image}" alt="${post.title}" class="post-image">` 
                : `<div class="post-image">🤖</div>`
            }
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span class="post-date">${formatDate(post.date)}</span>
                </div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-excerpt">${post.excerpt}</p>
                ${post.tags && post.tags.length > 0 
                    ? `<div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>` 
                    : ''
                }
            </div>
        </article>
    `).join('');
}

// Abrir post en modal
function openPost(postId) {
    const posts = loadPosts();
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    const modal = document.getElementById('postModal');
    const modalContent = document.getElementById('modalPostContent');
    
    modalContent.innerHTML = `
        <div class="post-meta">
            <span class="post-category">${post.category}</span>
            <span class="post-date">${formatDate(post.date)}</span>
        </div>
        <h2>${post.title}</h2>
        ${post.image ? `<img src="${post.image}" alt="${post.title}" style="width: 100%; border-radius: 0.5rem; margin: 1.5rem 0;">` : ''}
        ${post.tags && post.tags.length > 0 
            ? `<div class="post-tags" style="margin-bottom: 1.5rem;">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>` 
            : ''
        }
        <div class="post-body">${markdownToHTML(post.content)}</div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('postModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('postModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Búsqueda de posts
function searchPosts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        renderPosts();
        return;
    }
    
    const posts = loadPosts();
    const filteredPosts = posts.filter(post => {
        return post.title.toLowerCase().includes(query) ||
               post.excerpt.toLowerCase().includes(query) ||
               post.content.toLowerCase().includes(query) ||
               post.category.toLowerCase().includes(query) ||
               (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query)));
    });
    
    renderPosts(filteredPosts);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cargar posts al iniciar
    renderPosts();
    
    // Configurar búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchPosts);
    }
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Actualizar posts cuando cambie el localStorage (sincronización entre pestañas)
window.addEventListener('storage', function(e) {
    if (e.key === 'blogPosts') {
        renderPosts();
    }
});

// Agregar algunos posts de ejemplo si no hay ninguno
function addSamplePosts() {
    const posts = loadPosts();
    if (posts.length === 0) {
        const samplePosts = [
            {
                id: Date.now().toString() + '-1',
                title: 'Introducción al Machine Learning',
                category: 'Machine Learning',
                excerpt: 'Descubre los conceptos fundamentales del aprendizaje automático y cómo está transformando la tecnología moderna.',
                content: `# Introducción al Machine Learning

El **Machine Learning** (Aprendizaje Automático) es una rama de la inteligencia artificial que permite a las computadoras aprender de los datos sin ser programadas explícitamente.

## ¿Qué es Machine Learning?

Machine Learning es el estudio de algoritmos que mejoran automáticamente a través de la experiencia y el uso de datos. Es una tecnología que está detrás de muchas aplicaciones actuales:

- Recomendaciones de Netflix y Spotify
- Reconocimiento facial en smartphones
- Detección de spam en correo electrónico
- Vehículos autónomos

## Tipos de Machine Learning

### Aprendizaje Supervisado
Se entrena el modelo con datos etiquetados. El algoritmo aprende la relación entre entradas y salidas.

### Aprendizaje No Supervisado
El modelo encuentra patrones en datos sin etiquetar. Clustering y reducción de dimensionalidad son ejemplos comunes.

### Aprendizaje por Refuerzo
El agente aprende a través de prueba y error, recibiendo recompensas o penalizaciones.

## Aplicaciones Prácticas

El Machine Learning está revolucionando industrias:

1. **Salud**: Diagnóstico médico y descubrimiento de fármacos
2. **Finanzas**: Detección de fraudes y trading algorítmico
3. **Retail**: Personalización y optimización de inventario
4. **Manufactura**: Mantenimiento predictivo

¡El futuro del ML es emocionante y lleno de posibilidades!`,
                image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800',
                tags: ['ML', 'IA', 'Tutorial'],
                date: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: Date.now().toString() + '-2',
                title: 'GPT-4 y el Futuro del Procesamiento de Lenguaje Natural',
                category: 'NLP',
                excerpt: 'Explora las capacidades revolucionarias de GPT-4 y cómo está cambiando la forma en que interactuamos con la IA.',
                content: `# GPT-4 y el Futuro del NLP

**GPT-4** representa un salto cuántico en el procesamiento de lenguaje natural, estableciendo nuevos estándares en comprensión y generación de texto.

## Características Revolucionarias

GPT-4 destaca por:

- **Comprensión contextual mejorada**: Entiende matices y contextos complejos
- **Razonamiento avanzado**: Puede resolver problemas lógicos y matemáticos
- **Multimodalidad**: Procesa texto e imágenes conjuntamente
- **Mayor precisión**: Menos alucinaciones y respuestas más confiables

## Casos de Uso

### Educación
Tutorías personalizadas y generación de contenido educativo adaptativo.

### Desarrollo de Software
Asistencia en programación, debugging y documentación de código.

### Creatividad
Escritura creativa, generación de ideas y brainstorming.

## Consideraciones Éticas

Es crucial considerar:

- Sesgos en los datos de entrenamiento
- Uso responsable de la tecnología
- Transparencia en aplicaciones de IA
- Privacidad y seguridad de datos

El futuro del NLP es prometedor, pero requiere un desarrollo ético y responsable.`,
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
                tags: ['NLP', 'GPT-4', 'IA Generativa'],
                date: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: Date.now().toString() + '-3',
                title: 'Redes Neuronales Convolucionales para Visión por Computadora',
                category: 'Computer Vision',
                excerpt: 'Aprende cómo las CNN están revolucionando el campo de la visión por computadora y sus aplicaciones prácticas.',
                content: `# Redes Neuronales Convolucionales

Las **CNN (Convolutional Neural Networks)** son el corazón de la visión por computadora moderna.

## ¿Qué son las CNN?

Las CNN son redes neuronales especializadas en procesar datos con estructura de cuadrícula, como imágenes.

### Componentes Clave

**Capas Convolucionales**
Detectan características locales mediante filtros.

**Capas de Pooling**
Reducen la dimensionalidad preservando información importante.

**Capas Fully Connected**
Realizan la clasificación final.

## Arquitecturas Famosas

- **LeNet**: Pionera en reconocimiento de dígitos
- **AlexNet**: Ganadora de ImageNet 2012
- **VGG**: Arquitectura profunda y uniforme
- **ResNet**: Introduce conexiones residuales
- **EfficientNet**: Optimización del escalado

## Aplicaciones Modernas

1. **Reconocimiento Facial**: Desbloqueo de dispositivos, seguridad
2. **Diagnóstico Médico**: Detección de tumores y enfermedades
3. **Vehículos Autónomos**: Detección de objetos y señales
4. **Realidad Aumentada**: Tracking y reconocimiento de escenas

## Tendencias Futuras

- Vision Transformers (ViT)
- Few-shot learning
- Self-supervised learning
- Eficiencia computacional

Las CNN seguirán siendo fundamentales en la evolución de la IA visual.`,
                image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800',
                tags: ['Deep Learning', 'CNN', 'Computer Vision'],
                date: new Date(Date.now() - 259200000).toISOString()
            }
        ];
        
        localStorage.setItem('blogPosts', JSON.stringify(samplePosts));
        renderPosts();
    }
}

// Inicializar con posts de ejemplo si está vacío
addSamplePosts();

// ===== MODO CLARO/OSCURO =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    // Por defecto, tema oscuro
    const themePreference = localStorage.getItem('theme') || 'dark';
    
    // Aplicar tema guardado
    document.documentElement.setAttribute('data-theme', themePreference);
    if (themeToggle) {
        themeToggle.classList.toggle('active', themePreference === 'light');
    }
    
    // Event listener para el toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.classList.toggle('active');
        });
    }
}

// Inicializar tema inmediatamente (antes del DOMContentLoaded para evitar flash)
(function() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
})();

// Inicializar tema al cargar la página
initThemeToggle();

// ===== SHARE FUNCTIONALITY =====
function sharePost(url, title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(err => console.log('Error al compartir:', err));
    }
}

// ===== TABLA DE CONTENIDOS =====
function generateTableOfContents() {
    const article = document.querySelector('.post-body-content');
    if (!article) return;
    
    const headings = article.querySelectorAll('h2, h3');
    if (headings.length < 3) return; // Solo mostrar si hay suficientes encabezados
    
    const toc = document.createElement('div');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h3>Tabla de Contenidos</h3><nav class="toc-nav"></nav>';
    
    const nav = toc.querySelector('.toc-nav');
    const ul = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        li.className = heading.tagName.toLowerCase();
        
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = heading.textContent;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        });
        
        li.appendChild(a);
        ul.appendChild(li);
    });
    
    nav.appendChild(ul);
    article.insertBefore(toc, article.firstChild);
}

// Inicializar tabla de contenidos si estamos en una página de post
if (document.querySelector('.post-body-content')) {
    document.addEventListener('DOMContentLoaded', generateTableOfContents);
}

// ===== ANALYTICS =====
function initAnalytics() {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        // Trackear vista de página
        gtag('event', 'page_view', {
            page_path: window.location.pathname
        });
    }
    
    // Plausible Analytics
    if (typeof plausible !== 'undefined') {
        plausible('pageview');
    }
}

initAnalytics();

// ===== POSTS RELACIONADOS =====
function findRelatedPosts(currentPostId, maxResults = 3) {
    const posts = loadPosts();
    const currentPost = posts.find(p => p.id === currentPostId);
    
    if (!currentPost) return [];
    
    // Calcular puntuación de similitud
    const scoredPosts = posts
        .filter(p => p.id !== currentPostId)
        .map(post => {
            let score = 0;
            
            // Misma categoría = +3 puntos
            if (post.category === currentPost.category) score += 3;
            
            // Tags en común
            if (currentPost.tags && post.tags) {
                const commonTags = post.tags.filter(tag => 
                    currentPost.tags.includes(tag)
                );
                score += commonTags.length;
            }
            
            return { ...post, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults);
    
    return scoredPosts;
}

// ===== COPY TO CLIPBOARD =====
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copiado al portapapeles');
        });
    }
}

// ===== TOAST NOTIFICATION =====
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `
        <div class="toast-content">
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===== LAZY LOADING DE IMÁGENES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    });
}

// ===== READING PROGRESS BAR =====
function initReadingProgress() {
    const article = document.querySelector('.post-article');
    if (!article) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.prepend(progressBar);
    
    const bar = progressBar.querySelector('.reading-progress-bar');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + '%';
    });
}

if (document.querySelector('.post-article')) {
    initReadingProgress();
}
