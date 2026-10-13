import type { NextConfig } from "next";

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
  // Los casos son públicos: los enlaces viejos del sistema de accesos (/acceso/<token>)
  // y la pantalla de contraseña llevan directo al listado.
  async redirects() {
    return [{ source: "/acceso/:path*", destination: "/casos", permanent: false }];
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
