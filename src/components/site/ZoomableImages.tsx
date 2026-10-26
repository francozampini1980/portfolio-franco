"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Lightbox } from "@/components/site/Lightbox";
import { useUiCopy } from "@/components/site/LangProvider";

type Img = { src: string; alt: string };

/**
 * Hace ampliables las imágenes incrustadas en el texto del CMS (HTML que
 * llega por Prose): las vuelve enfocables y abre el mismo visor que la galería.
 */
export function ZoomableImages({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Img | null>(null);
  const close = useCallback(() => setActive(null), []);
  const ampliar = useUiCopy().caso.galeria.ampliar;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    for (const img of root.querySelectorAll<HTMLImageElement>(".prose-cms img")) {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      if (!img.alt) img.setAttribute("aria-label", ampliar);
    }

    const target = (e: Event) => {
      const el = e.target as HTMLElement;
      return el instanceof HTMLImageElement && el.closest(".prose-cms") ? el : null;
    };
    const open = (img: HTMLImageElement) =>
      setActive({ src: img.currentSrc || img.src, alt: img.alt });

    const onClick = (e: MouseEvent) => {
      const img = target(e);
      if (img) open(img);
    };
    const onKey = (e: KeyboardEvent) => {
      const img = target(e);
      if (img && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        open(img);
      }
    };

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
    };
  }, [ampliar]);

  return (
    <div ref={ref}>
      {children}
      {active ? <Lightbox image={active} onClose={close} /> : null}
    </div>
  );
}
