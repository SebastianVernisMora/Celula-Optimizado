#!/usr/bin/env python3
"""
Script para actualizar los artículos del blog
Inserta las líneas 6-10 del archivo de respaldo en las líneas 7-11 del archivo destino
y luego inserta la etiqueta <article> completa en la línea 77
"""

import os
import sys

def procesar_archivo(numero_articulo):
    # Rutas de los archivos
    archivo_respaldo = f"/home/sebastianvernis/Descargas/drive-download-20251115T015335Z-1-001/{numero_articulo}.html"
    archivo_destino = f"/home/sebastianvernis/Desktop/Desarrollo/Aplicaciones_Web/Celula/optimized-site/post/post-{numero_articulo}.html"

    # Verificar que existan los archivos
    if not os.path.exists(archivo_respaldo):
        print(f"ERROR: No se encontró el archivo de respaldo: {archivo_respaldo}")
        return

    if not os.path.exists(archivo_destino):
        print(f"ERROR: No se encontró el archivo de destino: {archivo_destino}")
        return

    # Leer las líneas del archivo de respaldo
    with open(archivo_respaldo, 'r', encoding='utf-8') as f:
        lineas_respaldo = f.readlines()

    # Leer las líneas del archivo de destino
    with open(archivo_destino, 'r', encoding='utf-8') as f:
        lineas_destino = f.readlines()

    # Extraer las líneas 6-10 del archivo de respaldo (índices 5-9 en Python)
    if len(lineas_respaldo) < 10:
        print(f"ERROR: El archivo de respaldo tiene menos de 10 líneas: {archivo_respaldo}")
        return

    lineas_a_insertar = lineas_respaldo[5:10]  # Líneas 6-10

    # Insertar las líneas en las posiciones 7-11 del archivo de destino (índices 6-10 en Python)
    # Primero eliminar las líneas actuales en esas posiciones
    del lineas_destino[6:11]  # Eliminar líneas 7-11

    # Luego insertar las nuevas líneas
    for i, linea in enumerate(lineas_a_insertar):
        lineas_destino.insert(6 + i, linea)

    # Ahora encontrar la etiqueta <article> en el archivo de respaldo
    contenido_article = []
    dentro_article = False
    dentro_body = False
    nivel_div = 0

    for linea in lineas_respaldo:
        if '<article>' in linea:
            dentro_article = True
            dentro_body = True
            contenido_article = [linea]
        elif '</article>' in linea and dentro_article:
            contenido_article.append(linea)
            break
        elif dentro_article:
            contenido_article.append(linea)

    # Insertar el contenido de <article> en la línea 77 del archivo destino
    # Ajustar línea 77 (índice 76 en Python) para insertar el contenido
    lineas_destino[77:77] = contenido_article  # Insertar antes de la línea 77

    # Guardar el archivo modificado
    with open(archivo_destino, 'w', encoding='utf-8') as f:
        f.writelines(lineas_destino)

    print(f"Procesado completado para post-{numero_articulo}.html")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Uso: python actualizar_articulos.py <numero_articulo>")
        print("Ejemplo: python actualizar_articulos.py 4")
        sys.exit(1)

    numero = int(sys.argv[1])
    if numero < 4 or numero > 32:  # Excluir 1, 2, 3 que ya están hechos
        print("Usar números de artículo desde 4 hasta 32")
        sys.exit(1)

    procesar_archivo(numero)
