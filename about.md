---
layout: default
title: Acerca de
permalink: /about/
---

<section class="about-page">
    <div class="container">
        <h1 class="page-title">Acerca de {{ site.title }}</h1>
        
        <div class="about-content-page">
            <p class="lead">
                Bienvenido a nuestro espacio dedicado a explorar el fascinante mundo de la Inteligencia Artificial.
            </p>
            
            <h2>Nuestra Misión</h2>
            <p>
                Compartir conocimiento, análisis y las últimas tendencias en IA, Machine Learning, Deep Learning 
                y tecnologías emergentes. Creemos que el futuro de la tecnología está en la inteligencia artificial, 
                y queremos hacer este conocimiento accesible para todos.
            </p>
            
            <h2>¿Qué Encontrarás Aquí?</h2>
            <div class="features-list">
                <div class="feature-item">
                    <h3>📚 Tutoriales</h3>
                    <p>Guías paso a paso sobre algoritmos, frameworks y técnicas de IA</p>
                </div>
                
                <div class="feature-item">
                    <h3>🔬 Investigación</h3>
                    <p>Análisis de papers y avances recientes en el campo</p>
                </div>
                
                <div class="feature-item">
                    <h3>💡 Aplicaciones Prácticas</h3>
                    <p>Casos de uso reales y proyectos implementados</p>
                </div>
                
                <div class="feature-item">
                    <h3>🤔 Reflexiones Éticas</h3>
                    <p>Discusiones sobre el impacto social y ético de la IA</p>
                </div>
            </div>
            
            <h2>Temas Principales</h2>
            <ul class="topics-list">
                <li><strong>Machine Learning:</strong> Algoritmos de aprendizaje supervisado, no supervisado y por refuerzo</li>
                <li><strong>Deep Learning:</strong> Redes neuronales, CNN, RNN, Transformers y arquitecturas avanzadas</li>
                <li><strong>NLP:</strong> Procesamiento de lenguaje natural, modelos de lenguaje grandes (LLMs)</li>
                <li><strong>Computer Vision:</strong> Reconocimiento de imágenes, detección de objetos, segmentación</li>
                <li><strong>Robótica:</strong> IA aplicada a sistemas robóticos y autónomos</li>
                <li><strong>Ética en IA:</strong> Sesgos, fairness, transparencia y responsabilidad</li>
            </ul>
            
            <h2>Sobre el Autor</h2>
            <p>
                {{ site.author }} es un apasionado de la inteligencia artificial y el aprendizaje automático, 
                con experiencia en desarrollo e implementación de soluciones basadas en IA.
            </p>
            
            <h2>Contacto</h2>
            <p>
                ¿Tienes preguntas, sugerencias o quieres colaborar? 
                <a href="mailto:{{ site.email }}">Contáctame por email</a>
                {% if site.github_username %}
                o sígueme en <a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener">GitHub</a>
                {% endif %}.
            </p>
            
            <div class="cta-section">
                <h3>¡Mantente Actualizado!</h3>
                <p>El blog se actualiza regularmente con nuevo contenido sobre IA y tecnología.</p>
                <a href="{{ '/' | relative_url }}" class="btn-primary">Ver Últimas Publicaciones</a>
            </div>
        </div>
    </div>
</section>

<style>
.about-page {
    padding: 4rem 0;
}

.page-title {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: 3rem;
    text-align: center;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.about-content-page {
    max-width: 800px;
    margin: 0 auto;
}

.lead {
    font-size: 1.5rem;
    color: var(--text-secondary);
    margin-bottom: 3rem;
    text-align: center;
    line-height: 1.6;
}

.about-content-page h2 {
    font-size: 2rem;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.about-content-page p {
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
}

.features-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
}

.feature-item {
    padding: 1.5rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    transition: all 0.3s;
}

.feature-item:hover {
    border-color: var(--primary);
    transform: translateY(-5px);
}

.feature-item h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
}

.feature-item p {
    font-size: 1rem;
    margin: 0;
}

.topics-list {
    list-style: none;
    padding: 0;
}

.topics-list li {
    padding: 1rem;
    margin-bottom: 1rem;
    background: var(--bg-card);
    border-left: 4px solid var(--primary);
    border-radius: 0.25rem;
    font-size: 1.125rem;
    color: var(--text-secondary);
}

.topics-list strong {
    color: var(--primary);
}

.cta-section {
    margin-top: 4rem;
    padding: 3rem;
    background: var(--bg-card);
    border: 2px solid var(--primary);
    border-radius: 1rem;
    text-align: center;
}

.cta-section h3 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.cta-section p {
    margin-bottom: 2rem;
}

.about-content-page a {
    color: var(--primary);
    text-decoration: none;
    border-bottom: 1px solid var(--primary);
    transition: all 0.3s;
}

.about-content-page a:hover {
    color: var(--accent);
    border-color: var(--accent);
}

@media (max-width: 768px) {
    .about-page {
        padding: 2rem 0;
    }
    
    .features-list {
        grid-template-columns: 1fr;
    }
    
    .cta-section {
        padding: 2rem 1rem;
    }
}
</style>
