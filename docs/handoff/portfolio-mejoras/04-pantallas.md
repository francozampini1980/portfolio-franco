# 04 · Pantallas

- **Figma, diseño:** https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN · página **Propuesta**. Los estados están en [16:160](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=16-160) y las anotaciones en [17:160](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=17-160).
- **Capturas:** en `assets/figma/`, para comparar.
- **Anchos de referencia:** 390 px (mobile) y 1440 px (desktop). Container de 1152 px (`max-w-6xl`) con 24 px de margen lateral.
- **Fondos:** las secciones alternan `--color-ink` y `--color-ink-2`, como en Figma.
- **Fondo de página:** se mantienen el aura y el grano actuales. [REPO]
- **Orden de lectura:** en mobile es el mismo orden del DOM que en desktop.

---

## 1. Home `/` · [Desktop 19:160](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=19-160) · [Mobile 9:72](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=9-72)
**Capturas:** `01-home-desktop-completa.png`, `02-home-mobile-completa.png`, `11-home-desktop-hero.png`, `12-home-desktop-casos.png`, `13-home-mobile-primera-pantalla.png`.

| # | Sección | Desktop | Mobile | Datos / textos | Origen |
|---|---|---|---|---|---|
| 1 | Header | Componente 6 | Componente 6 | `ui.nav` | [DISEÑO] |
| 2 | Hero [3:123] | 2 columnas: texto a la izquierda (eyebrow, h1 Title/Hero, bajada Body/Large, píldora, 2 botones) y retrato a la derecha (~264 px de ancho, radio 16, borde) | Avatar redondo de 56 px + "Franco Zampini" + eyebrow en una fila; después h1 (Title/Hero Mobile), bajada (Body/Large Mobile), píldora y 2 botones a ancho completo, uno al lado del otro | `home_hero.*` | [DISEÑO] Anot. 1 y 3 · [CONTENT] |
| 3 | Números [3:137] | 4 `Stat` en fila | Grilla 2×2 | `home_hero.stats` | [DISEÑO] Anot. 2 |
| 4 | Logos [8:67] | Etiqueta en `.eyebrow` centrada + 4 `LogoTile` en fila | 2×2 | `ui.home.logos.etiqueta`, `company_logos` | [DISEÑO] Anot. 4 |
| 5 | Casos [4:50] | Eyebrow + h2 a la izquierda, "Ver todos los casos →" a la derecha; 4 `CaseCard` en grilla 2×2 | Encabezado arriba y el enlace debajo; cards apiladas | `ui.home.casos`, `case_studies` publicados | [DISEÑO] Anot. 5 |
| 6 | Lab [5:63] | 2 columnas: texto (eyebrow, h2, párrafo Body/Large, enlace "Ver cómo funcionan →") y `LabSteps` | Texto + chips de pasos | `home_lab` | [DISEÑO] Anot. 6 |
| 7 | Experiencia [5:101] | Encabezado + enlace "Ver trayectoria completa →"; lista de los primeros 4 roles en filas con borde: años (izquierda), empresa en serif y rol (centro), "Equipo de hasta N personas" (derecha) | Empresa, debajo "rol · años · equipo" en una línea que pasa a la siguiente si no entra | `experiences` (4 primeros), `ui.home.experiencia` | [DISEÑO] Anot. 7 |
| 8 | Principios [6:61] | Eyebrow + h2; 4 `InfoCard` en fila con número "01–04" en `.eyebrow`, título y texto; enlace "Ver los principios con ejemplos →" hacia `/sobre` | Lista: número + título, sin texto | `philosophy`, `ui.home.principios` | [DISEÑO] Anot. 8 · P-03 |
| 9 | Cierre [6:83] | Centrado: h2 "Conversemos", párrafo y botón "Escribime" (`/contacto`) | Igual, botón a ancho completo | `contact.title/body`, `ui.home.cierre` | [DISEÑO] [CONTENT] |
| 10 | Footer | Componente 7 | Componente 7 | `ui.footer` | [DISEÑO] |

**Reglas**
- **Años en Experiencia:** se muestra el año de `date_from` y el de `date_to`, o "actualidad". Ejemplos: "2025 — actualidad", "2021 — 2025". [DISEÑO]
- **Equipo en la home:** se muestra sin el punto final de `team_label`. [DISEÑO]
- **Bloque `home_intro`:** no se renderiza (P-02).
- **Logos:** el carrusel actual se reemplaza por tiles estáticos.

**Peor caso**
- Si no hay casos publicados, la sección Casos no se muestra. [REPO]
- Si `stats` viene vacío, no se muestra la fila de números. [SUPUESTO]
- Si el retrato falta, el hero ocupa una sola columna. [REPO]

---

## 2. Caso `/casos/[slug]` (plantilla de los 4) · [Desktop 11:121](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=11-121) · [Mobile 13:140](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=13-140)
**Capturas:** `03-caso-bumeran-desktop.png`, `04-caso-bumeran-mobile.png`, `14-caso-desktop-resumen.png`, `15-caso-mobile-resumen.png`.

**Encabezado [11:137]**, con el container completo (1152) en desktop:
1. "← Todos los casos", hacia `/casos`.
2. Eyebrow: `client_label · {N} min de lectura`.
3. h1 en Title/Page (48/52 desktop, 48/47 mobile), con un ancho máximo de ~720 px.
4. `CaseFacts`.
5. `CaseSummary`.
6. Hasta 3 `Stat` (`stats`) en fila; en mobile no se muestran: decisión de Figma 13:140, donde el resumen ya trae los números. Si `stats` está vacío, no se muestran. [DISEÑO] (P-06)

