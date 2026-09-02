import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const SITE = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/casos", "/experiencia", "/sobre", "/contacto"].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
  }));
}
