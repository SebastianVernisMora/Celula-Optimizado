/**
 * Script para extraer Critical CSS
 * Extrae solo el CSS necesario para el above-the-fold
 */

const fs = require('fs');
const path = require('path');

// Critical CSS para la página de inicio
const criticalCSS = `
/* Critical CSS - Above the fold */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    height: 100%;
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    background: transparent;
    color: #fff;
    overflow-x: hidden;
}

:root {
    --primary-bg: #000000;
    --primary-text: #ffffff;
    --accent-yellow: #fbe649;
    --button-blue: #3d9be9;
    --header-height: 55px;
}

/* Header */
.site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 40px;
}

.nav-link {
    color: var(--primary-text);
    text-decoration: none;
    font-weight: bold;
    font-size: 15px;
    letter-spacing: 1px;
    transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
    color: var(--accent-yellow);
}

/* Hero Section */
.hero-section {
    position: relative;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}

.hero-content {
    position: relative;
    z-index: 2;
    padding: 20px;
}

.hero-logo {
    max-width: 400px;
    width: 90%;
    height: auto;
    margin-bottom: 30px;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.5));
}

.hero-title {
    font-family: 'Lobster', cursive;
    font-size: 50px;
    color: var(--primary-text);
    margin-bottom: 30px;
    text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.7);
}

.social-bar {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
}

.social-icon {
    width: 39px;
    height: 39px;
    border-radius: 50%;
    transition: transform 0.3s ease;
    filter: brightness(0) invert(1);
}

/* Video Background */
.hero-video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
}

.hero-video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 10px;
    position: absolute;
    right: 20px;
}

.mobile-menu-toggle span {
    width: 25px;
    height: 3px;
    background: var(--primary-text);
    transition: all 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .mobile-menu-toggle {
        display: flex;
    }
    
    .hero-title {
        font-size: 35px;
    }
    
    .hero-logo {
        max-width: 250px;
    }
}
`;

// Guardar Critical CSS
const outputPath = path.join(__dirname, 'css', 'critical.css');
fs.writeFileSync(outputPath, criticalCSS.trim());

console.log('✅ Critical CSS extraído y guardado en:', outputPath);
console.log('📏 Tamaño:', Buffer.byteLength(criticalCSS, 'utf8'), 'bytes');
console.log('');
console.log('💡 Próximos pasos:');
console.log('   1. Inline este CSS en el <head> de index.html');
console.log('   2. Cargar styles.css de forma asíncrona');
console.log('   3. Usar <link rel="preload"> para styles.css');
console.log('');
console.log('Ejemplo de implementación:');
console.log('');
console.log('<head>');
console.log('  <style>' + criticalCSS.substring(0, 50) + '...</style>');
console.log('  <link rel="preload" href="css/styles.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">');
console.log('  <noscript><link rel="stylesheet" href="css/styles.css"></noscript>');
console.log('</head>');
