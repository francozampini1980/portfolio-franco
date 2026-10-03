# 00 · Brief

## Qué se construye
Una nueva versión de www.francozampini.com.ar sobre el repo actual. El sitio pasa de mostrar a un UX Manager con casos protegidos a mostrar a un líder de diseño, con evidencia en la primera pantalla y casos públicos. [PRODUCTO] [BENCH]

- **Tipo:** sitio funcional, con cambios sobre producción, datos reales en Supabase y deploy en Vercel.
- **Fidelidad:** alta. El diseño está en Figma con estados y peor caso, y la librería v1.2 está publicada. [DISEÑO] [DS]

## Para quién
- Reclutadores.
- Directores y heads de Diseño o UX que evalúan a Fran para un rol de Head o Director de Diseño, en la región o remoto. [PRODUCTO]
- Muchos abren el link desde el celular, en LinkedIn. Por eso mobile no es secundario. [PRODUCTO]

## Objetivo
1. Conseguir una nueva posición: que lo contacten o le pidan una entrevista. [PRODUCTO]
2. Construir marca personal, con más alcance y un posicionamiento claro. [PRODUCTO]

## Métricas de éxito [PRODUCTO]
| Métrica | Cómo se mide | Dónde |
|---|---|---|
| Tasa home → caso | clics en "Ver caso" desde la home / visitas a la home | Evento `case_card_click` + pageviews (08-medicion.md) |
| Clics en contacto | "Escribime", mail y LinkedIn | Eventos `cta_contact_click` y `contact_channel_click` |
| Mensajes enviados | formulario con éxito | Evento `contact_form_submit` (result=success) + tabla `contact_messages` |
| Visitas por página y fuente (UTM) | pageviews por ruta, referrer y UTM | Vercel Web Analytics (automático) |
| Entrevistas obtenidas | registro manual de Fran | Fuera del sitio |

La línea de base es una semana de datos "antes", tomada con Web Analytics midiendo y antes de publicar estos cambios (P-14).

## Alcance

### Incluye
- **Tokens:** contraste AA del texto terciario, eyebrow de 12 px y anillo de foco de 3 px. [DS]
- **Home nueva:**
  - Hero con disponibilidad y 4 números.
  - Logos como tiles.
  - Cards de caso sin candado.
  - Sección Lab.
  - Experiencia con el tamaño de equipo.
  - Principios después de la evidencia.
  - Cierre. [DISEÑO]
- **Casos públicos:**
  - Se quita el control de acceso de `/casos/[slug]`.
  - Las cards sin "Contenido protegido".
  - Los casos se indexan en buscadores. [PRODUCTO]
- **Plantilla de caso:**
  - Ficha (rol, empresa, período, equipo).
  - Resumen (problema, decisión, resultado).
  - Hasta 3 números.
  - 5 secciones con índice lateral.
  - Navegación anterior y siguiente.
  - Tiempo de lectura calculado. [DISEÑO] [CONTENT]
- **Lab:** página nueva `/lab` y link en el menú. [DISEÑO] [BENCH]
- **Experiencia y Sobre:** Experiencia con "Equipo de hasta N personas" y Sobre como filosofía de trabajo con ejemplos. [CONTENT]
- **Contacto:** formulario con los mensajes de error y éxito de Content. [CONTENT]
- **Header y footer:** menú con Lab y CTA "Escribime", menú mobile accesible y footer nuevo. [DISEÑO] [CONTENT]
- **Metadatos:** títulos y descripciones por página. [CONTENT]
- **Admin:** editores para los campos nuevos. [SUPUESTO: sin esto Fran no puede mantener los textos]
- **Medición:** eventos de contacto y navegación a casos. [PRODUCTO]

### No incluye
- Versión en inglés: Research H3, fuera de esta etapa.
- Test de 5 segundos: Research H2.
- Rediseño visual de Sobre y Contacto en Figma. Se construyen con el sistema y los textos finales (P-10).
- Galería de imágenes nueva para los casos. Se mantiene la actual (P-11).
- Borrar el sistema de acceso con contraseña o link. Queda sin uso y no se elimina (P-12).
- Cambios en el CV en PDF y en `cv_profile`.
