#!/bin/bash

# Script de minificación de CSS y JavaScript
# Reduce el tamaño de los archivos para mejor rendimiento

echo "🗜️  Iniciando minificación de assets..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js no está instalado${NC}"
    exit 1
fi

# Instalar herramientas si no existen
if ! command -v npx &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm no está instalado${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Instalando herramientas de minificación...${NC}"
npm install --no-save cssnano-cli terser 2>/dev/null

# Crear directorio para archivos minificados
mkdir -p dist/css dist/js

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 MINIFICANDO CSS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

css_before=0
css_after=0

for css_file in css/*.css; do
    if [ -f "$css_file" ] && [[ ! "$css_file" =~ \.min\.css$ ]]; then
        filename=$(basename "$css_file" .css)
        
        # Tamaño antes
        size_before=$(stat -f%z "$css_file" 2>/dev/null || stat -c%s "$css_file" 2>/dev/null)
        css_before=$((css_before + size_before))
        
        # Minificar
        npx cssnano "$css_file" "dist/css/${filename}.min.css" 2>/dev/null
        
        if [ -f "dist/css/${filename}.min.css" ]; then
            # Tamaño después
            size_after=$(stat -f%z "dist/css/${filename}.min.css" 2>/dev/null || stat -c%s "dist/css/${filename}.min.css" 2>/dev/null)
            css_after=$((css_after + size_after))
            
            # Calcular reducción
            reduction=$((100 - (size_after * 100 / size_before)))
            
            echo -e "${GREEN}✓${NC} ${filename}.css: $(numfmt --to=iec $size_before) → $(numfmt --to=iec $size_after) (-${reduction}%)"
        fi
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ MINIFICANDO JAVASCRIPT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

js_before=0
js_after=0

for js_file in js/*.js; do
    if [ -f "$js_file" ] && [[ ! "$js_file" =~ \.min\.js$ ]]; then
        filename=$(basename "$js_file" .js)
        
        # Tamaño antes
        size_before=$(stat -f%z "$js_file" 2>/dev/null || stat -c%s "$js_file" 2>/dev/null)
        js_before=$((js_before + size_before))
        
        # Minificar
        npx terser "$js_file" --compress --mangle -o "dist/js/${filename}.min.js" 2>/dev/null
        
        if [ -f "dist/js/${filename}.min.js" ]; then
            # Tamaño después
            size_after=$(stat -f%z "dist/js/${filename}.min.js" 2>/dev/null || stat -c%s "dist/js/${filename}.min.js" 2>/dev/null)
            js_after=$((js_after + size_after))
            
            # Calcular reducción
            reduction=$((100 - (size_after * 100 / size_before)))
            
            echo -e "${GREEN}✓${NC} ${filename}.js: $(numfmt --to=iec $size_before) → $(numfmt --to=iec $size_after) (-${reduction}%)"
        fi
    fi
done

# Crear bundle combinado de JS
echo ""
echo -e "${BLUE}📦 Creando bundle combinado...${NC}"

cat dist/js/*.min.js > dist/js/bundle.min.js
bundle_size=$(stat -f%z "dist/js/bundle.min.js" 2>/dev/null || stat -c%s "dist/js/bundle.min.js" 2>/dev/null)
echo -e "${GREEN}✓${NC} bundle.min.js creado: $(numfmt --to=iec $bundle_size)"

# Resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN DE MINIFICACIÓN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $css_before -gt 0 ]; then
    css_reduction=$((100 - (css_after * 100 / css_before)))
    echo -e "CSS:"
    echo -e "  Antes: ${YELLOW}$(numfmt --to=iec $css_before)${NC}"
    echo -e "  Después: ${GREEN}$(numfmt --to=iec $css_after)${NC}"
    echo -e "  Reducción: ${GREEN}-${css_reduction}%${NC}"
fi

echo ""

if [ $js_before -gt 0 ]; then
    js_reduction=$((100 - (js_after * 100 / js_before)))
    echo -e "JavaScript:"
    echo -e "  Antes: ${YELLOW}$(numfmt --to=iec $js_before)${NC}"
    echo -e "  Después: ${GREEN}$(numfmt --to=iec $js_after)${NC}"
    echo -e "  Reducción: ${GREEN}-${js_reduction}%${NC}"
fi

echo ""

total_before=$((css_before + js_before))
total_after=$((css_after + js_after))

if [ $total_before -gt 0 ]; then
    total_reduction=$((100 - (total_after * 100 / total_before)))
    echo -e "Total:"
    echo -e "  Antes: ${YELLOW}$(numfmt --to=iec $total_before)${NC}"
    echo -e "  Después: ${GREEN}$(numfmt --to=iec $total_after)${NC}"
    echo -e "  Reducción: ${GREEN}-${total_reduction}%${NC}"
    echo -e "  Ahorro: ${GREEN}$(numfmt --to=iec $((total_before - total_after)))${NC}"
fi

echo ""
echo -e "${GREEN}✅ Minificación completada!${NC}"
echo ""
echo "📁 Archivos minificados guardados en:"
echo "   - dist/css/*.min.css"
echo "   - dist/js/*.min.js"
echo "   - dist/js/bundle.min.js (todos los JS combinados)"
echo ""
echo "💡 Próximos pasos:"
echo "   1. Actualizar referencias en HTML a archivos .min.css y .min.js"
echo "   2. Considerar usar bundle.min.js para reducir requests HTTP"
echo "   3. Implementar versionado de archivos (cache busting)"
echo ""
