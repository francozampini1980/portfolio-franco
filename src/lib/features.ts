// Secciones que se pueden ocultar del sitio público sin borrar su contenido.
// El CMS las sigue mostrando y editando igual.

/** Lab: página /lab, link del menú, módulo de la home y entrada del sitemap. */
export const LAB_VISIBLE = false;

/** Rutas públicas ocultas; el menú y el sitemap las filtran. */
export const HIDDEN_PATHS: readonly string[] = LAB_VISIBLE ? [] : ["/lab"];
