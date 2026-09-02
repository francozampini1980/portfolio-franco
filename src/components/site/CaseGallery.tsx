"use client";

import { useState } from "react";

type Img = { src: string; alt: string };

export function CaseGallery({ images }: { images: Img[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="overflow-hidden rounded-xl border border-line bg-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {active !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-6 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active].src}
            alt={images[active].alt}
            className="max-h-[90vh] max-w-5xl rounded-lg object-contain"
          />
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-fg"
          >
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
