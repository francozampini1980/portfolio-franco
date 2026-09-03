"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/casos", label: "Casos" },
  { href: "/experiencia", label: "Experiencia" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Franco Zampini — inicio"
          className="font-serif text-[1.35rem] font-black leading-none tracking-tight text-fg"
        >
          F/.
        </Link>

        <button
          type="button"
          aria-label="Menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted sm:hidden"
        >
          <span className="text-lg leading-none">{open ? "×" : "≡"}</span>
        </button>

        <ul className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "rounded-pill px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-violet-600/20 text-violet-200"
                      : "text-fg-muted hover:text-fg",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-line bg-ink/95 px-6 py-3 sm:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-fg-muted hover:bg-surface hover:text-fg"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
