---
layout: default
title: Suscríbete al RSS Feed
permalink: /rss/
---

<section class="hero" style="padding: 3rem 0;">
    <div class="container">
        <div class="hero-content" style="text-align: center;">
            <h1 class="hero-title">
                <span class="gradient-text">Suscríbete al RSS</span>
            </h1>
            <p class="hero-subtitle">
                Mantente actualizado con los últimos artículos sobre Inteligencia Artificial
            </p>
        </div>
    </div>
</section>

<section class="blog-section">
    <div class="container" style="max-width: 800px;">
        <div class="post-content">
            <h2>🔔 ¿Qué es RSS?</h2>
            <p>
                RSS (Really Simple Syndication) es un formato que te permite recibir automáticamente 
                actualizaciones de tus sitios web favoritos sin tener que visitarlos constantemente.
            </p>

            <h2>📱 ¿Cómo suscribirme?</h2>
            
            <h3>Opción 1: Lectores RSS Web</h3>
            <ul>
                <li><strong>Feedly</strong> - <a href="https://feedly.com/i/subscription/feed/{{ site.url }}{{ site.baseurl }}/feed.xml" target="_blank" rel="noopener noreferrer">Suscribirse en Feedly</a></li>
                <li><strong>Inoreader</strong> - Copia la URL del feed y agrégala</li>
                <li><strong>NewsBlur</strong> - Busca nuestro blog o usa la URL</li>
            </ul>

            <h3>Opción 2: Aplicaciones móviles</h3>
            <ul>
                <li><strong>iOS:</strong> NetNewsWire, Reeder, Feedly</li>
                <li><strong>Android:</strong> Feedly, Inoreader, FeedMe</li>
            </ul>

            <h3>Opción 3: Copia directamente la URL</h3>
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <code style="color: var(--primary); word-break: break-all;">
                    {{ site.url }}{{ site.baseurl }}/feed.xml
                </code>
                <button onclick="copyFeedURL()" style="margin-left: 1rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    📋 Copiar URL
                </button>
            </div>

            <h2>🎯 Beneficios de usar RSS</h2>
            <ul>
                <li>✅ Recibe actualizaciones automáticamente</li>
                <li>✅ Sin spam ni registro obligatorio</li>
                <li>✅ Lee desde tu lector favorito</li>
                <li>✅ Organiza todos tus blogs en un solo lugar</li>
                <li>✅ Lee offline (según tu lector)</li>
                <li>✅ Sin algoritmos - ves TODO el contenido</li>
            </ul>

            <h2>📊 ¿Qué contendrá el feed?</h2>
            <p>
                Nuestro feed RSS incluye:
            </p>
            <ul>
                <li>📝 Título completo del artículo</li>
                <li>📅 Fecha de publicación</li>
                <li>🏷️ Categorías y etiquetas</li>
                <li>📄 Extracto o contenido completo</li>
                <li>🔗 Link directo al artículo</li>
            </ul>

            <div style="background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(131, 56, 236, 0.1)); padding: 2rem; border-radius: 12px; margin: 2rem 0; text-align: center;">
                <h3 style="margin-top: 0;">¿Listo para suscribirte?</h3>
                <a href="{{ '/feed.xml' | relative_url }}" class="btn-primary" style="display: inline-block; background: linear-gradient(135deg, #ff6b00, #ff9500); color: white; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 1rem;">
                    🔔 Acceder al Feed RSS
                </a>
            </div>

            <h2>❓ Preguntas Frecuentes</h2>
            
            <details style="margin: 1rem 0; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                <summary style="cursor: pointer; font-weight: bold;">¿Es gratis?</summary>
                <p style="margin-top: 1rem;">Sí, RSS es completamente gratis y siempre lo será. No requiere cuenta ni registro.</p>
            </details>

            <details style="margin: 1rem 0; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                <summary style="cursor: pointer; font-weight: bold;">¿Con qué frecuencia se actualiza?</summary>
                <p style="margin-top: 1rem;">El feed se actualiza automáticamente cada vez que publicamos un nuevo artículo.</p>
            </details>

            <details style="margin: 1rem 0; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                <summary style="cursor: pointer; font-weight: bold;">¿Puedo dejar de seguir el feed?</summary>
                <p style="margin-top: 1rem;">Sí, simplemente elimina la suscripción desde tu lector RSS. No hay compromisos.</p>
            </details>
        </div>
    </div>
</section>

<script>
function copyFeedURL() {
    const feedURL = '{{ site.url }}{{ site.baseurl }}/feed.xml';
    navigator.clipboard.writeText(feedURL).then(function() {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✅ ¡Copiado!';
        button.style.background = '#10b981';
        setTimeout(function() {
            button.textContent = originalText;
            button.style.background = 'var(--primary)';
        }, 2000);
    }, function(err) {
        console.error('Error al copiar: ', err);
        alert('No se pudo copiar. URL: ' + feedURL);
    });
}
</script>
