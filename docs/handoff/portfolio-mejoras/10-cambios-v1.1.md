# 10 · Cambios en la versión 1.1 (2026-10-06)

Si ya empezaste a construir con la versión 1.0, esto es lo que se suma. El resto del paquete no cambia.

## 1. Chip de métricas: producción no está actualizada (P-20)
- **Hoy en producción:** `CaseCard.tsx` usa un chip con gradiente violeta → verde al 15% y borde violeta al 25%, y el caso muestra cajas de "Impacto" con el mismo gradiente.
- **Lo correcto** (librería v1.2): fondo `--color-violet-500` al 18%, borde de 1 px `--color-violet-500` al 40%, texto `--color-fg` de 13/20. Pill con un ancho máximo de 304 px y salto de línea.
- **Qué hacer:** crear `MetricChip` y usarlo en todos los lugares donde se muestran métricas.
- **Specs:** 03-componentes.md §2. **Criterio:** CC-05.

## 2. Card de caso con vista previa (Dirección C)
- **Qué es:** el texto va primero, como hoy, y debajo asoma una imagen del caso, recortada por el borde inferior de la card. Si el caso no tiene imagen, la card queda solo con texto.
- **Por qué esta opción:** Fran la eligió entre tres direcciones. Mantiene el título-resultado como lo primero que se lee y la grilla 2×2 de la home. [BENCH H1] [CONTENT]
- **Figma:**
  - Exploración: https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=36-160 (la elegida es la C, nodo 39:172).
  - Librería: Card/Caso v1.3 con la propiedad `Imagen`.
- **Specs:** 03-componentes.md §5. **Criterios:** CC-06 a CC-09.
- **Datos** (06-datos.md):
  - Columna `thumb_path` en `case_studies`.
  - Bucket público `case-thumbs`: hay que pedirle el OK a Fran antes de crearlo (P-22).
- **Admin:** en `CaseEditor`, subir, reemplazar y quitar la imagen, con vista del recorte antes de guardar. Los textos de ayuda están en `copy.json > ui.admin_vista_previa`.
- **Imágenes:** las sube Fran (P-21). Las de Figma son ilustraciones de ejemplo.

## Archivos que cambiaron
- README.md
- 03-componentes.md
- 04-pantallas.md
- 05-contenido/copy.json
- 06-datos.md
- 07-criterios-de-aceptacion.md
- 09-pendientes.md
- este archivo
