-- v1.1 · Vista previa en la card de caso (Dirección C)
-- 1) Columna: ruta de la imagen en el bucket público `case-thumbs`; null = card sin imagen.
alter table public.case_studies
  add column if not exists thumb_path text;

-- 2) Bucket público (P-22). Solo lectura pública por URL; las escrituras las hace el
--    servidor con la service role (URL firmada de subida). Sin políticas de storage.
--    Límite de 2 MB y solo JPG, PNG o WebP.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'case-thumbs',
  'case-thumbs',
  true,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;
