"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";
import { ButtonLink } from "@/components/site/buttons";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // El menú queda abierto solo mientras no cambie la ruta en la que se abrió.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const nav = uiCopy.nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeWithEscape = useCallback(() => {
    setOpenOn(null);
    buttonRef.current?.focus();
  }, []);

  // Al abrir: el foco va al primer enlace. Mientras está abierto: Esc cierra y Tab queda dentro del menú.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeWithEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const inPanel = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );
      const cycle = buttonRef.current ? [buttonRef.current, ...inPanel] : inPanel;
      if (cycle.length === 0) return;
      const first = cycle[0];
      const last = cycle[cycle.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      } else if (!cycle.includes(current as HTMLElement)) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeWithEscape]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-ink/80 backdrop-blur-md"
          : "border-b border-transparent",
        open && "max-md:bg-ink",
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label={nav.logoAriaLabel}
          className="inline-flex min-h-11 min-w-11 items-center font-serif text-[1.35rem] font-black leading-none tracking-tight text-fg"
        >
          F/.
        </Link>

        <button
          ref={buttonRef}
          type="button"
          aria-label={open ? nav.menuCerrarAria : nav.menuAbrirAria}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpenOn(open ? null : pathname)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg-muted md:hidden"
        >
          <span aria-hidden className="text-lg leading-none">
            {open ? "×" : "≡"}
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center gap-1">
            {nav.links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-pill px-3.5 text-sm font-medium transition-colors",
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
          <ButtonLink
            href="/contacto"
            className="ml-2"
            track={{ event: "cta_contact_click", props: { location: "header" } }}
          >
            {nav.cta}
          </ButtonLink>
        </div>
      </nav>

      <div
        id="site-menu"
        ref={panelRef}
        hidden={!open}
        className="absolute left-0 right-0 top-full h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-ink md:hidden"
      >
        <div className="flex flex-col px-6 pb-10 pt-6">
          <ul>
            {nav.links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-14 items-center font-serif text-[30px] font-black leading-[34px] tracking-[-0.6px]",
                      active ? "text-violet-300" : "text-fg",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ButtonLink
            href="/contacto"
            className="mt-6 w-full"
            track={{ event: "cta_contact_click", props: { location: "menu_mobile" } }}
          >
            {nav.cta}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
