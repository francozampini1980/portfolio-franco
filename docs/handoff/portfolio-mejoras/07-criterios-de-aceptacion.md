# 07 · Criterios de aceptación

Formato: dado / cuando / entonces · [origen].

**Cómo verificar:**
- Probar en el preview de Vercel, a 390 px y a 1440 px.
- Teclado: Tab, Shift+Tab, Enter y Esc.
- Comparar con las capturas de `assets/figma/`.

## Global
- **G-01.** Dado cualquier texto visible, cuando se busca en el código o en la base, entonces sale de `copy.json` (vía `ui-copy.ts` o la carga en Supabase), sin variaciones. [CONTENT]
- **G-02.** Dado el `@theme` de `globals.css`, entonces es igual a `02-tokens/theme.css`, y los componentes no usan colores hex sueltos. [DS]
- **G-03.** Dado un texto `--color-fg-subtle` sobre `--color-ink`, entonces el contraste es de al menos 4.5:1. Lo mismo vale para el resto de los textos con sus fondos: AA. [NORMA 1.4.3] [DS]
- **G-04.** Dado cualquier link, botón o campo, cuando recibe foco con teclado, entonces muestra un anillo de 3 px `--color-violet-300` visible y no recortado. [DS v1.2] [NORMA 2.4.7]
- **G-05.** Dado cualquier control interactivo en mobile, entonces su área táctil es de al menos 44×44 px. [DS] [NORMA 2.5.8]
- **G-06.** Dado un ancho de 390 px, entonces no hay scroll horizontal en ninguna página. [DISEÑO]
- **G-07.** Dado `.eyebrow`, entonces mide 12 px como mínimo, con peso 700, tracking de 2.5 px y mayúsculas. [DS]
- **G-08.** Dado el sistema operativo con "reducir movimiento", entonces no hay scroll suave ni desplazamientos animados. [NORMA 2.3.3] [REPO]
- **G-09.** Dado `npm run lint` y `npm run build`, entonces terminan sin errores. [REPO]

## Header y footer
- **H-01.** Dado desktop, entonces el header muestra el logo, los 5 links (Casos, Lab, Experiencia, Sobre, Contacto) y el botón "Escribime", que lleva a `/contacto`. [DISEÑO] [CONTENT]
- **H-02.** Dado mobile, cuando se toca el botón de menú (44×44, "Abrir menú"), entonces:
  - Se abre el panel con los 5 links y "Escribime".
  - El botón pasa a "Cerrar menú" con `aria-expanded="true"`.
  - El foco queda dentro del panel. [DISEÑO 16:160]
- **H-03.** Dado el menú abierto, cuando se presiona Esc o se navega, entonces el menú se cierra y el foco vuelve al botón (si fue con Esc). [DISEÑO]
- **H-04.** Dado el footer, entonces muestra "Franco Zampini · UX Manager", el mail (mailto), LinkedIn, Casos y el legal "© 2026 Franco Zampini. Hecho con Next.js." [CONTENT]

## Home
- **HO-01.** Dado 1440 px, cuando carga la home, entonces la primera pantalla (900 px de alto) muestra:
  - El eyebrow, el titular, la bajada y la píldora de disponibilidad.
  - Los botones "Ver casos" y "Escribime".
  - Los 4 números. [DISEÑO Anot. 1 y 2] [BENCH]
