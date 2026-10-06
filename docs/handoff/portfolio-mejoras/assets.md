# Assets

## En el sitio, se reutilizan sin cambios
| Recurso | Dónde está | Uso |
|---|---|---|
| Retrato de Fran | `site_content.home_hero.portrait` (URL pública actual) | Hero en desktop (~264 px) y avatar de 56 px en mobile, recortado en círculo con `object-fit: cover` |
| Logos de Despegar, Mercado Pago, Payway y Frávega | tabla `company_logos.logo_url` | `LogoTile` |
| Imágenes de casos | bucket privado `case-images` + tabla `case_images` | Galería del caso (P-11) |
| Favicon e ícono | `src/app/icon.tsx`, `apple-icon.tsx` | Sin cambios |

No hay imágenes nuevas para producción.

## Capturas de Figma (referencia visual, no van al sitio)
Están en `assets/figma/`. Se exportaron de los archivos de Figma el 2026-10-03. En Drive no están: viajan solo en el .zip del paquete.

| Archivo | Qué muestra | Nodo |
|---|---|---|
| 01-home-desktop-completa.png | Home completa, 1440 | 19:160 |
| 02-home-mobile-completa.png | Home completa, 390 | 9:72 |
| 03-caso-bumeran-desktop.png | Caso Búmeran completo, 1440 | 11:121 |
| 04-caso-bumeran-mobile.png | Caso Búmeran completo, 390 | 13:140 |
| 05-lab-desktop.png | Lab, 1440 | 14:145 |
| 06-estados-y-peor-caso.png | Card, botones, Stat y menú mobile | 16:160 |
| 07-anotaciones.png | Las 12 decisiones con su origen | 17:160 |
| 08-ds-foundations.png | Colores y estilos de texto de la librería | DS 1:146 |
| 09-ds-card-caso.png | Card de caso, default y hover | DS 1:125 |
| 10-ds-botones.png | Botones, default, hover y focus | DS 1:99 |
| 11-home-desktop-hero.png | Primera pantalla de la home en desktop | recorte de 19:160 |
| 12-home-desktop-casos.png | Sección Casos en desktop | 4:50 |
| 13-home-mobile-primera-pantalla.png | Primera pantalla de la home en mobile | recorte de 9:72 |
| 14-caso-desktop-resumen.png | Encabezado del caso en desktop | 11:137 |
| 15-caso-mobile-resumen.png | Encabezado del caso en mobile | recorte de 13:140 |
| 16-estados-cards-botones.png | Estados de card y botones | recorte de 16:160 |
| 17-ds-color.png | Paleta de la librería | recorte de DS 1:146 |

Los chips se ven en violeta sólido en estas capturas; el spec correcto está en 03-componentes.md (P-17).

### Agregadas en v1.1 (2026-10-06)
| Archivo | Qué muestra | Nodo |
|---|---|---|
| 18-home-desktop-casos-con-imagen.png | Sección Casos con la card v1.3 y vista previa | 4:50 |
| 19-home-mobile-casos-con-imagen.png | Sección Casos en mobile con vista previa | 10:91 |
| 20-estados-card-con-imagen.png | Card con imagen: default, hover, sin imagen y peor caso | 50:318 |
| 21-exploracion-thumbs-3-direcciones.png | Las 3 direcciones exploradas (elegida: C) | 36:160 |

Las imágenes dentro de las cards son ilustraciones de ejemplo; las reales las sube Fran (P-21).
