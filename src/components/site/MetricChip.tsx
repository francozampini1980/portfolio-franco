import { cn } from "@/lib/cn";
import { cleanInlineText } from "@/lib/sanitize";

/** Píldora de métrica. `html` pasa por cleanInlineText (solo strong/em). */
export function MetricChip({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block max-w-[304px] rounded-pill border border-violet-500/40 bg-violet-500/[0.18] px-3 py-1 font-sans text-[13px] font-normal leading-5 text-fg [&_em]:italic [&_strong]:font-bold",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: cleanInlineText(html) }}
    />
  );
}
