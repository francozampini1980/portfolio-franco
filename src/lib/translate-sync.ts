import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lang } from "@/lib/i18n";
import type { SiteContentMap } from "@/lib/types";
import {
  CASE_SPEC,
  CONTENT_SPECS,
  EXPERIENCE_SPEC,
  IMAGE_SPEC,
  collectTexts,
  hashText,
} from "@/lib/translations";

// Textos del sitio que todavía no tienen versión en inglés, y guardado de traducciones.
// Las traducciones se hacen fuera del sitio (scripts/translations.ts) y se guardan acá.

const TARGET: Lang = "en";

/** Todos los textos visibles del sitio, en español. */
async function collectSiteTexts(): Promise<Set<string>> {
  const supabase = createAdminClient();
  const [content, cases, experiences] = await Promise.all([
    supabase.from("site_content").select("key, data"),
    supabase.from("case_studies").select("*").eq("published", true),
    supabase.from("experiences").select("*"),
  ]);
  const caseIds = (cases.data ?? []).map((c) => c.id as string);
  const images = caseIds.length
    ? await supabase.from("case_images").select("alt").in("case_id", caseIds)
    : { data: [] };

  const texts = new Set<string>();
  for (const row of content.data ?? []) {
    const spec = CONTENT_SPECS[row.key as keyof SiteContentMap];
    if (spec) collectTexts(row.data, spec, texts);
  }
  for (const c of cases.data ?? []) collectTexts(c, CASE_SPEC, texts);
  for (const e of experiences.data ?? []) collectTexts(e, EXPERIENCE_SPEC, texts);
  for (const img of images.data ?? []) collectTexts(img, IMAGE_SPEC, texts);
  return texts;
}

async function existingHashes(): Promise<Set<string>> {
  const supabase = createAdminClient();
  const hashes = new Set<string>();
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("translations")
      .select("source_hash")
      .eq("lang", TARGET)
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    for (const row of data ?? []) hashes.add(row.source_hash);
    if (!data || data.length < PAGE) break;
  }
  return hashes;
}

/** Textos en español que se ven en el sitio y no tienen traducción. */
export async function listPendingTexts(): Promise<string[]> {
  const [texts, done] = await Promise.all([collectSiteTexts(), existingHashes()]);
  return [...texts].filter((t) => !done.has(hashText(t)));
}

export async function countPendingTranslations(): Promise<number> {
  return (await listPendingTexts()).length;
}

/** Guarda traducciones (el hash se calcula del texto original). */
export async function saveTranslations(
  rows: { source: string; translated: string }[],
): Promise<number> {
  const clean = rows.filter((r) => r.source && r.translated.trim());
  if (clean.length === 0) return 0;
  const supabase = createAdminClient();
  const { error } = await supabase.from("translations").upsert(
    clean.map((r) => ({
      source_hash: hashText(r.source),
      lang: TARGET,
      source: r.source,
      translated: r.translated,
    })),
  );
  if (error) throw new Error(error.message);
  return clean.length;
}
