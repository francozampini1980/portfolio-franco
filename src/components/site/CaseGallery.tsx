"use client";

import { useCallback, useState } from "react";
import { Lightbox } from "@/components/site/Lightbox";

type Img = { src: string; alt: string };

export function CaseGallery({ images }: { images: Img[] }) {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);

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

      {active !== null ? <Lightbox image={images[active]} onClose={close} /> : null}
    </>
  );
}
