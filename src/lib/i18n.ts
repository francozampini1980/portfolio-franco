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

/**
 * Cualquier forma de una ruta → su ruta en español: la pública ("/casos"), la interna
 * del árbol app/[lang] ("/es/casos", "/en/casos") o la pública en inglés ("/en/cases").
 * Las páginas pre-renderizadas ven la ruta interna, por eso hay que aceptar todas.
 */
export function toEsPath(pathname: string): string {
  const [first, second, ...rest] = pathname.split("/").filter(Boolean);
  if (first === "es") return `/${[second, ...rest].filter(Boolean).join("/")}`;
  if (first === "en") {
    if (!second) return "/";
    const section = ES_SECTIONS[second] ?? second;
    return `/${[section, ...rest].join("/")}`;
  }
  return pathname || "/";
}

/** Ruta (pública o interna) → la misma página en el idioma pedido, con su URL pública. */
export function switchLangPath(pathname: string, to: Lang): string {
  return localizePath(toEsPath(pathname), to);
}
