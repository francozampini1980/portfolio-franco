# 06 · Datos (Supabase)

- **Proyecto Supabase:** `portfolio-franco`.
- **Esquema relevado** el 2026-10-03, con lectura de solo lectura: tablas en `public`, todas con RLS activo y sin políticas.
- **Acceso:** se lee y escribe solo desde el servidor con la service role (`createAdminClient`). Esto no cambia. [REPO]

> **Seguridad.** No crear políticas públicas ni leer estas tablas desde el navegador. Nunca escribir claves en código o migraciones. Antes de aplicar cualquier cambio en la base de producción, mostrarle el SQL a Fran y esperar su OK.

## 1. Cambios de esquema (migración `supabase/migrations/20261003_portfolio_mejoras.sql`)
El repo hoy no tiene una carpeta de migraciones. Crearla con este archivo, que queda versionado aunque se aplique desde el dashboard o el CLI. [SUPUESTO]

```sql
-- case_studies: ficha, resumen, números y aprendizajes  [DISEÑO 11:137] [CONTENT]
alter table public.case_studies
  add column if not exists summary_role     text not null default '',
  add column if not exists summary_company  text,              -- null = no se muestra (caso 4)
  add column if not exists summary_period   text not null default '',
  add column if not exists summary_team     text not null default '',
  add column if not exists summary_problem  text not null default '',
  add column if not exists summary_decision text not null default '',
  add column if not exists summary_result   text not null default '',
  add column if not exists stats            jsonb not null default '[]'::jsonb, -- [{value,label}] máx. 3
  add column if not exists learnings_title  text not null default 'Aprendizajes',
  add column if not exists learnings_body   text not null default '';

-- experiences: tamaño de equipo  [CONTENT decisión A] [DISEÑO Anot. 7]
alter table public.experiences
  add column if not exists team_label text;
```

**Tipos.** Actualizar `src/lib/types.ts`:
- `CaseStudy`: sumar los campos nuevos, con `stats: { value: string; label: string }[]` y `summary_company: string | null`.
- `Experience`: sumar `team_label: string | null`.

## 2. `site_content` (jsonb por clave)
No cambia el esquema: cambian los tipos en `types.ts` y los `FALLBACK` en `content.ts`.

| Clave | Cambio | Tipo |
|---|---|---|
| `home_hero` | suma `availability: string`, `stats: {value,label}[]`, `portrait_alt?: string` | `HomeHero` |
| `home_lab` | **nueva**: `eyebrow`, `title`, `body`, `link_label`, `link_href`, `card_eyebrow`, `steps: {title,body}[]` | `HomeLab` (nuevo) |
| `lab_page` | **nueva**: `eyebrow`, `title`, `subtitle`, `how: {title,body}[]`, `case_eyebrow`, `case_title`, `agents: {number,title,body,status: "Hecho" \| "Próximo"}[]`, `link_label`, `link_href: string \| null` | `LabPage` (nuevo) |
| `philosophy` | cada item suma `about_body: string` y `example: string` | `PhilosophyBlock` |
| `about` | se reemplazan los valores; misma forma | `RichBlock` |
| `home_intro` | se cargan los valores nuevos, pero no se renderiza (P-02) | `RichBlock` + `link_label` |
| `contact` | se reemplazan `title` y `body`; se mantienen `email` y `linkedin` | `ContactBlock` |

## 3. Carga de datos (migración `supabase/migrations/20261003_portfolio_mejoras_contenido.sql`)
- **Fuente única:** `05-contenido/copy.json > cms`. Generar el SQL desde ese JSON con un script de una sola vez en `scripts/` o a mano. Sin reescribir textos.
- **`case_studies`:** `update ... where slug = '<slug>'` por cada caso, con:
  - `client_label`, `title`, `highlights` y todos los `summary_*`.
  - `stats`.
  - `*_title`.
  - `*_body`, que recibe el valor de `*_body_html`; `learnings_body` recibe el de `learnings_body_html`.
  - Los slugs existen: `metricas-de-experiencia`, `design-system`, `comunicaciones` y `gestion-crisis-equipo-upskill`.
  - `teaser` queda como está. La plantilla nueva no lo usa: el resumen lo reemplaza. [SUPUESTO]
- **`experiences`:** `update` por `order_index` (0–5) de `company`, `role`, `date_from`, `date_to`, `team_label` y `body` (desde `body_html`).
  - Hoy `role` de Payway tiene un doble espacio ("UX  Manager") y el de Despegar dice "UX lead": se corrigen con los valores de `copy.json`.
- **`site_content`:** `upsert` por `key`, con un merge de jsonb (`data = data || '<json>'`) para no perder campos que no están en `copy.json`, como `portrait`, `linkedin` o `cv_profile`.
- **Respaldo:** antes de la carga, guardar una copia de las filas actuales con `select ... ` exportado a un archivo local fuera del repo, por si hay que volver atrás. No borrar filas.

## 4. Reglas de negocio
- **Tiempo de lectura** [CONTENT]:
  - `readingTime(caso) = ceil(palabras / 200)`.
  - Las palabras se cuentan sobre el texto plano, sin HTML, de `challenge_body`, `role_body`, `decisions_body`, `impact_body`, `learnings_body` y los 3 `summary_*` de problema, decisión y resultado.
  - Función pura en `src/lib/reading-time.ts`. El mínimo es 1.
- **Métricas:**
  - En la card se muestran como máximo 2 (`highlights.slice(0,2)`). [DISEÑO]
  - En el caso se muestran como máximo 3 `stats`. [DISEÑO]
- **Orden** de casos y de navegación: `order_index` ascendente, solo los `published = true`. [REPO] [CONTENT]
- **Home:** los 4 primeros `experiences` por `order_index`. [REPO]

## 5. Quién ve y edita qué
| Dato | Lectura pública | Edición |
|---|---|---|
| Contenido del sitio (site_content, case_studies publicados, experiences, company_logos) | Sí, renderizado en el servidor | Solo el admin: Supabase Auth con `ADMIN_EMAIL` en `/admin` [REPO] |
| case_studies no publicados | No (404) | Admin |
| case_images | Sí, con URL firmada de 1 h (bucket privado `case-images`) | Admin |
| contact_messages | No | Inserta `/api/contact`; lee el admin |
| access_links, access_events, site_settings | No | Admin (sin uso nuevo; P-12) |

## 6. Admin (CMS)
Sumar a los editores existentes, con el mismo patrón de UI (`src/components/admin/ui.tsx`):
- **`CaseEditor`:**
  - Campos `summary_*` (texto corto) y `stats` (lista de valor y descripción, máximo 3).
  - `learnings_title` y `learnings_body`, con el editor de texto enriquecido.
- **`ExperienciaEditor`:** `team_label`.
- **`TextosEditor`:**
  - `home_hero.availability` y `home_hero.stats` (4).
  - `home_lab` y `lab_page`.
  - `philosophy.items[].about_body` y `example`.
- **Al guardar:** revalidar `/`, `/casos`, `/casos/[slug]`, `/lab`, `/sobre` y `/experiencia` según corresponda. [REPO]
