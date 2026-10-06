/** Bucket público de las vistas previas de las cards (no es sensible: las URLs no vencen). */
export const THUMB_BUCKET = "case-thumbs";

export const THUMB_MAX_BYTES = 2 * 1024 * 1024;
export const THUMB_EXTS = ["png", "jpg", "jpeg", "webp"] as const;

/** Ruta válida dentro del bucket: `{caseId}/{nanoid}.{ext}`. */
export const THUMB_PATH_RE = /^[A-Za-z0-9-]{1,64}\/[A-Za-z0-9_-]{6,32}\.(png|jpe?g|webp)$/;

/** URL pública de una vista previa, o null si el caso no tiene imagen. */
export function thumbUrl(path: string | null | undefined): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!path || !base) return null;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${THUMB_BUCKET}/${path}`;
}
