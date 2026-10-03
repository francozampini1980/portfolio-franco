import { uiCopy } from "@/lib/ui-copy";
import type { CaseStudy } from "@/lib/types";

/** Resumen del caso: El problema / Lo que decidí / El resultado. */
export function CaseSummary({
  study,
}: {
  study: Pick<CaseStudy, "summary_problem" | "summary_decision" | "summary_result">;
}) {
  const labels = uiCopy.caso.resumen;
  const blocks = [
    { label: labels.problema, text: study.summary_problem },
    { label: labels.decision, text: study.summary_decision },
    { label: labels.resultado, text: study.summary_result },
  ].filter((b) => b.text?.trim());

  if (blocks.length === 0) return null;

  return (
    <dl className="grid gap-3 lg:grid-cols-3 lg:gap-4">
      {blocks.map((b) => (
        <div
          key={b.label}
          className="rounded-card border border-line bg-surface p-5"
        >
          <dt className="eyebrow text-violet-300">{b.label}</dt>
          <dd className="mt-3 text-sm leading-[22px] text-fg">{b.text}</dd>
        </div>
      ))}
    </dl>
  );
}
