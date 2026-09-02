import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/casos", "/experiencia", "/sobre", "/contacto"].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
  }));
}
