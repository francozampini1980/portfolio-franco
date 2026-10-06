# 03 · Componentes

Librería en Figma: https://www.figma.com/design/wz5vgHzvFh9pCpZTAkYUE4 (v1.2). Los links a nodos usan `?node-id=`.
Los textos salen de `05-contenido/copy.json`: acá se citan por su ruta, por ejemplo `ui.card_caso.boton`.

Estados que aplican a todos los componentes interactivos:
- **Hover**, descripto en cada componente.
- **Foco visible** con anillo de 3 px `--color-violet-300` por fuera. [DS v1.2]
- **Área táctil** de 44×44 px como mínimo. [NORMA WCAG 2.5.8] [DS]

---

## 1. Button · `ButtonLink` (existe, se ajusta)
- **Figma:** [Button 1:99](https://www.figma.com/design/wz5vgHzvFh9pCpZTAkYUE4?node-id=1-99). Reutiliza `ButtonLink` de `ui.tsx`. [REPO]
- **Anatomía:** pill (`--radius-pill`), padding 12/24, texto Label/Button (14/20, 600).
- **Alto:** 44 px. Hoy es `h-12` (48 px); pasa a `h-11`. [DS]
- **Variantes:**
  - `solid` (Primary): gradiente `from-violet-500 to-green-500`, texto `--color-ink`.
  - `outline` (Secondary): borde `--color-line-strong`, texto `--color-fg`. [DS]
- **Estados:**
  - Default.
  - Hover: Primary baja a opacidad 0.9; Secondary toma fondo `--color-surface`.
  - Focus: anillo de 3 px.
  - Disabled, solo en el submit del formulario: opacidad 0.6 y `cursor-not-allowed`. [REPO]
- **Prop nueva:** `fullWidthOnMobile`. En mobile, los CTA del hero ocupan el ancho disponible. [DISEÑO 9:77]
- **Accesibilidad:** es un `<a>` (Link), con nombre = texto visible.

## 2. Chip/Métrica · `MetricChip` (nuevo; reemplaza el `<span>` dentro de CaseCard)
- **Figma:** [Chip 1:100](https://www.figma.com/design/wz5vgHzvFh9pCpZTAkYUE4?node-id=1-100).
- **Anatomía:**
  - Pill con padding 4/12 y texto Label/Chip (13/20, 400, `--color-fg`).
  - Fondo `--color-violet-500` al 18% y borde de 1 px `--color-violet-500` al 40%. [DS]
- **Ancho máximo:** 304 px. El texto pasa a una segunda línea, nunca se corta con elipsis. [DS v1.2]
- **Contenido:** `highlights[i]` del caso, pasado por `cleanInlineText` (permite `<strong>` y `<em>`). [REPO]
- **Nota:** las capturas de Figma muestran el chip en violeta sólido por un problema de render. Vale el spec de arriba, que es el de la librería (P-17).
- **Producción no está actualizada (v1.1, P-20):** el sitio publicado todavía usa el chip anterior, con gradiente violeta → verde al 15% y borde violeta al 25% (`CaseCard.tsx`), y las cajas de "Impacto" del caso con el mismo gradiente. Hay que reemplazarlos por este `MetricChip` violeta, en la card y en cualquier lugar donde se muestren métricas.

## 3. Stat · `Stat` (nuevo)
- **Figma:** [Stat 1:102](https://www.figma.com/design/wz5vgHzvFh9pCpZTAkYUE4?node-id=1-102).
- **Anatomía:**
  - Caja con padding 24, radio 16, fondo `--color-surface` y borde `--color-line`.
  - Valor en Stat/Value (Merriweather 900, 40/44, `--color-violet-300`).
  - Descripción en Body/Small (14/22, `--color-fg-muted`).
  - Separación de 8 entre valor y descripción.
- **Props:** `value`, `label`.
- **Peor caso:** descripción de 3 o más líneas en una columna de 165 px (mobile). La altura crece, nunca se corta. [DISEÑO 16:160]
- **Uso:** 4 números del hero y hasta 3 números del caso.
- **Accesibilidad:** valor y descripción en el mismo elemento de texto o en una lista, para que se lean juntos. Ejemplo: `<dl><dt>12 años</dt><dd>liderando equipos de UX</dd></dl>`. [SUPUESTO]

## 4. Logo tile · `LogoTile` (nuevo; reemplaza `LogoCarousel` en la home)
- **Figma:** [Logo tile 1:105](https://www.figma.com/design/wz5vgHzvFh9pCpZTAkYUE4?node-id=1-105).
- **Anatomía:**
  - Tile de 160×80 con padding 12, radio 12 y fondo `--color-white` al 90%.
  - Imagen con `object-fit: contain`.
- **Datos:** `company_logos` (name, logo_url).
- **Accesibilidad:** `alt` = name. El link a la web de la empresa no está en el diseño, así que no se agrega. [DISEÑO]
- **Layout:** fila centrada de 4 en desktop; grilla 2×2 en mobile. Sin carrusel ni animación. [DISEÑO 8:67, 9:108]
- `LogoCarousel` queda en el repo sin uso. No se borra (P-12).

## 5. Card de caso · `CaseCard` (existe, se rehace) · v1.3 con vista previa
- **Figma:** [Card/Caso 1:125](https://www.figma.com/design/wz5vgHzvFh9pCpZTAkYUE4?node-id=1-125) (v1.3, propiedad `Imagen`). Exploración elegida: [Dirección C 39:172](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=39-172). Estados en [Estados y peor caso 16:160](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=16-160).
- **Anatomía** (columna sin padding, radio 16, fondo `--color-surface`, borde `--color-line`, `overflow: hidden`):
  - **Contenido** (padding 28, separación 16):
    1. Eyebrow: `client_label · {N} min`, en `.eyebrow`. N sale de `readingTime(caso)`, ver 06-datos.md.
    2. Título, en Heading/Card (Merriweather 900, 20/26). Hasta 3 líneas.
    3. Métricas: `highlights.slice(0, 2)` como `MetricChip`, en fila con salto de línea.
    4. "Ver caso →" (`ui.card_caso.boton`), en `--color-violet-300`.
  - **Vista previa** (solo si el caso tiene `thumb_path`) [DISEÑO Dirección C]:
    - Va debajo del contenido, con 28 px de margen a los costados y pegada al borde inferior de la card.
    - Imagen con radio 12 solo arriba, borde de 1 px `--color-line-strong` (sin borde abajo), `object-fit: cover` y `object-position: top`: se ve la parte de arriba y la de abajo queda recortada por el borde de la card.
    - Alto fijo de 180 px en todos los tamaños (Card/Caso v1.3); el ancho es el de la card menos 56 px.
    - Es decorativa: `alt=""`. El nombre accesible de la card sigue siendo el título [NORMA 1.1.1].
    - `next/image` con `sizes="(min-width: 640px) 512px, 100vw"` y carga diferida, salvo las dos primeras cards de la home.
  - **Sin imagen:** la card queda solo con el contenido, igual que la versión sin vista previa. No hay placeholder vacío.
- **Se quita:** el indicador "🔒 Contenido protegido" y el halo radial decorativo. [PRODUCTO] [DISEÑO]
- **Estados:**
  - Default.
  - Hover: fondo `--color-surface-2`, borde `--color-line-strong`, flecha que se desplaza 4 px y la vista previa sube 8 px (`translateY(-8px)`, 200 ms, sin animación con `prefers-reduced-motion`).
  - Focus: anillo de 3 px sobre toda la card. [DISEÑO]
- **Peor caso:**
  - Título de 3 líneas.
  - 2 métricas largas que pasan a una segunda línea.
  - 1 sola métrica. [DISEÑO 16:160]
  - Con y sin imagen en la misma fila: las cards se alinean arriba (`items-start`), no se estiran para igualar alturas.
  - Imagen vertical o muy chica: `cover` + `object-position: top` la recorta igual; el admin muestra el recorte antes de guardar.
- **Accesibilidad:** toda la card es un único `<Link>`. Nombre accesible = título del caso. "Ver caso" es parte del contenido, no un segundo link. [DISEÑO] [NORMA]

## 6. Header · `SiteNav` (existe, se ajusta)
- **Figma:** [Header 1:145](https://www.figma.com/design/wz5vgHzvFh9pCpZTAkYUE4?node-id=1-145).
- **Desktop:**
  - Alto 72, padding lateral del container.
  - Logo "F/." a la izquierda.
  - A la derecha, 5 links (`ui.nav.links`: Casos, Lab, Experiencia, Sobre, Contacto), en Label/Nav.
  - CTA "Escribime" (`ui.nav.cta`), Button Primary chico, hacia `/contacto`.
  - El link activo se mantiene como hoy. [REPO]
- **Sticky:** con borde inferior `--color-line`. Hoy el borde aparece al hacer scroll; se mantiene. [REPO]
- **Mobile:**
  - Logo y un botón de menú de **44×44** (hoy 36×36), redondo, con borde.
  - `aria-label`: "Abrir menú" o "Cerrar menú" según el estado (`ui.nav.menu_*_aria`); `aria-expanded` y `aria-controls`.
- **Menú abierto** [DISEÑO 16:160, sección Menú mobile abierto]:
  - Panel debajo del header con los 5 links grandes (Heading/Section Mobile) y el botón "Escribime" a ancho completo.
  - El foco queda atrapado en el panel. Esc lo cierra y devuelve el foco al botón.
  - Se cierra al navegar. [REPO]

## 7. Footer · `SiteFooter` (existe, se ajusta)
- **Figma:** Footer de cada pantalla (por ejemplo [6:88](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=6-88)).
- **Contenido:** `ui.footer`.
  - A la izquierda: "Franco Zampini · UX Manager" y debajo el legal.
  - A la derecha: mail (`mailto:`), LinkedIn (externo, `rel="noopener"`) y Casos.
- **Mobile:** todo apilado. [DISEÑO 10:187]

## 8. Píldora de disponibilidad · `AvailabilityPill` (nuevo, sin componente en la librería; P-16)
- **Figma:** Hero [3:123](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=3-123).
- **Anatomía:**
  - Pill con borde de 1 px `--color-violet-500` al 40%, padding 8/16 y texto Body/Small `--color-fg`.
  - Punto de 8 px `--color-green-400` a la izquierda, decorativo (`aria-hidden`).
- **Texto:** `cms.site_content.home_hero.availability`.
- **Mobile:** ocupa el ancho; el texto pasa a dos líneas. [DISEÑO 9:77]

## 9. Ficha del caso · `CaseFacts` (nuevo)
- **Figma:** [Caso/Encabezado 11:137](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=11-137) y mobile [13:145](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=13-145).
- **Anatomía:** `<dl>` con Rol, Empresa, Período y Equipo (`ui.caso.ficha`). Label en `.eyebrow`, valor en Body/Small `--color-fg`.
- **Borde:** superior e inferior `--color-line`.
- **Layout:** 4 columnas en desktop; en mobile, filas con label a la izquierda (ancho fijo de 96) y valor a la derecha.
- **Peor caso:**
  - Si un campo es `null` (por ejemplo la empresa del caso 4), se oculta su par label y valor y las columnas se redistribuyen.
  - Valores largos pasan a dos líneas.

## 10. Resumen del caso · `CaseSummary` (nuevo)
- **Anatomía:** 3 bloques (El problema / Lo que decidí / El resultado; `ui.caso.resumen`).
- **Bloque:** caja con padding 16–20, radio 16, fondo `--color-surface` y borde `--color-line`. Título en `.eyebrow` con color `--color-violet-300`; texto en Body/Small.
- **Layout:** 3 columnas iguales en desktop; apilados en mobile. [DISEÑO 11:137, 13:145]

## 11. Índice del caso · `CaseIndex` (nuevo)
- **Anatomía:**
  - Caja de 160 de ancho con padding 16, radio 16 y borde `--color-line`.
  - Título "En este caso" (`ui.caso.indice.titulo`) en `.eyebrow`.
  - 5 links a las secciones: `#desafio`, `#aporte`, `#decisiones`, `#resultados`, `#aprendizajes`.
- **Comportamiento:**
  - `position: sticky`, `top: 96px`, solo desde `lg` (1024 px). No se muestra en mobile. [DISEÑO 12:140]
  - La sección visible se marca en `--color-violet-300` y con `aria-current="true"`; el resto en `--color-fg-muted`. [SUPUESTO: en Figma está marcada la primera]
  - Si una sección no tiene contenido, no aparece en el índice.
- **Accesibilidad:** `<nav aria-label="En este caso">`.

## 12. Navegación entre casos · `CaseNav` (nuevo)
- **Figma:** [12:173](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=12-173) y mobile [13:187](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=13-187).
- **Anatomía:**
  - 2 tarjetas-link con padding 16–20, radio 16 y borde `--color-line`.
  - Label en `.eyebrow` violeta: "← Caso anterior" a la izquierda y "Caso siguiente →" a la derecha, alineado a la derecha.
  - Título del caso en Heading/Card.
- **Orden:** `order_index` de los casos publicados. En el primero no hay "anterior" y en el último no hay "siguiente": la tarjeta presente ocupa su mitad. [CONTENT: orden 1 → 2 → 3 → 4] [SUPUESTO: sin vuelta circular]
- **Mobile:** las tarjetas se apilan.
- **Hover:** igual que la card de caso.

## 13. Pasos del Lab en la home · `LabSteps` (nuevo)
- **Figma:** Home Lab [5:63](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=5-63) y mobile [10:131](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=10-131).
- **Desktop:**
  - Caja con borde y eyebrow "Caso real: este portfolio".
  - Lista ordenada (`<ol>`) de pasos. Cada paso tiene un círculo numerado de 28 px con borde violeta, el título en Body/Small 600 y la descripción en `--color-fg-subtle`.
- **Mobile:** chips con borde ("1. Producto", "2. Benchmark"…), en fila con salto de línea y sin descripción.
- **Datos:** `cms.site_content.home_lab.steps`.

## 14. Tarjeta de agente · `AgentCard` (nuevo)
- **Figma:** Lab [14:175](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=14-175).
- **Anatomía:**
  - Caja con padding 24, radio 16, fondo `--color-surface` y borde `--color-line`.
  - Fila superior: número ("01") en `.eyebrow` y estado a la derecha.
  - Título en Heading/Card y descripción en Body/Small `--color-fg-muted`.
- **Estado:**
  - "Hecho" en `--color-green-400`.
  - "Próximo" en `--color-fg-muted`; la tarjeta lleva borde `--color-violet-500`.
  - El estado siempre se dice con texto, no solo con color. [NORMA 1.4.1]
- **Layout:** grilla de 3 columnas en desktop y 1 en mobile.

## 15. Tarjeta "cómo funciona" · `InfoCard` (nuevo)
- Caja con borde: título en Heading/Card y texto en Body/Small. 3 columnas en desktop y apiladas en mobile. [DISEÑO 14:161]
- Se reutiliza para los principios de la home (título más texto). [DISEÑO 6:61]

## 16. Formulario de contacto · `ContactForm` (existe, se ajusta)
- **Campos:** Nombre, Correo y Mensaje, con labels visibles (`ui.contacto.form`). Se mantienen el honeypot y el rate limit. [REPO]
- **Validación del lado del cliente**, al enviar y al salir del campo:
  - Vacío: "Completá tu {campo} para poder responderte.", con {campo} = nombre / correo / mensaje.
  - Correo sin formato válido: "Revisá el correo: falta la @ o el dominio."
  - El mensaje va debajo del campo, en `--color-red-400`, enlazado con `aria-describedby`. El campo lleva `aria-invalid="true"` y borde `--color-red-400`.
  - Al enviar con errores, el foco va al primer campo con error. [NORMA 3.3.1, 3.3.3]
- **Estados de envío:**
  - **Enviando:** botón deshabilitado con el texto "Enviando…".
  - **Éxito:** reemplaza el formulario con "¡Gracias! Te respondo en las próximas 48 horas." (P-01). Región `role="status"`.
  - **Error del servidor o de red:** "No se pudo enviar. Probá de nuevo o escribime a francozampini@gmail.com." Arriba del botón, con `role="alert"` y lo escrito conservado.
  - **429:** "Demasiados mensajes seguidos. Probá en un rato." (P-08).
- **Sin diseño en Figma** (P-10): usar los campos actuales con los tokens.

## Componentes que no cambian
`Container`, `Section`, `Eyebrow`, `SectionHeading` y `Prose` se reutilizan. `Eyebrow` hereda la clase `.eyebrow` ajustada.
