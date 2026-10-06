# 01 · Stack

Es un repo existente: se respeta su stack y sus convenciones, sin migraciones de framework. [REPO]

| Capa | Hoy en el repo | Uso en este proyecto |
|---|---|---|
| Framework | Next.js 16.3 (App Router), React 19, TypeScript | Igual. **Leer `AGENTS.md`**: esta versión de Next tiene cambios incompatibles; consultar `node_modules/next/dist/docs/` antes de usar una API. El middleware se llama `src/proxy.ts`. |
| Estilos | Tailwind CSS v4 con `@theme` en `src/app/globals.css` | Tokens en `02-tokens/theme.css` (mismos nombres) |
| Fuentes | `next/font`: Merriweather (400/700/900) y Plus Jakarta Sans (400–800) | Igual |
| Datos | Supabase (Postgres con RLS activo; acceso solo desde el servidor con `createAdminClient`) | Columnas nuevas y carga de textos (06-datos.md) |
| CMS | `/admin` propio (Supabase Auth, editores con Tiptap) | Sumar los campos nuevos |
| Validación | Zod | Formulario de contacto |
| Mail | Resend | Igual |
| Analítica | `@vercel/analytics` (`<Analytics />`), GA4 y Microsoft Clarity en `src/app/layout.tsx` | Eventos con `track()` de `@vercel/analytics` (08-medicion.md) |
| Hosting | Vercel, proyecto `portfolio-franco`, deploy desde `main` | Trabajar en una rama con preview; merge con el OK de Fran |

## Convenciones del repo a respetar
- **Componentes:**
  - Del sitio, en `src/components/site/`.
  - Del admin, en `src/components/admin/`.
  - Primitivas (`Container`, `Section`, `Eyebrow`, `SectionHeading`, `ButtonLink`, `Prose`) en `src/components/site/ui.tsx`.
- **Contenido:**
  - Datos editables, en Supabase. Se leen con `src/lib/content.ts`, que tiene `FALLBACK` por clave.
  - Tipos, en `src/lib/types.ts`.
- **HTML del CMS:** siempre pasa por `cleanRichText` / `cleanInlineText` (`src/lib/sanitize.ts`).
- **Páginas públicas:** `revalidate = 3600`, y el admin revalida al guardar. Las páginas de caso hoy son `force-dynamic`: firman URLs de imágenes privadas.
- **Clases:** se combinan con `cn()` (`src/lib/cn.ts`, clsx + tailwind-merge).
- **Textos de interfaz que no edita el CMS** (labels, mensajes): crear `src/lib/ui-copy.ts` con los valores de `05-contenido/copy.json > ui`. No escribir strings sueltos en los componentes. [SUPUESTO]

## Variables de entorno (solo nombres; ya existen en Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`, `ADMIN_EMAIL`, `ACCESS_COOKIE_SECRET`
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`

No hace falta ninguna variable nueva. Nunca escribir sus valores en el código ni en este paquete.

## Verificación técnica
- `npm run lint` y `npm run build` sin errores.
- Revisar en el preview de Vercel, a 390 px y a 1440 px.
