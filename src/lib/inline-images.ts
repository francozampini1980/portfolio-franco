import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "case-images";

/**
 * Inline images embedded in CMS rich text live in the same private bucket
 * as the gallery. In stored HTML they are kept as `src="inline:<path>"`;
 * a fresh signed URL is swapped in every time the HTML is rendered or
 * loaded back into the editor, so protected content never leaks a
 * permanent public URL.
 */

const SIGNED_URL_RE = /\/storage\/v1\/object\/sign\/case-images\/([^?"'\s]+)/;

/** Editor HTML → stored HTML: signed Supabase URLs become `inline:<path>`. */
export function packInlineImages(html: string): string {
  if (!html) return html;
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    const srcMatch = tag.match(/\ssrc="([^"]*)"/i);
    if (!srcMatch) return tag;
    const src = srcMatch[1];
    let path: string | null = null;
    const signed = src.match(SIGNED_URL_RE);
    if (signed) path = decodeURIComponent(signed[1]);
    else if (src.startsWith("inline:")) path = src.slice("inline:".length);
    if (!path) return tag; // external URL — leave as-is
    return tag.replace(/\ssrc="[^"]*"/i, ` src="inline:${path}"`);
  });
}

/** Stored HTML → rendered HTML: `inline:<path>` becomes a fresh signed URL. */
export async function signInlineImages(html: string): Promise<string> {
  if (!html || !html.includes("inline:")) return html;

  const paths = new Set<string>();
  for (const m of html.matchAll(/src="inline:([^"]+)"/gi)) paths.add(m[1]);
  if (paths.size === 0) return html;

  const list = [...paths];
  const supabase = createAdminClient();
  const { data } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(list, 60 * 60);

  const map = new Map<string, string>();
  (data ?? []).forEach((d, i) => {
    if (d.signedUrl) map.set(list[i], d.signedUrl);
  });

  return html.replace(/src="inline:([^"]+)"/gi, (whole, p: string) => {
    const url = map.get(p);
    return url ? `src="${url}"` : whole;
  });
}

/** Convenience: sign every string field named `body` (or the given keys). */
export async function signBodies<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[],
): Promise<T> {
  const out = { ...obj };
  for (const k of keys) {
    if (typeof out[k] === "string") {
      out[k] = (await signInlineImages(out[k] as string)) as T[keyof T];
    }
  }
  return out;
}