- **HO-02.** Dado 390 px, cuando carga la home, entonces el titular completo y la píldora entran en la primera pantalla (844 px), con el avatar de 56 px al lado del nombre. [DISEÑO Anot. 3]
- **HO-03.** Dado el hero, entonces los textos son exactamente los de `home_hero` y los 4 números son los de `home_hero.stats`. [CONTENT]
- **HO-04.** Dado la sección de logos, entonces hay 4 tiles con fondo claro y un `alt` con el nombre de la empresa: 4 en fila en desktop, 2×2 en mobile y sin animación. [DISEÑO Anot. 4]
- **HO-05.** Dado la sección Casos, entonces se ven las 4 cards en el orden de `order_index`, sin "Contenido protegido", y cada una con un máximo de 2 métricas. [PRODUCTO] [DISEÑO Anot. 5]
- **HO-06.** Dado la sección Lab, entonces se ve el texto de `home_lab`, el enlace "Ver cómo funcionan" hacia `/lab` y los pasos de `home_lab.steps`: lista numerada en desktop, chips en mobile. [DISEÑO Anot. 6]
- **HO-07.** Dado la sección Experiencia, entonces se ven 4 roles. Cada uno muestra los años ("2025 — actualidad"), la empresa, el rol y "Equipo de hasta N personas". [DISEÑO Anot. 7] [CONTENT]
- **HO-08.** Dado la sección Principios, entonces aparece después de Experiencia, con los 4 principios y un enlace a `/sobre`. [BENCH H2] [DISEÑO Anot. 8]
- **HO-09.** Dado el cierre, entonces se ve "Conversemos", el texto de `contact.body` y el botón "Escribime", que lleva a `/contacto`. [CONTENT]
- **HO-10.** Dado la home, entonces el bloque "De diseñar flujos a diseñar equipos" no se muestra (P-02). [SUPUESTO]

## Card de caso
- **CC-01.** Dado una card, cuando se hace clic en cualquier parte, entonces navega a `/casos/[slug]`. Es un solo link, con nombre accesible = título. [DISEÑO] [NORMA 2.4.4]
- **CC-02.** Dado una card, entonces el eyebrow dice `client_label · {N} min`, con N = `ceil(palabras/200)`. [CONTENT]
- **CC-03.** Dado hover o foco, entonces el fondo pasa a `--color-surface-2` y el borde a `--color-line-strong`. [DISEÑO 16:160]
- **CC-04.** Dado un título de 3 líneas y 2 métricas largas, entonces el texto no se corta y los chips pasan a una segunda línea sin salir de la card (ancho máximo del chip: 304 px). [DS v1.2] [DISEÑO 16:160]
- **CC-05.** Dado cualquier métrica de un caso (card o caso), entonces el chip tiene fondo `--color-violet-500` al 18% y borde `--color-violet-500` al 40%, sin el gradiente violeta → verde de producción. [DS v1.2] (P-20)
- **CC-06.** Dado un caso con `thumb_path`, entonces la card muestra la vista previa debajo del contenido, con 28 px de margen lateral, pegada al borde inferior, recortada desde arriba (`object-position: top`) y con `alt=""`. [DISEÑO Dirección C] [NORMA 1.1.1]
- **CC-07.** Dado un caso sin `thumb_path`, entonces la card se ve solo con texto, sin espacio vacío ni placeholder. [DISEÑO]
- **CC-08.** Dado hover o foco en una card con imagen, entonces la vista previa sube 8 px; con "reducir movimiento" no se mueve. [DISEÑO] [NORMA 2.3.3]
- **CC-09.** Dado el admin, cuando Fran sube una imagen de vista previa, entonces ve el recorte en desktop y mobile antes de guardar y la card de la home la muestra tras la revalidación. [SUPUESTO]

## Caso
- **CA-01.** Dado un visitante sin cookie de acceso, cuando abre `/casos/design-system`, entonces ve el caso completo, sin redirección a `/acceso`. [PRODUCTO]
- **CA-02.** Dado un caso, entonces el encabezado muestra, en este orden:
  1. "← Todos los casos".
  2. El eyebrow con "{N} min de lectura".
  3. El título.
  4. La ficha (Rol, Empresa, Período, Equipo).
  5. El resumen (El problema, Lo que decidí, El resultado).
  6. En desktop, los números si existen. [DISEÑO 11:137] [CONTENT]
