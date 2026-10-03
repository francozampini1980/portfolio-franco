import type { CaseStudy } from "@/lib/types";
import { cn } from "@/lib/cn";
import { readingTime } from "@/lib/reading-time";
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
        "group flex flex-col gap-4 rounded-card border border-line bg-surface p-7 transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:border-line-strong focus-visible:bg-surface-2",
        className,
      )}
    >
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
          className="inline-block transition-transform motion-safe:group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </TrackedLink>
  );
}
