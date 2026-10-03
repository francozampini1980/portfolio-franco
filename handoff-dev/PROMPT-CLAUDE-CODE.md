# Mensaje inicial para Claude Code

Pegar esto en Claude Code, abierto en el repo `portfolio-franco`, con el paquete copiado en `docs/handoff/portfolio-mejoras/`:

---

Vas a construir la nueva versión de mi portfolio (www.francozampini.com.ar) sobre este repo. Todo lo que necesitás está en `docs/handoff/portfolio-mejoras/`.

1. **Leé el paquete completo antes de tocar código**, en este orden: README.md, 00-brief.md, 01-stack.md, 09-pendientes.md, 03-componentes.md, 04-pantallas.md, 06-datos.md, 07-criterios-de-aceptacion.md, 08-medicion.md, 05-contenido/copy.json y 02-tokens/. Mirá las capturas de `assets/figma/`.
2. **Revisá el repo:** AGENTS.md (esta versión de Next.js tiene cambios incompatibles: consultá `node_modules/next/dist/docs/` antes de usar una API), `src/lib/content.ts`, `src/lib/types.ts`, `src/components/site/` y el admin. Respetá las convenciones existentes.
3. **Trabajá en una rama nueva** (`feat/portfolio-mejoras`). Nunca en `main` y sin merge: lo hago yo después de revisar el preview.
4. **Construí en el orden del README:** tokens → datos → componentes → pantallas → admin → medición. Hacé commits chicos por paso.
5. **Base de datos de producción:** antes de aplicar cualquier migración, mostrame el SQL y esperá mi OK. Guardá un respaldo de las filas que se actualizan. No borres filas, tablas ni archivos.
6. **Textos:** usá exactamente los de `copy.json`. No reescribas, no abrevies, no inventes textos. Si falta uno, preguntame.
7. **Pendientes:** no completes por tu cuenta nada de `09-pendientes.md`. Seguí la columna "Mientras tanto". Si un spec no alcanza o hay una contradicción, frená y preguntame.
8. **Seguridad:** nunca escribas claves ni valores de variables de entorno. Las tablas se siguen leyendo solo desde el servidor.
9. **Validación:** al terminar, verificá cada criterio de `07-criterios-de-aceptacion.md` a 390 px y a 1440 px (incluido el teclado), corré `npm run lint` y `npm run build`, y pasame una tabla con criterio · estado · cómo lo verificaste, más el link del preview de Vercel.
