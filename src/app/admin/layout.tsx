import type { Metadata } from "next";
import { fontVars } from "@/app/fonts";
import "../globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CMS · Franco Zampini",
  robots: { index: false, follow: false },
};

// Layout raíz propio: el sitio público vive bajo app/[lang] y el admin no tiene idioma.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={fontVars}>
      <body className="min-h-dvh">
        <div className="min-h-dvh bg-ink-2">{children}</div>
      </body>
    </html>
  );
}
