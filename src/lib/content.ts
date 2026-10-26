import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  CaseImage,
  CaseStudy,
  CompanyLogo,
  Experience,
  SiteContentMap,
} from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import {
  localizeCase,
  localizeContent,
  localizeExperience,
  localizeImage,
} from "@/lib/translations";

const FALLBACK: SiteContentMap = {
  home_hero: {
    eyebrow: "UX MANAGER",
    title: "Franco Zampini",
    subtitle: "Lidero equipos de UX con impacto de negocio.",
    primary_cta_label: "Ver casos",
    primary_cta_href: "/casos",
    secondary_cta_label: "Escribime",
    secondary_cta_href: "/contacto",
    availability: "",
    stats: [],
    portrait: "",
  },
  home_lab: {
    eyebrow: "",
    title: "",
    body: "",
    link_label: "",
    link_href: "/lab",
    card_eyebrow: "",
    steps: [],
  },
  lab_page: {
    eyebrow: "",
    title: "",
    subtitle: "",
    how: [],
    case_eyebrow: "",
    case_title: "",
    agents: [],
    link_label: "",
    link_href: null,
  },
  about: { eyebrow: "ACERCA DE", title: "Filosofía de liderazgo", body: "" },
  philosophy: { eyebrow: "CÓMO LIDERO", title: "Principios", items: [] },
  contact: {
    eyebrow: "CONTACTO",
    title: "Conversemos",
    body: "",
    email: "francozampini@gmail.com",
    linkedin: "https://www.linkedin.com/in/francozampini/",
  },
  cv_profile: {
    name: "Franco Zampini",
    headline: "UX Manager",
    summary: "",
    email: "francozampini@gmail.com",
    linkedin: "https://www.linkedin.com/in/francozampini/",
    location: "Argentina",
    cv_file_url: "",
    cv_file_name: "",
  },
};

// Los getters reciben el idioma opcional: sin `lang` (admin, CV) devuelven el español del CMS.

export async function getSiteContent<K extends keyof SiteContentMap>(
  key: K,
  lang: Lang = "es",
): Promise<SiteContentMap[K]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", key)
    .single();
  const value = { ...FALLBACK[key], ...(data?.data ?? {}) } as SiteContentMap[K];
  return localizeContent(key, value, lang);
}

export async function getAllSiteContent(lang: Lang = "es"): Promise<SiteContentMap> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_content").select("key, data");
  const map = { ...FALLBACK };
  for (const row of data ?? []) {
    // @ts-expect-error indexed assignment across the union
    map[row.key] = { ...FALLBACK[row.key as keyof SiteContentMap], ...row.data };
  }
  if (lang === "es") return map;
  const keys = Object.keys(map) as (keyof SiteContentMap)[];
  const localized = await Promise.all(
    keys.map((k) => localizeContent(k, map[k], lang)),
  );
  return Object.fromEntries(keys.map((k, i) => [k, localized[i]])) as SiteContentMap;
}

export async function getPublishedCases(lang: Lang = "es"): Promise<CaseStudy[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("case_studies")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });
  return Promise.all(((data as CaseStudy[]) ?? []).map((c) => localizeCase(c, lang)));
}

export async function getAllCases(): Promise<CaseStudy[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("case_studies")
    .select("*")
    .order("order_index", { ascending: true });
  return (data as CaseStudy[]) ?? [];
}

export async function getCaseBySlug(
  slug: string,
  lang: Lang = "es",
): Promise<{ study: CaseStudy; images: CaseImage[] } | null> {
  const supabase = createAdminClient();
  const { data: study } = await supabase
    .from("case_studies")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!study) return null;
  const { data: images } = await supabase
    .from("case_images")
    .select("*")
    .eq("case_id", study.id)
    .order("order_index", { ascending: true });
  return {
    study: await localizeCase(study as CaseStudy, lang),
    images: await Promise.all(
      ((images as CaseImage[]) ?? []).map((img) => localizeImage(img, lang)),
    ),
  };
}

export async function getExperiences(lang: Lang = "es"): Promise<Experience[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("order_index", { ascending: true });
  return Promise.all(
    ((data as Experience[]) ?? []).map((e) => localizeExperience(e, lang)),
  );
}

export async function getCompanyLogos(): Promise<CompanyLogo[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("company_logos")
    .select("*")
    .order("order_index", { ascending: true });
  return (data as CompanyLogo[]) ?? [];
}

/** Signed URLs for private case images (1h). */
export async function signImageUrls(paths: string[]): Promise<string[]> {
  if (paths.length === 0) return [];
  const supabase = createAdminClient();
  const { data } = await supabase.storage
    .from("case-images")
    .createSignedUrls(paths, 60 * 60);
  return (data ?? []).map((d) => d.signedUrl ?? "");
}
