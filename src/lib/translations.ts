import "server-only";
import { createHash } from "node:crypto";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lang } from "@/lib/i18n";
import type {
  CaseImage,
  CaseStudy,
  Experience,
  SiteContentMap,
} from "@/lib/types";

// Traducciones del contenido del CMS. El CMS guarda solo el español; cada texto
// traducido se guarda en la tabla `translations` con el hash del texto original.
// Si el español cambia, cambia el hash: el texto se muestra en español hasta que
// se traduce de nuevo (lo hace syncTranslations al guardar en el admin).

/** Qué campos se traducen. `true` = string o string[]; objeto = array de objetos o sub-objeto. */
type Spec = { readonly [key: string]: true | Spec };

const STAT: Spec = { value: true, label: true };

export const CONTENT_SPECS: { [K in keyof SiteContentMap]: Spec } = {
  home_hero: {
    eyebrow: true,
    title: true,
    subtitle: true,
    primary_cta_label: true,
    secondary_cta_label: true,
    availability: true,
    portrait_alt: true,
    stats: STAT,
  },
  home_lab: {
    eyebrow: true,
    title: true,
    body: true,
    link_label: true,
    card_eyebrow: true,
    steps: { title: true, body: true },
  },
  lab_page: {
    eyebrow: true,
    title: true,
    subtitle: true,
    how: { title: true, body: true },
    case_eyebrow: true,
    case_title: true,
    agents: { title: true, body: true },
    link_label: true,
  },
  about: { eyebrow: true, title: true, body: true },
  philosophy: {
    eyebrow: true,
    title: true,
    items: { title: true, body: true, about_body: true, example: true },
  },
  contact: { eyebrow: true, title: true, body: true },
  // El CV en PDF es el mismo en los dos idiomas.
  cv_profile: {},
};

export const CASE_SPEC: Spec = {
  title: true,
  client_label: true,
  highlights: true,
  challenge_title: true,
  challenge_body: true,
  role_title: true,
  role_body: true,
  decisions_title: true,
  decisions_body: true,
  impact_title: true,
  impact_body: true,
  learnings_title: true,
  learnings_body: true,
  summary_role: true,
  summary_company: true,
  summary_period: true,
  summary_team: true,
  summary_problem: true,
  summary_decision: true,
  summary_result: true,
  stats: STAT,
};

export const EXPERIENCE_SPEC: Spec = {
  date_from: true,
  date_to: true,
  role: true,
  team_label: true,
  body: true,
};

export const IMAGE_SPEC: Spec = { alt: true };

/** Solo se traducen textos con letras (no "12", "+40%", vacíos). */
export function isTranslatable(text: unknown): text is string {
  return typeof text === "string" && /\p{L}{2,}/u.test(text);
}

export function hashText(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/** Todos los textos traducibles de `value` según `spec`. */
export function collectTexts(value: unknown, spec: Spec, out: Set<string>): void {
  if (!value || typeof value !== "object") return;
  const obj = value as Record<string, unknown>;
  for (const [key, sub] of Object.entries(spec)) {
    const v = obj[key];
    if (sub === true) {
      if (Array.isArray(v)) v.forEach((s) => isTranslatable(s) && out.add(s));
      else if (isTranslatable(v)) out.add(v);
    } else if (Array.isArray(v)) {
      v.forEach((item) => collectTexts(item, sub, out));
    } else {
      collectTexts(v, sub, out);
    }
  }
}

function applyTexts<T>(value: T, spec: Spec, dict: Map<string, string>): T {
  if (!value || typeof value !== "object") return value;
  const tr = (s: unknown) =>
    isTranslatable(s) ? (dict.get(hashText(s)) ?? s) : s;
  const copy: Record<string, unknown> = { ...(value as Record<string, unknown>) };
  for (const [key, sub] of Object.entries(spec)) {
    const v = copy[key];
    if (sub === true) {
      copy[key] = Array.isArray(v) ? v.map(tr) : tr(v);
    } else if (Array.isArray(v)) {
      copy[key] = v.map((item) => applyTexts(item, sub, dict));
    } else {
      copy[key] = applyTexts(v, sub, dict);
    }
  }
  return copy as T;
}

/** Diccionario hash → texto traducido, una vez por render. */
const loadDictionary = cache(async (lang: Lang): Promise<Map<string, string>> => {
  const supabase = createAdminClient();
  const dict = new Map<string, string>();
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("translations")
      .select("source_hash, translated")
      .eq("lang", lang)
      .range(from, from + PAGE - 1);
    // Sin tabla o con error: el sitio en inglés se ve con el contenido en español.
    if (error || !data) break;
    for (const row of data) dict.set(row.source_hash, row.translated);
    if (data.length < PAGE) break;
  }
  return dict;
});

async function localize<T>(value: T, spec: Spec, lang: Lang): Promise<T> {
  if (lang === "es") return value;
  return applyTexts(value, spec, await loadDictionary(lang));
}

export function localizeContent<K extends keyof SiteContentMap>(
  key: K,
  value: SiteContentMap[K],
  lang: Lang,
): Promise<SiteContentMap[K]> {
  return localize(value, CONTENT_SPECS[key], lang);
}

export function localizeCase(study: CaseStudy, lang: Lang): Promise<CaseStudy> {
  return localize(study, CASE_SPEC, lang);
}

export function localizeExperience(e: Experience, lang: Lang): Promise<Experience> {
  return localize(e, EXPERIENCE_SPEC, lang);
}

export function localizeImage(img: CaseImage, lang: Lang): Promise<CaseImage> {
  return localize(img, IMAGE_SPEC, lang);
}