- **CA-03.** Dado el caso "Sostener el discovery con un equipo más chico", entonces la ficha no muestra Empresa ni deja un hueco. [CONTENT V-09]
- **CA-04.** Dado un caso con `stats` vacío, entonces no se muestra la fila de números. [SUPUESTO] (P-06)
- **CA-05.** Dado desktop (≥1024 px), cuando se hace scroll, entonces el índice "En este caso" queda fijo y marca la sección visible. Cuando se hace clic en un ítem, el contenido va a esa sección y el foco pasa a su título. [DISEÑO Anot. 10]
- **CA-06.** Dado mobile, entonces no hay índice y el texto de cada sección es el completo del CMS. [DISEÑO] [CONTENT]
- **CA-07.** Dado el caso 2 (Búmeran), entonces al final se ve "Caso anterior · La voz del cliente como criterio de priorización" y "Caso siguiente · Mails que explican el envío y bajan los llamados". [CONTENT]
- **CA-08.** Dado el primer caso, entonces solo se muestra "Caso siguiente"; en el último, solo "Caso anterior". [SUPUESTO]
- **CA-09.** Dado el HTML de un caso, entonces `robots` permite indexar y el caso está en `sitemap.xml`. [PRODUCTO]
- **CA-10.** Dado un slug inexistente o un caso no publicado, entonces la respuesta es 404. [REPO]

## Lab
- **LA-01.** Dado `/lab`, entonces se ve el encabezado, las 3 tarjetas "cómo funciona" y las 6 tarjetas de agentes. Cada tarjeta de agente lleva número, título, descripción y estado en texto ("Hecho" o "Próximo"). [DISEÑO 14:145] [NORMA 1.4.1]
- **LA-02.** Dado `lab_page.link_href` vacío, entonces el enlace a la presentación no se muestra. [CONTENT] (P-05)
- **LA-03.** Dado el menú, entonces "Lab" lleva a `/lab` y se marca como activo en esa página. [DISEÑO]

## Experiencia, Sobre, Contacto
- **EX-01.** Dado `/experiencia`, entonces se ven los 6 roles con fechas, `team_label` cuando existe y los enlaces "Descargar CV (PDF)" y "Ver LinkedIn". [CONTENT]
- **SO-01.** Dado `/sobre`, entonces se ve el título "Diseñar la experiencia también es diseñar el equipo." y 4 principios, cada uno con su "En la práctica", sin historia personal ni la imagen anterior. [CONTENT v3]
- **CO-01.** Dado el formulario, cuando se envía con un campo vacío, entonces debajo del campo aparece "Completá tu {nombre|correo|mensaje} para poder responderte.", el campo tiene `aria-invalid` y el foco va al primer error. [CONTENT] [NORMA 3.3.1]
- **CO-02.** Dado un correo sin @ o sin dominio, cuando se envía, entonces aparece "Revisá el correo: falta la @ o el dominio." [CONTENT]
- **CO-03.** Dado un envío correcto, entonces el formulario se reemplaza por "¡Gracias! Te respondo en las próximas 48 horas." en una región `role="status"`. [CONTENT] (P-01)
- **CO-04.** Dado un error de servidor o de red, entonces aparece "No se pudo enviar. Probá de nuevo o escribime a francozampini@gmail.com." y se conserva lo escrito. [CONTENT]
- **CO-05.** Dado el honeypot completo o 3 envíos en 10 minutos, entonces se mantiene el comportamiento actual. [REPO]

## Metadatos
- **ME-01.** Dado cada página, entonces `<title>` y `description` son los de `copy.json > meta`, sin duplicar " · Franco Zampini". [CONTENT]

## Medición
- **MD-01.** Dado cada evento de `08-medicion.md`, cuando ocurre la acción, entonces se registra en Vercel (si el plan lo permite) y en GA4, con las propiedades definidas y sin datos personales. Se verifica con la pestaña Network o con el modo debug de GA4. [PRODUCTO]
- **MD-02.** Dado un clic en una card de la home, entonces se registra `case_card_click` con `origin=home`. [PRODUCTO]

## Datos y CMS
- **DA-01.** Dado la migración aplicada, entonces las columnas nuevas existen y las filas actuales conservan sus datos, incluidas las imágenes, `portrait` y `cv_profile`. [SUPUESTO]
- **DA-02.** Dado el admin, cuando Fran edita un campo nuevo (por ejemplo `availability`) y guarda, entonces el cambio se ve en el sitio tras la revalidación. [SUPUESTO]
