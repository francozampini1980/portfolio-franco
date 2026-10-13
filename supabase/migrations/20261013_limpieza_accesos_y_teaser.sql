-- Limpieza (2026-10-13): el sistema de accesos y la columna teaser ya no se usan.
-- Respaldo previo: ~/Documents/Desarrollos/backups/limpieza-20261013/ (datos en .json,
-- esquema y funciones en restaurar_esquema.sql). Sin CASCADE: si algo dependiera de estos
-- objetos, la migración falla en vez de borrarlo.

-- Funciones de accesos
drop function if exists public.bump_access_link(uuid);
drop function if exists public.set_access_password(text);
drop function if exists public.verify_access_password(text);

-- Tablas de accesos (access_events referencia a access_links: va primero)
drop table if exists public.access_events;
drop table if exists public.access_links;
drop table if exists public.site_settings;

-- Columna que ninguna pantalla muestra (los 4 casos la tenían vacía)
alter table public.case_studies drop column if exists teaser;
