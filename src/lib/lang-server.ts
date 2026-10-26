import "server-only";
import { lang as rootLang } from "next/root-params";
import { DEFAULT_LANG, isLang, type Lang } from "@/lib/i18n";
import { getMetaCopy, getUiCopy } from "@/lib/copy";

/** Idioma de la página actual (segmento raíz app/[lang]). */
export async function getLang(): Promise<Lang> {
  const value = await rootLang();
  return value && isLang(value) ? value : DEFAULT_LANG;
}

export async function getCopy() {
  const lang = await getLang();
  return { lang, copy: getUiCopy(lang), meta: getMetaCopy(lang) };
}