**Cuerpo [12:140]**
- **Desktop:** 2 columnas. A la izquierda el texto (~720 px). A la derecha `CaseIndex`, sticky desde `lg`.
- **Secciones**, en orden, cada una con `id` para el índice:
  1. El desafío (`#desafio`)
  2. Mi aporte (`#aporte`)
  3. Decisiones clave (`#decisiones`)
  4. Resultados (`#resultados`)
  5. Aprendizajes (`#aprendizajes`)
- **Formato de sección:** título en Heading/Section (36/40 desktop, 30/34 mobile). Cuerpo con `Prose` en Body/Large (24/39) en desktop y 16/26 en mobile.
- **Galería:** si el caso tiene imágenes, va después de Aprendizajes, como hoy (P-11). [REPO]
- **Mobile:** misma estructura sin índice. En mobile se muestra el texto completo del CMS. Figma lo abrevió para la maqueta, pero el texto final es el de Content.

**Final:** `CaseNav` [12:173], seguido del footer.

**Comportamiento**
- **Acceso:**
  - Se quita la verificación de acceso (`hasCaseAccess` y el `redirect` a `/acceso`). Los casos son públicos. [PRODUCTO]
  - Si el caso no existe o no está publicado, la página da 404. [REPO]
- **Metadata:**
  - `title` = título del caso, con el template `%s · Franco Zampini`; `description` = `summary_problem`.
  - `robots: index, follow` (antes `noindex`). [PRODUCTO] [SUPUESTO para la descripción]
- **Caché:** se mantiene `force-dynamic` mientras las imágenes usen URLs firmadas de 1 h (P-11). [REPO]
- **Índice:** el clic hace scroll suave al título (se respeta `prefers-reduced-motion`) y el foco pasa al `h2`.

**Peor caso**
- Caso sin empresa: la ficha muestra 3 campos.
- Caso sin `stats`: no se muestra la fila.
- Sección vacía: no se muestra, ni en el cuerpo ni en el índice.
- Primer caso: sin "anterior". Último caso: sin "siguiente".

---

## 3. Casos `/casos` (listado) · sin frame propio
Se usan los mismos componentes que la home. [SUPUESTO: Figma no tiene frame del listado]

- Encabezado: eyebrow "Trabajo seleccionado", h1 "Casos de liderazgo" y la bajada (`ui.casos_listado`).
- Grilla de 4 `CaseCard`: 2×2 en desktop y apiladas en mobile.
- La metadata sale de `meta.casos`.

---

## 4. Lab `/lab` (página nueva) · [Desktop 14:145](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=14-145) · [Mobile 15:157](https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN?node-id=15-157)
**Captura:** `05-lab-desktop.png`.

1. **Encabezado [14:161]:**
   - Eyebrow "Lab", h1 "Agentes de UX" y bajada en Body/Large (ancho máximo ~760).
   - 3 `InfoCard` "cómo funciona" (`lab_page.how`).
2. **Caso real [14:175]**, con fondo `--color-ink-2`:
   - Eyebrow "Caso real" y h2 "Esta versión del portfolio".
   - 6 `AgentCard` (`lab_page.agents`): 3 columnas en desktop y 1 en mobile.
   - Enlace "Ver la presentación del benchmark →", solo si `link_href` tiene valor (P-05).
3. Footer.

**Más:**
- Sumar `/lab` al menú (componente 6) y a `sitemap.ts`.
- La metadata está pendiente (P-07). Mientras tanto: `title` "Lab" con el template y `description` = `lab_page.subtitle`. [SUPUESTO]

---

## 5. Experiencia `/experiencia` · sin rediseño en Figma
Se aplican los tokens y los textos nuevos. [CONTENT]

- Encabezado y bajada (`ui.experiencia`), con los enlaces "Descargar CV (PDF)" (`/api/cv`, existente) y "Ver LinkedIn".
- Lista de los 6 roles. Cada rol muestra:
  - Empresa, rol y "Mes AAAA - Mes AAAA" (o "- actualidad").
  - `team_label`, si existe.
  - El `body` con `Prose`.
- Metadata: `meta.experiencia`.

## 6. Sobre `/sobre` · sin frame (P-10)
- Encabezado: eyebrow "Filosofía de liderazgo", h1 "Diseñar la experiencia también es diseñar el equipo." y bajada (`about`).
- 4 bloques, uno por principio (`philosophy.items`). Cada bloque tiene:
  - Título en Heading/Section.
  - `about_body` en Body/Large.
  - `example` ("En la práctica: …") en una caja con borde izquierdo de 2 px `--color-violet-500`.
- Se quita la imagen inline y el texto personal del `about.body` actual. [CONTENT v3]
- Metadata: `meta.sobre`.

## 7. Contacto `/contacto` · sin frame (P-10)
- Eyebrow, h1 "Conversemos" y bajada (`contact`).
- Canales: Mail (`mailto:`) y LinkedIn.
- `ContactForm` con todos sus estados (componente 16).
- Metadata: `meta.contacto`.

## 8. Páginas que no cambian
`/acceso`, `/acceso/[token]` y `/admin/*` siguen funcionando. Un link de acceso viejo sigue entrando a `/casos` sin errores, aunque el acceso ya no hace falta (P-12). [SUPUESTO]

## Metadatos globales
- **Root layout:**
  - `title.default` = "Franco Zampini · UX Manager".
  - `title.template` = "%s · Franco Zampini".
  - `description` = `meta.home.description`, también en `openGraph`.
  - **Nota sobre los títulos de página en `copy.json`:** ya incluyen " · Franco Zampini". Con el template, en `generateMetadata` se pasa solo la primera parte ("Casos", "Sobre mí"…), así no se duplica. [CONTENT]
- **Sitemap:** suma `/lab` y `/casos/[slug]` de los casos publicados.
