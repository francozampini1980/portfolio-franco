import type { Metadata } from "next";
import Link from "next/link";
import { fontVars } from "@/app/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 · Franco Zampini",
  robots: { index: false, follow: false },
};

// Rutas que no existen en ningún idioma (el layout raíz vive bajo app/[lang]).
export default function GlobalNotFound() {
  return (
    <html lang="es" className={fontVars}>
      <body className="min-h-dvh">
        <div className="bg-aurora" aria-hidden />
        <div className="bg-grain" aria-hidden />
        <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6">
          <p className="eyebrow">404</p>
          <h1 className="type-page mt-4 text-fg">Esta página no existe.</h1>
          <p className="type-lead mt-4 text-fg-muted" lang="en">
            This page doesn&apos;t exist.
          </p>
          <div className="mt-8 flex gap-6 text-sm font-semibold text-violet-300">
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-violet-200">
              Ir al inicio
            </Link>
            <Link
              href="/en"
              lang="en"
              className="inline-flex min-h-11 items-center hover:text-violet-200"
            >
              Go to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
