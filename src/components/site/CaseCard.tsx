import Image from "next/image";
import type { CaseStudy } from "@/lib/types";
import { cn } from "@/lib/cn";
import { readingTime } from "@/lib/reading-time";
import { thumbUrl } from "@/lib/thumbs";
import { uiCopy } from "@/lib/ui-copy";
import { MetricChip } from "@/components/site/MetricChip";
import { TrackedLink } from "@/components/site/TrackedLink";

export function CaseCard({
  study,
  origin,
  position,
  className,
}: {
  study: CaseStudy;
  origin: "home" | "casos";
  /** Posición 1–4 dentro de la grilla, para el evento case_card_click. */
  position: number;
  className?: string;
}) {
  const eyebrow = [study.client_label, uiCopy.cardCaso.lectura(readingTime(study))]
    .filter(Boolean)
    .join(" · ");
  const metrics = study.highlights.slice(0, 2);
  const titleId = `case-${study.slug}-title`;
  const eyebrowId = `case-${study.slug}-eyebrow`;
  const metricsId = `case-${study.slug}-metrics`;
  const thumb = thumbUrl(study.thumb_path);
  // Las dos primeras cards de la home están sobre el pliegue en desktop: se cargan ya.
  const eager = origin === "home" && position <= 2;

  return (
    <TrackedLink
      href={`/casos/${study.slug}`}
      track={{
        event: "case_card_click",
        props: { case_slug: study.slug, origin, position },
      }}
      aria-labelledby={titleId}
      aria-describedby={metrics.length > 0 ? `${eyebrowId} ${metricsId}` : eyebrowId}
      className={cn(
        "group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:border-line-strong focus-visible:bg-surface-2",
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-7">
        <p id={eyebrowId} className="eyebrow">
          {eyebrow}
        </p>
        <h3
          id={titleId}
          className="font-serif text-xl font-black leading-[26px] text-fg"
        >
          {study.title}
        </h3>
        {metrics.length > 0 ? (
          <div id={metricsId} className="flex flex-wrap gap-2">
            {metrics.map((h, i) => (
              <MetricChip key={i} html={h} />
            ))}
          </div>
        ) : null}
        <span className="text-sm font-semibold text-violet-300">
          {uiCopy.cardCaso.boton}{" "}
          <span
            aria-hidden
            className="inline-block transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
          >
            →
          </span>
        </span>
      </div>

      {thumb ? (
        // Decorativa (alt vacío): el nombre accesible de la card sigue siendo el título.
        // Pegada al borde inferior: la parte de abajo de la imagen la recorta la card.
        <div className="px-7">
          <div className="relative h-[180px] overflow-hidden rounded-t-xl border border-b-0 border-line-strong transition-transform duration-200 motion-safe:group-hover:-translate-y-2 motion-safe:group-focus-visible:-translate-y-2">
            <Image
              src={thumb}
              alt=""
              fill
              sizes="(min-width: 640px) 512px, 100vw"
              loading={eager ? "eager" : "lazy"}
              className="object-cover object-top"
            />
          </div>
        </div>
      ) : null}
    </TrackedLink>
  );
}
