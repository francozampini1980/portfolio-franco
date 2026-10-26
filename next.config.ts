import type { NextConfig } from "next";
import { EN_SECTIONS } from "./src/lib/i18n";

// Hostname del Storage público de Supabase (bucket `case-thumbs`), tomado de la
// variable de entorno para no escribir el valor en el repo.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    // 404 de rutas inexistentes: el layout raíz está bajo app/[lang].
    globalNotFound: true,
  },
  // Los casos son públicos: los enlaces viejos del sistema de accesos (/acceso/<token>)
  // y la pantalla de contraseña llevan directo al listado.
  async redirects() {
    return [
      { source: "/acceso/:path*", destination: "/casos", permanent: false },
      // Rutas internas del árbol app/[lang]: nunca se publican con /es ni con secciones en español bajo /en.
      { source: "/es", destination: "/", permanent: true },
      { source: "/es/:path*", destination: "/:path*", permanent: true },
      ...Object.entries(EN_SECTIONS)
        .filter(([es, en]) => es !== en)
        .map(([es, en]) => ({
          source: `/en/${es}/:path*`,
          destination: `/en/${en}/:path*`,
          permanent: true,
        })),
    ];
  },
  // El sitio vive en app/[lang]/… con rutas en español. El español se publica sin
  // prefijo y el inglés bajo /en con las secciones traducidas.
  async rewrites() {
    const es = ["", ...Object.keys(EN_SECTIONS)];
    return {
      beforeFiles: [
        ...es.map((section) => ({
          source: section ? `/${section}/:path*` : "/",
          destination: section ? `/es/${section}/:path*` : "/es",
        })),
        ...Object.entries(EN_SECTIONS).map(([esSection, en]) => ({
          source: `/en/${en}/:path*`,
          destination: `/en/${esSection}/:path*`,
        })),
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/case-thumbs/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
