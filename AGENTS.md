# Guía de Agentes para Grupo Musical La Célula

Este documento proporciona información esencial para agentes de IA trabajando con el sitio web de Grupo Musical Versátil La Célula.

## Estructura del Proyecto

### Tecnologías Principales
- **Frontend**: HTML5, CSS3 (vanilla), JavaScript ES6+
- **Optimización**: Service Worker para PWA, WebP para imágenes
- **Chatbot**: Cloudflare Functions y JavaScript vanilla
- **Rendimiento**: Lazy loading, carga crítica, optimización de recursos

### Directorios Principales
- `/`: Archivos HTML principales (index.html, blog.html, cotizador.html)
- `/css/`: Hojas de estilo CSS
- `/js/`: Scripts JavaScript
- `/assets/`: Recursos estáticos (imágenes, iconos, etc.)
- `/post/`: Artículos individuales del blog
- `/functions/`: Funciones serverless para Cloudflare Pages (chatbot)

## Características Clave

### PWA (Progressive Web App)
- Service Worker (`sw.js`) para cache de recursos
- Manifiesto para instalación (`manifest.json`)
- Optimización para offline

### Chatbot de Asistencia Musical
- Implementado con JavaScript vanilla y Cloudflare Functions
- Respuestas basadas en patrones para preguntas comunes
- Integración con sistema de email para alertas de nuevos leads

### Blog
- Sistema de artículos estáticos con paginación dinámica
- Datos de posts en `js/blog-pagination.js`

## Comandos Importantes

### Optimización de Imágenes
```bash
./optimize-images.sh
```

### Minificación de Recursos
```bash
./minify-assets.sh
```

## Estructura del Chatbot

La implementación del chatbot consta de:

1. **Frontend (`chatbot.js`)**: 
   - Maneja la interfaz de usuario del chatbot
   - Gestiona conversaciones con los usuarios
   - Integrado en `index.html` y otras páginas

2. **Backend (`functions/api/chatbot.js`)**: 
   - Función serverless para Cloudflare Pages
   - Procesa solicitudes y genera respuestas 
   - Sistema de reglas para responder preguntas frecuentes

3. **Email Service (`functions/api/email.js`)**:
   - Envía notificaciones por email cuando se capturan leads
   - Configurado para usar Cloudflare o SendGrid

## Patrones de Código

### JavaScript
- IIFE para encapsulación
- Clases ES6 para componentes principales
- Event Delegation para gestión eficiente de eventos
- Lazy Loading para imágenes

### HTML
- Semántica HTML5
- Atributos ARIA para accesibilidad
- Schema.org para SEO

### CSS
- Variables CSS nativas
- Diseño Mobile-First
- Flexbox y Grid para layouts

## Convenciones de Nombres
- **Archivos**: kebab-case (ej: `blog-pagination.js`)
- **Clases CSS**: kebab-case para elementos (ej: `blog-post`), BEM para componentes complejos
- **Funciones JS**: camelCase (ej: `createBlogPost()`)
- **Clases JS**: PascalCase (ej: `CelulaChatbotManager`)

## Parámetros de Configuración

### Cloudflare Pages
- **API_KEY**: Secreto para API de IA del chatbot
- **SENDGRID_API_KEY**: Secreto para envío de emails

## Consejos de Desarrollo

1. **Modificación del Chatbot**:
   - Añadir nuevos patrones en `functions/api/chatbot.js` para expandir las respuestas
   - Probar localmente antes de desplegar

2. **Añadir Posts al Blog**:
   - Crear nuevo archivo HTML en `/post/`
   - Actualizar datos en `js/blog-pagination.js`

3. **Optimización**:
   - Comprimir imágenes antes de subirlas
   - Usar WebP con fallback a JPG para máxima compatibilidad

## Problemas Comunes

1. **Visualización en iOS Safari**:
   - Verificar compatibilidad de características CSS
   - Asegurar que las imágenes WebP tienen fallback

2. **Chatbot no carga**:
   - Verificar que Cloudflare Pages tenga configurados los Secrets correctamente
   - Revisar los logs de Functions en el dashboard de Cloudflare