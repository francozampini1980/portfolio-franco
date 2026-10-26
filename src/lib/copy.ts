import type { Lang } from "@/lib/i18n";
import { metaCopy, uiCopy } from "@/lib/ui-copy";
import { metaCopyEn, uiCopyEn, type MetaCopy, type UiCopy } from "@/lib/ui-copy.en";

export function getUiCopy(lang: Lang): UiCopy {
  return lang === "en" ? uiCopyEn : uiCopy;
}

export function getMetaCopy(lang: Lang): MetaCopy {
  return lang === "en" ? metaCopyEn : metaCopy;
}
