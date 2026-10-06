# Handoff a desarrollo · portfolio-mejoras

**Versión 1.1 · 2026-10-06 · Agente de Handoff** (cambios en `10-cambios-v1.1.md`)
**Repositorio:** github.com/francozampini1980/portfolio-franco (Next.js 16 · Tailwind v4 · Supabase · Vercel).
**Destino en el repo:** `docs/handoff/portfolio-mejoras/`.

## Qué es este paquete

Reúne lo que decidieron seis agentes de UX para mejorar www.francozampini.com.ar: Producto, Benchmark, Content, Design System, Diseño y Handoff. Le alcanza a Claude Code para construir los cambios sobre el sitio en producción sin inventar nada.

Se construye un **sitio funcional**: los cambios van sobre el código real, con datos reales en Supabase y deploy en Vercel. No es un prototipo.

Cada spec lleva su origen:

- `[PRODUCTO]`: base de producto.
- `[BENCH]`: benchmark.
- `[CONTENT]`: textos finales.
- `[DS]`: librería franco-zampini.
- `[DISEÑO]`: Figma.
- `[REPO]`: lo que ya existe en el código.
- `[NORMA]`: WCAG 2.2.
- `[SUPUESTO]`: decisión mínima del handoff, hasta que Fran confirme.

Todo lo que no está definido está en `09-pendientes.md`.

## Archivos

| Archivo | Para qué |
|---|---|
| 00-brief.md | Qué se construye, para quién, objetivo, métricas y alcance |
| 01-stack.md | Stack del repo, convenciones a respetar y variables de entorno (solo nombres) |
| 02-tokens/theme.css | Bloque `@theme` listo para `globals.css` (un solo valor cambia) |
| 02-tokens/tokens.json | Referencia completa de la librería: colores, espacios, radios y estilos de texto |
| 03-componentes.md | Componentes: anatomía, props, estados, accesibilidad y nodo de Figma |
| 04-pantallas.md | Pantallas: estructura, mobile y desktop, estados e interacciones |
| 05-contenido/copy.json | **Todos** los textos, con su origen. Ningún texto sale de otro lado |
| 05-contenido/glosario.csv | Términos preferidos y variantes a evitar |
| 06-datos.md | Cambios de esquema en Supabase, carga de datos y permisos |
| 07-criterios-de-aceptacion.md | Criterios verificables (dado / cuando / entonces) con su origen |
| 08-medicion.md | Eventos y propiedades para medir las métricas del brief |
| 09-pendientes.md | Decisiones abiertas, con quién las resuelve y qué hacer mientras tanto |
| assets.md | Imágenes y recursos |
| assets/figma/ | Capturas reales de Figma, para comparar contra lo construido |
| PROMPT-CLAUDE-CODE.md | Mensaje inicial para pegar en Claude Code |
| 10-cambios-v1.1.md | Qué cambió en la versión 1.1 y qué archivos tocar |

## Orden de construcción

1. **Tokens.** Aplicar `02-tokens/theme.css`, la regla de foco y la clase `.eyebrow`.
2. **Datos.** Correr la migración de esquema y la carga de textos (`06-datos.md`). Hay que pedirle confirmación a Fran antes de tocar la base de producción.
3. **Componentes.** Extender los existentes y crear los nuevos (`03-componentes.md`).
4. **Pantallas.** Seguir este orden: Home, Caso (plantilla de los 4), Casos, Lab (nueva), Experiencia, Sobre y Contacto (`04-pantallas.md`).
5. **CMS.** Sumar los campos nuevos a los editores del admin, así Fran puede editarlos después.
6. **Medición.** Instrumentar los eventos de `08-medicion.md`.
7. **Validación.** Revisar contra `07-criterios-de-aceptacion.md` en 390 px y 1440 px, y comparar con `assets/figma/`.

> **Antes del deploy a producción:** Producto pidió una semana de datos "antes" de Web Analytics (P-14). Construir en una rama con preview de Vercel, y mergear a `main` solo con el OK de Fran.

## Cómo usarlo con Claude Code

1. Copiar esta carpeta en `docs/handoff/portfolio-mejoras/` del repo.
2. Abrir Claude Code en el repo y pegar el contenido de `PROMPT-CLAUDE-CODE.md`.
3. Claude Code trabaja en una rama nueva y frena a preguntar cuando un spec no alcanza o cuando toca algo de `09-pendientes.md`.

## Fuentes

- **Figma, diseño:** https://www.figma.com/design/72yC6iJxG47dGYZIaLVqJN (páginas Propuesta, Estados y peor caso, Anotaciones).
- **Figma, librería v1.3:** https://www.figma.com/design/wz5vgHzvFh9pCpZTAkYUE4
- **Drive** (carpeta UX-agentes):
  - producto/portfolio-francozampini
  - benchmarks/2026-10_portfolio-mejoras
  - content/franco-zampini
  - design-system/franco-zampini
  - diseno/2026-10_portfolio-mejoras
  - handoff/2026-10_portfolio-mejoras

Nota de Drive: las capturas de `assets/figma/` viajan solo en el .zip del paquete (entregado en el chat).

## Cambios

- **1.0 (2026-10-03):** primera versión.
- **1.1 (2026-10-06):** vista previa con imagen en la card de caso (Dirección C, librería v1.3) y el chip de métricas, que no fue actualizado en producción (P-20). Detalle en `10-cambios-v1.1.md`.
