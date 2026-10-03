import type { MetadataRoute } from "next";
import { getPublishedCases } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

const SITE = getSiteUrl();

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await getPublishedCases();

  const pages = ["", "/casos", "/lab", "/experiencia", "/sobre", "/contacto"].map(
    (path) => ({
      url: `${SITE}${path}`,
      lastModified: new Date(),
    }),
  );
  const caseUrls = cases.map((c) => ({
    url: `${SITE}/casos/${c.slug}`,
    lastModified: new Date(c.updated_at),
  }));

  return [...pages, ...caseUrls];
}
