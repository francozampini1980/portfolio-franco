import type { MetadataRoute } from "next";
import { getPublishedCases } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import { HIDDEN_PATHS } from "@/lib/features";
import { localizePath } from "@/lib/i18n";

const SITE = getSiteUrl();

export const revalidate = 3600;

/** Una entrada por idioma, cada una con su par en el otro idioma (hreflang). */
function entries(esPath: string, lastModified: Date): MetadataRoute.Sitemap {
  const languages = {
    es: `${SITE}${esPath === "/" ? "" : esPath}`,
    en: `${SITE}${localizePath(esPath, "en")}`,
  };
  return [
    { url: languages.es, lastModified, alternates: { languages } },
    { url: languages.en, lastModified, alternates: { languages } },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await getPublishedCases();

  const pages = ["/", "/casos", "/lab", "/experiencia", "/sobre", "/contacto"]
    .filter((path) => !HIDDEN_PATHS.includes(path))
    .flatMap((path) => entries(path, new Date()));
  const caseUrls = cases.flatMap((c) =>
    entries(`/casos/${c.slug}`, new Date(c.updated_at)),
  );

  return [...pages, ...caseUrls];
}
