"use client";

import { useEffect, useRef } from "react";
import { useUiCopy } from "@/components/site/LangProvider";

type Img = { src: string; alt: string };

/**
 * Imagen ampliada a pantalla completa. Se cierra con clic, con el botón
 * o con Escape, y devuelve el foco al elemento que la abrió.
 */
export function Lightbox({ image, onClose }: { image: Img; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const copy = useUiCopy();

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={image.alt || undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[90vh] max-w-full rounded-lg object-contain lg:max-w-5xl"
      />
      <button
        ref={closeRef}
        type="button"
        aria-label={copy.caso.galeria.cerrar}
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-fg"
      >
        ×
      </button>
    </div>
  );
}
