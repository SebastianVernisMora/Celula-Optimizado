/**
 * Blog Pagination Script
 * Manages pagination for the blog posts
 * Grupo Musical Versátil La Célula
 */

(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎵 Inicializando blog-pagination.js...');
        
        // Configuración de paginación dinámica para posts
        const postsPerPage = 6;

        // Lista de posts (se puede actualizar automáticamente cuando se agregan nuevos posts)
        const blogPosts = [
            {
                id: 'post-32',
                title: 'Tu Tranquilidad no Tiene Precio: Por Qué Siempre Debes Firmar un Contrato',
                excerpt: 'Firmar un contrato al contratar una banda musical asegura tranquilidad y evita problemas. Descubre por qué Grupo Musical Versátil La Célula lo considera esencial.',
                date: '14 nov 2025',
                image: 'assets/gallery/banda-1.jpg',
                url: 'post/post-32.html'
            },
            {
                id: 'post-31',
                title: 'Lo que Nuestros Clientes Dicen de Nosotros: Historias de Eventos Inolvidables',
                excerpt: 'Descubre testimonios reales de clientes que vivieron eventos inolvidables con Grupo Musical Versátil La Célula y por qué nos recomiendan.',
                date: '11 nov 2025',
                image: 'assets/gallery/banda-2.jpg',
                url: 'post/post-31.html'
            },
            {
                id: 'post-30',
                title: 'Dale un Toque Especial a tu Posada: El Poder de la Música en Vivo',
                excerpt: 'Transforma tu posada navideña en un evento memorable con música en vivo. Grupo Musical Versátil La Célula ofrece el repertorio perfecto para estas celebraciones.',
                date: '08 nov 2025',
                image: 'assets/gallery/banda-3.jpg',
                url: 'post/post-30.html'
            },
            {
                id: 'post-29',
                title: 'Propósitos para 2026: ¡Hacer Eventos Más Memorables!',
                excerpt: 'Comienza el 2026 con el propósito de crear eventos verdaderamente inolvidables. Descubre cómo Grupo Musical Versátil La Célula puede ayudarte a lograrlo.',
                date: '05 nov 2025',
                image: 'assets/gallery/banda-4.jpg',
                url: 'post/post-29.html'
            },
            {
                id: 'post-28',
                title: 'Grupo Musical vs. Rockola Digital: ¿Cuál es Mejor para tu Fiesta?',
                excerpt: 'Análisis comparativo entre contratar un grupo musical o usar una rockola digital. Descubre por qué Grupo Musical Versátil La Célula ofrece una experiencia insuperable.',
                date: '02 nov 2025',
                image: 'assets/gallery/banda-5.jpg',
                url: 'post/post-28.html'
            },
            {
                id: 'post-27',
                title: 'Cómo la Música en Vivo Puede Potenciar el Lanzamiento de tu Producto',
                excerpt: 'La música en vivo puede aumentar significativamente el impacto de tu lanzamiento de producto. Descubre cómo Grupo Musical Versátil La Célula crea experiencias memorables.',
                date: '30 oct 2025',
                image: 'assets/gallery/banda-6.jpg',
                url: 'post/post-27.html'
            },
            {
                id: 'post-26',
                title: '3 Maneras de Romper el Hielo y Animar tu Evento Corporativo con Música',
                excerpt: 'Estrategias efectivas para animar eventos corporativos con música en vivo. Grupo Musical Versátil La Célula comparte técnicas para crear el ambiente ideal.',
                date: '27 oct 2025',
                image: 'assets/gallery/banda-7.jpg',
                url: 'post/post-26.html'
            },
            {
                id: 'post-25',
                title: 'Guía de Proveedores: Planeando una Boda en el Área Metropolitana',
                excerpt: 'Guía completa de proveedores para organizar tu boda en el Área Metropolitana. Descubre cómo Grupo Musical Versátil La Célula complementa estos servicios.',
                date: '24 oct 2025',
                image: 'assets/gallery/banda-8.jpg',
                url: 'post/post-25.html'
            },
            {
                id: 'post-24',
                title: 'Los 5 Errores Más Comunes al Contratar Música para tu Evento (y Cómo Evitarlos)',
                excerpt: 'Evita los errores frecuentes al contratar música para eventos. Aprende cómo Grupo Musical Versátil La Célula garantiza una experiencia musical impecable.',
                date: '21 oct 2025',
                image: 'assets/gallery/banda-9.jpg',
                url: 'post/post-24.html'
            },
            {
                id: 'post-23',
                title: 'Cómo Crear la Playlist Perfecta para tu Boda (y por qué es mejor dejarlo a un profesional)',
                excerpt: 'Consejos para crear una playlist ideal para tu boda y razones por las que Grupo Musical Versátil La Célula puede elevar la experiencia con música en vivo.',
                date: '18 oct 2025',
                image: 'assets/gallery/banda-10.jpg',
                url: 'post/post-23.html'
            },
            {
                id: 'post-22',
                title: '¿DJ o Grupo en Vivo? 7 Razones por las que la Música en Vivo Hará Inolvidable tu Evento',
                excerpt: 'Comparativa entre DJ y música en vivo para eventos. Descubre 7 razones convincentes para elegir a Grupo Musical Versátil La Célula y crear momentos únicos.',
                date: '15 oct 2025',
                image: 'assets/gallery/banda-1.jpg',
                url: 'post/post-22.html'
            },
            {
                id: 'post-21',
                title: 'Guía Paso a Paso: Cómo Contratar a Célula para tu Evento',
                excerpt: 'Proceso simplificado en 5 pasos para contratar a Grupo Musical Versátil La Célula. Todo lo que necesitas saber para asegurar la mejor música en vivo.',
                date: '12 oct 2025',
                image: 'assets/gallery/banda-2.jpg',
                url: 'post/post-21.html'
            },
            {
                id: 'post-20',
                title: '¿DJ o Grupo en Vivo? 7 Razones por las que la Música en Vivo Hará Inolvidable tu Evento',
                excerpt: 'Análisis detallado de las ventajas de la música en vivo frente a un DJ. Siete argumentos a favor de elegir a Grupo Musical Versátil La Célula.',
                date: '10 oct 2025',
                image: 'assets/gallery/banda-3.jpg',
                url: 'post/post-20.html'
            },
            {
                id: 'post-19',
                title: '¿Por qué los Hoteles de Lujo Prefieren Bandas Versátiles para sus Eventos?',
                excerpt: 'Descubre las razones por las que los hoteles de lujo eligen bandas versátiles como La Célula para crear experiencias excepcionales en sus eventos exclusivos.',
                date: '08 oct 2025',
                image: 'assets/gallery/banda-4.jpg',
                url: 'post/post-19.html'
            },
            {
                id: 'post-18',
                title: '5 Momentos Clave donde la Música en Vivo Cambia tu Evento por Completo',
                excerpt: 'Análisis de los momentos cruciales donde la música en vivo transforma un evento ordinario en extraordinario con Grupo Musical Versátil La Célula.',
                date: '05 oct 2025',
                image: 'assets/gallery/banda-5.jpg',
                url: 'post/post-18.html'
            },
            {
                id: 'post-17',
                title: '15 Canciones Mágicas para el Primer Baile de los Novios',
                excerpt: 'Selección de 15 canciones románticas ideales para el primer baile nupcial. Grupo Musical Versátil La Célula puede interpretarlas para crear un momento mágico.',
                date: '02 oct 2025',
                image: 'assets/gallery/banda-6.jpg',
                url: 'post/post-17.html'
            },
            {
                id: 'post-16',
                title: '¿Qué Equipo de Sonido Necesita una Banda para un Evento? Lo que Debes Saber',
                excerpt: 'Guía técnica sobre el equipo de sonido profesional para eventos. Descubre cómo Grupo Musical Versátil La Célula garantiza calidad sonora excepcional.',
                date: '29 sep 2025',
                image: 'assets/gallery/banda-7.jpg',
                url: 'post/post-16.html'
            },
            {
                id: 'post-15',
                title: '10 Preguntas Clave que Debes Hacerle a una Banda Antes de Contratarla',
                excerpt: 'Lista de preguntas esenciales para evaluar una banda musical. Grupo Musical Versátil La Célula responde a estas cuestiones para brindarte seguridad.',
                date: '26 sep 2025',
                image: 'assets/gallery/banda-8.jpg',
                url: 'post/post-15.html'
            },
            {
                id: 'post-14',
                title: 'La Imagen También Suena: La Importancia del Vestuario en una Banda de Eventos',
                excerpt: 'Análisis del impacto visual del vestuario en la presentación de una banda. Cómo Grupo Musical Versátil La Célula cuida cada detalle estético.',
                date: '23 sep 2025',
                image: 'assets/gallery/banda-9.jpg',
                url: 'post/post-14.html'
            },
            {
                id: 'post-13',
                title: '5 Géneros Musicales que no Pueden Faltar en tu Boda para que Todos Bailen',
                excerpt: 'Guía de los géneros musicales imprescindibles para mantener la pista llena en tu boda. Grupo Musical Versátil La Célula domina estos estilos a la perfección.',
                date: '20 sep 2025',
                image: 'assets/gallery/banda-10.jpg',
                url: 'post/post-13.html'
            },
            {
                id: 'post-12',
                title: 'La Mejor Música para una Fiesta de XV Años Moderna y Divertida',
                excerpt: 'Estrategias para combinar géneros musicales que hagan de tu fiesta de XV años un evento intergeneracional con Grupo Musical Versátil La Célula.',
                date: '17 sep 2025',
                image: 'assets/gallery/banda-1.jpg',
                url: 'post/post-12.html'
            },
            {
                id: 'post-11',
                title: 'No es solo tocar: Así es el Montaje de Grupo Musical Versátil La Célula para un Evento',
                excerpt: 'Entre bastidores: el trabajo profesional de preparación y montaje que Grupo Musical Versátil La Célula realiza para garantizar un espectáculo perfecto.',
                date: '14 sep 2025',
                image: 'assets/gallery/banda-2.jpg',
                url: 'post/post-11.html'
            },
            {
                id: 'post-10',
                title: 'Cómo Elegir la Música Correcta para tu Próximo Evento Corporativo',
                excerpt: 'Guía para seleccionar el estilo musical adecuado que transforme tu evento corporativo con la versatilidad de Grupo Musical Versátil La Célula.',
                date: '11 sep 2025',
                image: 'assets/gallery/banda-3.jpg',
                url: 'post/post-10.html'
            },
            {
                id: 'post-9',
                title: 'Creando el Ambiente Perfecto: La Mejor Música para la Recepción de tu Boda',
                excerpt: 'Recomendaciones musicales para cada momento de la recepción nupcial. Cómo Grupo Musical Versátil La Célula crea la atmósfera ideal para tu gran día.',
                date: '08 sep 2025',
                image: 'assets/gallery/banda-4.jpg',
                url: 'post/post-9.html'
            },
            {
                id: 'post-8',
                title: 'Celebrando el Amor Duradero: La Mejor Música para Aniversarios y Bodas de Plata/Oro',
                excerpt: 'Selección musical especial para celebraciones de aniversarios significativos. Grupo Musical Versátil La Célula revive recuerdos con su repertorio nostálgico.',
                date: '05 sep 2025',
                image: 'assets/gallery/banda-5.jpg',
                url: 'post/post-8.html'
            },
            {
                id: 'post-6',
                title: 'Elegancia y Sofisticación: La Música Perfecta para una Cena de Gala',
                excerpt: 'Recomendaciones de géneros elegantes como jazz y bossa nova para cenas de gala. Grupo Musical Versátil La Célula crea la atmósfera refinada ideal.',
                date: '29 ago 2025',
                image: 'assets/gallery/banda-7.jpg',
                url: 'post/post-6.html'
            },
            {
                id: 'post-5',
                title: 'Cómo Lograr que tu Boda se Convierta en la Fiesta del Año con Música en Vivo',
                excerpt: 'Estrategias para transformar tu boda en la celebración más memorable. La música en vivo de Grupo Musical Versátil La Célula como elemento diferenciador.',
                date: '26 ago 2025',
                image: 'assets/gallery/banda-8.jpg',
                url: 'post/post-5.html'
            },
            {
                id: 'post-4',
                title: '5 Géneros Musicales que no Pueden Faltar en tu Boda para que Todos Bailen',
                excerpt: 'Los cinco estilos musicales esenciales que garantizan una pista de baile llena en tu boda con la interpretación de Grupo Musical Versátil La Célula.',
                date: '23 ago 2025',
                image: 'assets/gallery/banda-5.jpg',
                url: 'post/post-4.html'
            },
            {
                id: 'post-3',
                title: 'Más que Canciones: Los Beneficios Psicológicos de la Música en Vivo en tu Evento',
                excerpt: 'Análisis del impacto emocional y psicológico de la música en vivo. Cómo Grupo Musical Versátil La Célula crea experiencias que estimulan los sentidos.',
                date: '20 ago 2025',
                image: 'assets/gallery/banda-10.jpg',
                url: 'post/post-3.html'
            },
            {
                id: 'post-2',
                title: '¿Por qué la Cumbia nos Hace Bailar a Todos? La Psicología de la Música para Fiestas',
                excerpt: 'Análisis del poder irresistible de la cumbia en las celebraciones. Grupo Musical Versátil La Célula explica los factores psicológicos detrás de este fenómeno.',
                date: '17 ago 2025',
                image: 'assets/gallery/banda-1.jpg',
                url: 'post/post-2.html'
            },
            {
                id: 'post-1',
                title: 'De los 80s a Hoy: Un Viaje por el Repertorio Musical de La Célula',
                excerpt: 'Recorrido por el diverso repertorio de Grupo Musical Versátil La Célula, desde clásicos ochenteros hasta éxitos actuales que garantizan conectar con toda audiencia.',
                date: '14 ago 2025',
                image: 'assets/gallery/banda-2.jpg',
                url: 'post/post-1.html'
            }
        ];

        const container = document.getElementById('blog-posts-container');
        
        if (!container) {
            console.error('❌ No se encontró el contenedor blog-posts-container');
            return;
        }

        console.log('📦 Container encontrado:', container);

        // Función para crear un artículo de blog sin categoría
        function createBlogPost(post) {
            const article = document.createElement('article');
            article.className = 'blog-post-card';

            article.innerHTML = `
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}" class="post-img">
                </div>
                <div class="post-content-card">
                    <div class="post-meta">
                        <span class="post-date">${post.date}</span>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <a href="${post.url}" class="btn btn-secondary">Leer más</a>
                </div>
            `;
            
            return article;
        }

        console.log('📝 Creando', blogPosts.length, 'posts...');
        
        // Crear todos los posts y almacenarlos
        const allPosts = blogPosts.map(post => createBlogPost(post));
        console.log('✅ Posts creados:', allPosts.length);
        
        // Limpiar el contenedor y agregar los posts
        container.innerHTML = '';
        allPosts.forEach(post => container.appendChild(post));
        console.log('✅ Posts agregados al contenedor');

        const totalPages = Math.ceil(blogPosts.length / postsPerPage);
        let currentPage = 1;

        /**
         * Muestra los posts correspondientes a la página especificada
         * @param {number} pageNumber - Número de página a mostrar
         */
        function showPage(pageNumber) {
            // Calcular el índice de inicio y fin
            const startIndex = (pageNumber - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;

            // Ocultar todos los posts usando clases
            allPosts.forEach(post => {
                post.classList.add('hidden-post');
            });

            // Mostrar solo los posts para la página actual
            for (let i = startIndex; i < Math.min(endIndex, allPosts.length); i++) {
                allPosts[i].classList.remove('hidden-post');
            }

            // Actualizar la variable de página actual
            currentPage = pageNumber;
        }

        // Eliminamos las funciones de paginación ya que mostraremos todos los posts

        // Mostrar todos los posts sin paginación
        console.log('📄 Mostrando todos los posts sin paginación');
        
        // Asegurarse de que todos los posts sean visibles
        allPosts.forEach(post => {
            post.classList.remove('hidden-post');
        });
    });
})();