import type { CSSProperties } from "react";
import type { Experience } from "@/lib/types";
import { yearRange } from "@/lib/experience-format";

/**
 * Línea de tiempo de los trabajos cargados. Cada ítem es un ancla a su detalle
 * en la lista de abajo. Vertical hasta `lg`, horizontal desde `lg`.
 * Mismo orden que la lista (más reciente primero).
 */
export function ExperienceTimeline({
  items,
  anchors,
}: {
  items: Experience[];
  anchors: string[];
}) {
  if (items.length === 0) return null;
  return (
    <ol
      style={{ "--n": items.length } as CSSProperties}
      className="mt-12 space-y-1 border-l border-line pl-6 lg:grid lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))] lg:gap-6 lg:space-y-0 lg:border-l-0 lg:border-t lg:pl-0"
    >
      {items.map((e, i) => (
        <li key={e.id} className="relative">
          <span
            className="absolute -left-[1.72rem] top-4 h-3 w-3 rounded-full bg-gradient-to-br from-violet-400 to-green-400 lg:-top-[0.4rem] lg:left-0"
            aria-hidden
          />
          <a
            href={`#${anchors[i]}`}
            className="group block min-w-0 rounded-lg py-2 lg:pt-5"
          >
            <span className="block text-sm leading-[22px] text-fg-subtle">
              {yearRange(e.date_from, e.date_to)}
            </span>
            <span className="block break-words font-serif text-base font-black leading-[24px] text-fg transition-colors group-hover:text-violet-300">
              {e.company}
            </span>
            <span className="block break-words text-sm leading-[22px] text-fg-muted">
              {e.role}
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}
