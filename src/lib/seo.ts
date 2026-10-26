import type { Metadata } from "next";
import { localizePath, type Lang } from "@/lib/i18n";

/** canonical + hreflang de una página, a partir de su ruta en español. */
export function pageAlternates(esPath: string, lang: Lang): Metadata["alternates"] {
  return {
    canonical: localizePath(esPath, lang),
    languages: {
      es: esPath,
      en: localizePath(esPath, "en"),
      "x-default": esPath,
    },
  };
}
