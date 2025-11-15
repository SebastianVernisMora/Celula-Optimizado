#!/usr/bin/env python3
"""
Script para generar los archivos de artículos usando una plantilla homogénea
Extrae la información de los archivos del directorio de respaldo
"""
import os
import re
from bs4 import BeautifulSoup

# Directorios
DIRECTORIO_RESPALDO = "/home/sebastianvernis/Descargas/drive-download-20251115T015335Z-1-001"
DIRECTORIO_DESTINO = "/home/sebastianvernis/Desktop/Desarrollo/Aplicaciones_Web/Celula/optimized-site/post"

def extraer_datos_html(archivo_html):
    """Extrae los datos necesarios del archivo HTML"""
    with open(archivo_html, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    soup = BeautifulSoup(contenido, 'html.parser')
    
    # Extraer metadatos
    titulo = soup.find('title').text if soup.find('title') else "Título no encontrado"
    descripcion = ""
    for meta in soup.find_all('meta'):
        if meta.get('name') == 'description':
            descripcion = meta.get('content', '')
            break
    
    # Extraer og:tags
    og_title = ""
    og_description = ""
    og_image = "../assets/gallery/banda-1.jpg"  # Valor por defecto
    og_url = f"post/post-{os.path.basename(archivo_html).replace('.html', '')}.html"
    
    for meta in soup.find_all('meta'):
        if meta.get('property') == 'og:title':
            og_title = meta.get('content', '')
        elif meta.get('property') == 'og:description':
            og_description = meta.get('content', '')
        elif meta.get('property') == 'og:image':
            # Convertir la ruta relativa a ../assets/gallery/
            img_src = meta.get('content', './img/blog/default.jpg')
            if img_src.startswith('./img/blog/'):
                # Extraer nombre del archivo para usar imagen genérica
                img_nombre = os.path.basename(img_src)
                og_image = f"../assets/gallery/banda-{os.path.basename(archivo_html).replace('.html', '')}.jpg"
                # Si la imagen no existe, usar una por defecto
                if not os.path.exists(os.path.join(DIRECTORIO_DESTINO.replace('/post', ''), img_nombre)):
                    # Usar un patrón numérico basado en el número de post
                    post_num = os.path.basename(archivo_html).replace('.html', '')
                    if post_num.isdigit():
                        og_image = f"../assets/gallery/banda-{(int(post_num) % 10) + 1}.jpg"
                    else:
                        og_image = "../assets/gallery/banda-1.jpg"

    # Extraer el contenido del artículo (entre <article> y </article>)
    article_tag = soup.find('article')
    if article_tag:
        contenido_articulo = str(article_tag)
    else:
        # Si no hay article tag, extraer el cuerpo
        body = soup.find('body')
        if body:
            # Remover headers y mantener solo párrafos, títulos, etc.
            for header in body(['header', 'nav', 'script', 'style']):
                header.decompose()
            contenido_articulo = str(body.encode_contents('utf-8').decode('utf-8'))
        else:
            contenido_articulo = "Contenido no encontrado"
    
    # Extraer el primer título h1 como hero title
    h1_tag = soup.find('h1')
    hero_title = h1_tag.text if h1_tag else "Título de Artículo"
    
    # Extraer primer párrafo como subtítulo
    first_p = soup.find('p')
    hero_subtitle = first_p.text[:100] + "..." if first_p and len(first_p.text) > 100 else (first_p.text if first_p else "Descripción del artículo")
    
    # Determinar categoría (intentar inferirla del contenido)
    categoria = "Blog"
    if "evento" in contenido_articulo.lower() or "corporativo" in contenido_articulo.lower():
        categoria = "Eventos"
    elif "música" in contenido_articulo.lower():
        categoria = "Música"
    elif "boda" in contenido_articulo.lower():
        categoria = "Bodas"
    
    # Fecha por defecto (se puede mejorar extrayendo de fechas en el contenido)
    fecha = "14 Nov 2025"
    
    # Imagen por defecto
    image_path = f"../assets/gallery/banda-{os.path.basename(archivo_html).replace('.html', '')}.jpg"
    post_num = os.path.basename(archivo_html).replace('.html', '')
    if post_num.isdigit():
        image_path = f"../assets/gallery/banda-{(int(post_num) % 10) + 1}.jpg"
    
    # Etiquetas por defecto
    etiquetas = '<span class="post-tag" style="display: inline-block; margin: 5px; padding: 5px 15px; background: var(--accent-yellow); color: var(--primary-bg); border-radius: 20px; font-size: 13px;">#música</span>'
    if "evento" in contenido.lower():
        etiquetas += '<span class="post-tag" style="display: inline-block; margin: 5px; padding: 5px 15px; background: var(--accent-yellow); color: var(--primary-bg); border-radius: 20px; font-size: 13px;">#eventos</span>'
    if "boda" in contenido.lower():
        etiquetas += '<span class="post-tag" style="display: inline-block; margin: 5px; padding: 5px 15px; background: var(--accent-yellow); color: var(--primary-bg); border-radius: 20px; font-size: 13px;">#bodas</span>'
    
    return {
        'title': titulo,
        'description': descripcion,
        'og_title': og_title,
        'og_description': og_description,
        'og_image': og_image,
        'og_url': og_url,
        'canonical_url': og_url,
        'hero_title': hero_title,
        'hero_subtitle': hero_subtitle,
        'category': categoria,
        'date': fecha,
        'image_path': image_path,
        'alt_text': hero_title,
        'author_image': f"../assets/gallery/banda-{(int(post_num) % 10) + 1}.jpg" if post_num.isdigit() else "../assets/gallery/banda-1.jpg",
        'author_alt': "Grupo Musical La Célula",
        'reading_time': "8 min de lectura",
        'article_content': contenido_articulo,
        'tags': etiquetas,
        'next_post': f"post-{int(post_num)+1}.html" if post_num.isdigit() else "blog.html"
    }

def generar_articulo(numero_articulo):
    """Genera un archivo de artículo específico"""
    archivo_respaldo = os.path.join(DIRECTORIO_RESPALDO, f"{numero_articulo}.html")
    archivo_destino = os.path.join(DIRECTORIO_DESTINO, f"post-{numero_articulo}.html")
    
    if not os.path.exists(archivo_respaldo):
        print(f"Advertencia: No se encontró el archivo de respaldo: {archivo_respaldo}")
        return
    
    # Extraer datos
    datos = extraer_datos_html(archivo_respaldo)
    
    # Leer plantilla
    with open("plantilla_articulo.html", 'r', encoding='utf-8') as f:
        plantilla = f.read()
    
    # Reemplazar placeholders
    contenido_final = plantilla
    contenido_final = contenido_final.replace('{{TITLE}}', datos['title'])
    contenido_final = contenido_final.replace('{{DESCRIPTION}}', datos['description'])
    contenido_final = contenido_final.replace('{{OG_TITLE}}', datos['og_title'])
    contenido_final = contenido_final.replace('{{OG_DESCRIPTION}}', datos['og_description'])
    contenido_final = contenido_final.replace('{{OG_IMAGE}}', datos['og_image'])
    contenido_final = contenido_final.replace('{{OG_URL}}', datos['og_url'])
    contenido_final = contenido_final.replace('{{CANONICAL_URL}}', datos['canonical_url'])
    contenido_final = contenido_final.replace('{{HERO_TITLE}}', datos['hero_title'])
    contenido_final = contenido_final.replace('{{HERO_SUBTITLE}}', datos['hero_subtitle'])
    contenido_final = contenido_final.replace('{{CATEGORY}}', datos['category'])
    contenido_final = contenido_final.replace('{{DATE}}', datos['date'])
    contenido_final = contenido_final.replace('{{IMAGE_PATH}}', datos['image_path'])
    contenido_final = contenido_final.replace('{{ALT_TEXT}}', datos['alt_text'])
    contenido_final = contenido_final.replace('{{AUTHOR_IMAGE}}', datos['author_image'])
    contenido_final = contenido_final.replace('{{AUTHOR_ALT}}', datos['author_alt'])
    contenido_final = contenido_final.replace('{{READING_TIME}}', datos['reading_time'])
    contenido_final = re.sub(r'\{\{ARTICLE_CONTENT\}\}', datos['article_content'], contenido_final)
    contenido_final = contenido_final.replace('{{TAGS}}', datos['tags'])
    contenido_final = contenido_final.replace('{{NEXT_POST}}', datos['next_post'])
    
    # Guardar archivo final
    with open(archivo_destino, 'w', encoding='utf-8') as f:
        f.write(contenido_final)
    
    print(f"Archivo generado: {archivo_destino}")

def generar_todos():
    """Genera todos los archivos de artículos"""
    for i in range(1, 33):  # Del 1 al 32 (todos los artículos)
        if os.path.exists(os.path.join(DIRECTORIO_RESPALDO, f"{i}.html")):
            generar_articulo(i)
        else:
            print(f"Saltando {i} - archivo no encontrado")

if __name__ == "__main__":
    import sys
    if len(sys.argv) == 1:
        # Generar todos
        generar_todos()
    elif sys.argv[1] == "all":
        generar_todos()
    else:
        # Generar uno específico
        try:
            numero = int(sys.argv[1])
            if 1 <= numero <= 32:
                generar_articulo(numero)
            else:
                print("Número de artículo debe estar entre 1 y 32")
        except ValueError:
            print("Uso: python generar_articulos.py [numero] | all")
            print("Ejemplo: python generar_articulos.py 15")
            print("O: python generar_articulos.py all (para todos)")