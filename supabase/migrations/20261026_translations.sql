-- Versión en inglés del sitio: traducciones del contenido del CMS.
-- El CMS sigue guardando solo el español. Cada texto traducido se guarda con el
-- hash SHA-256 del texto original; si el español cambia, se traduce de nuevo.
-- Mismo criterio que el resto de las tablas: RLS activo y sin políticas
-- (se lee y escribe solo desde el servidor con la service role).

create table public.translations (
  source_hash text not null,
  lang text not null check (lang in ('en')),
  source text not null,
  translated text not null,
  created_at timestamptz not null default now(),
  primary key (source_hash, lang)
);

alter table public.translations enable row level security;

comment on table public.translations is
  'Traducciones del contenido del CMS (clave: sha256 del texto en español + idioma).';
