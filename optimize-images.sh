#!/bin/bash

# Script de optimización de imágenes para Grupo Musical La Célula
# Reduce el tamaño de las imágenes sin pérdida significativa de calidad

echo "🖼️  Iniciando optimización de imágenes..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio de imágenes
IMG_DIR="assets/gallery"

# Verificar si existen las herramientas necesarias
command -v jpegoptim >/dev/null 2>&1 || {
    echo -e "${YELLOW}⚠️  jpegoptim no está instalado. Instalando...${NC}"
    sudo apt-get update && sudo apt-get install -y jpegoptim
}

command -v cwebp >/dev/null 2>&1 || {
    echo -e "${YELLOW}⚠️  webp no está instalado. Instalando...${NC}"
    sudo apt-get update && sudo apt-get install -y webp
}

# Crear backup
echo "📦 Creando backup de imágenes originales..."
mkdir -p "${IMG_DIR}_backup"
cp -r "$IMG_DIR"/*.jpg "${IMG_DIR}_backup/" 2>/dev/null || true

# Contador
total_before=0
total_after=0
count=0

echo ""
echo "🔄 Optimizando imágenes JPG..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for img in "$IMG_DIR"/*.jpg; do
    if [ -f "$img" ]; then
        # Obtener tamaño antes
        size_before=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_before=$((total_before + size_before))
        
        # Optimizar JPG (calidad 85, tamaño máximo 300KB)
        jpegoptim --size=300k --strip-all "$img" >/dev/null 2>&1
        
        # Obtener tamaño después
        size_after=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        total_after=$((total_after + size_after))
        
        # Calcular reducción
        reduction=$((100 - (size_after * 100 / size_before)))
        
        # Mostrar progreso
        count=$((count + 1))
        echo -e "${GREEN}✓${NC} $(basename "$img"): $(numfmt --to=iec $size_before) → $(numfmt --to=iec $size_after) (-${reduction}%)"
    fi
done

echo ""
echo "🎨 Convirtiendo a WebP..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

webp_count=0
for img in "$IMG_DIR"/*.jpg; do
    if [ -f "$img" ]; then
        # Convertir a WebP (calidad 85)
        output="${img%.jpg}.webp"
        cwebp -q 85 "$img" -o "$output" >/dev/null 2>&1
        
        if [ -f "$output" ]; then
            webp_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
            jpg_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
            webp_reduction=$((100 - (webp_size * 100 / jpg_size)))
            
            webp_count=$((webp_count + 1))
            echo -e "${GREEN}✓${NC} $(basename "$output"): $(numfmt --to=iec $jpg_size) → $(numfmt --to=iec $webp_size) (-${webp_reduction}%)"
        fi
    fi
done

# Resumen
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN DE OPTIMIZACIÓN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Imágenes JPG optimizadas: ${GREEN}$count${NC}"
echo -e "Imágenes WebP creadas: ${GREEN}$webp_count${NC}"
echo -e "Tamaño total antes: ${YELLOW}$(numfmt --to=iec $total_before)${NC}"
echo -e "Tamaño total después: ${GREEN}$(numfmt --to=iec $total_after)${NC}"

if [ $total_before -gt 0 ]; then
    total_reduction=$((100 - (total_after * 100 / total_before)))
    echo -e "Reducción total: ${GREEN}-${total_reduction}%${NC}"
    echo -e "Espacio ahorrado: ${GREEN}$(numfmt --to=iec $((total_before - total_after)))${NC}"
fi

echo ""
echo -e "${GREEN}✅ Optimización completada!${NC}"
echo ""
echo "💡 Próximos pasos:"
echo "   1. Implementar <picture> tags con WebP + JPG fallback"
echo "   2. Agregar srcset para responsive images"
echo "   3. Verificar que loading='lazy' esté en todas las imágenes"
echo ""
