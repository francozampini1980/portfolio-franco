"use client";

import Link from "next/link";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { DEFAULT_LANG, localizePath, type Lang } from "@/lib/i18n";
import { getUiCopy } from "@/lib/copy";

const LangContext = createContext<Lang>(DEFAULT_LANG);

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): Lang {
  return useContext(LangContext);
}

export function useUiCopy() {
  return getUiCopy(useLang());
}

/** Convierte una ruta en español a la del idioma actual (deja igual externos, anclas y /api). */
export function useLocalizedHref<T>(href: T): T {
  const lang = useLang();
  return (typeof href === "string" ? localizePath(href, lang) : href) as T;
}

/** next/link con la ruta traducida al idioma actual. */
export function LocalizedLink({ href, ...props }: ComponentProps<typeof Link>) {
  return <Link href={useLocalizedHref(href)} {...props} />;
}
