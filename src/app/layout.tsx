import type { Metadata } from "next";
import { Merriweather, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const serif = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Franco Zampini — UX Manager",
    template: "%s — Franco Zampini",
  },
  description:
    "Portfolio de Franco Zampini. Liderazgo de equipos de UX, toma de decisiones de diseño e impacto de negocio, con más de 10 años de experiencia.",
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: "Franco Zampini — UX Manager",
    description:
      "Liderazgo de equipos de UX, toma de decisiones de diseño e impacto de negocio.",
    url: SITE_URL,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <div className="bg-aurora" aria-hidden />
        <div className="bg-grain" aria-hidden />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
