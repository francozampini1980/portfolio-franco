import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  CaseImage,
  CaseStudy,
  CompanyLogo,
  Experience,
  SiteContentMap,
} from "@/lib/types";

const FALLBACK: SiteContentMap = {
  home_hero: {
    eyebrow: "UX MANAGER",
    title: "Franco Zampini",
    subtitle: "Lidero equipos de UX con impacto de negocio.",
    primary_cta_label: "Ver casos",
    primary_cta_href: "/casos",
    secondary_cta_label: "Escribirme",
    secondary_cta_href: "/contacto",
    portrait: "",
  },
  home_intro: { eyebrow: "SOBRE MÍ", title: "", body: "" },
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

export async function getSiteContent<K extends keyof SiteContentMap>(
  key: K,
): Promise<SiteContentMap[K]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_content")
    .select("data")
    .eq("key", key)
    .single();
  return { ...FALLBACK[key], ...(data?.data ?? {}) } as SiteContentMap[K];
}

export async function getAllSiteContent(): Promise<SiteContentMap> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_content").select("key, data");
  const map = { ...FALLBACK };
  for (const row of data ?? []) {
    // @ts-expect-error indexed assignment across the union
    map[row.key] = { ...FALLBACK[row.key as keyof SiteContentMap], ...row.data };
  }
  return map;
}

export async function getPublishedCases(): Promise<CaseStudy[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("case_studies")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });
  return (data as CaseStudy[]) ?? [];
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
  return { study: study as CaseStudy, images: (images as CaseImage[]) ?? [] };
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("order_index", { ascending: true });
  return (data as Experience[]) ?? [];
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
