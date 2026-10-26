// Idiomas del sitio público. El español vive en las URLs de siempre (sin prefijo);
// el inglés, bajo /en con los nombres de sección traducidos. Internamente todo
// se sirve desde app/[lang]/…, con las rutas en español (ver rewrites en next.config.ts).

export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "es";

export function isLang(v: string): v is Lang {
  return (LANGS as readonly string[]).includes(v);
}

/** Sección en español (interna) → segmento público en inglés. */
export const EN_SECTIONS: Record<string, string> = {
  casos: "cases",
  experiencia: "experience",
  sobre: "about",
  contacto: "contact",
  lab: "lab",
};

const ES_SECTIONS: Record<string, string> = Object.fromEntries(
  Object.entries(EN_SECTIONS).map(([es, en]) => [en, es]),
);

/** Rutas que no son páginas del sitio y no se traducen. */
function isExternal(href: string): boolean {
  return (
    !href.startsWith("/") ||
    href.startsWith("//") ||
    href.startsWith("/api/") ||
    href.startsWith("/admin")
  );
}

function splitSuffix(href: string): [string, string] {
  const i = href.search(/[?#]/);
  return i === -1 ? [href, ""] : [href.slice(0, i), href.slice(i)];
}

/**
 * Ruta en español ("/casos/x", "/", "/contacto#form") → ruta pública del idioma.
 * Enlaces externos, mailto, anclas, /api y /admin quedan igual.
 */
export function localizePath(href: string, lang: Lang): string {
  if (lang === "es" || isExternal(href)) return href;
  const [path, suffix] = splitSuffix(href);
  const [first, ...rest] = path.split("/").filter(Boolean);
  if (!first) return `/en${suffix}`;
  const section = EN_SECTIONS[first] ?? first;
  return `/${["en", section, ...rest].join("/")}${suffix}`;
}

/** Ruta pública (en cualquier idioma) → la misma página en el otro idioma. */
export function switchLangPath(pathname: string, to: Lang): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "en") {
    const [, first, ...rest] = parts;
    const esPath = first
      ? `/${[ES_SECTIONS[first] ?? first, ...rest].join("/")}`
      : "/";
    return localizePath(esPath, to);
  }
  return localizePath(pathname || "/", to);
}

/** Idioma de una ruta pública. */
export function langOfPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
}
