import type { HomeLab } from "@/lib/types";

/** Pasos del caso real del Lab: lista numerada en desktop, chips en mobile. */
export function LabSteps({
  eyebrow,
  steps,
}: {
  eyebrow: string;
  steps: HomeLab["steps"];
}) {
  if (steps.length === 0) return null;
  return (
    <>
      <div className="hidden rounded-card border border-line bg-surface p-6 md:block">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <ol className="mt-4 space-y-4">
          {steps.map((step, i) => (
            <li key={step.title} className="flex items-start gap-3">
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-500 text-xs font-semibold text-fg"
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold leading-[22px] text-fg">
                  {step.title}
                </p>
                <p className="text-sm leading-[22px] text-fg-subtle">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <ol className="flex flex-wrap gap-2 md:hidden">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="rounded-pill border border-line-strong px-3 py-2 text-sm text-fg"
          >
            {i + 1}. {step.title}
          </li>
        ))}
      </ol>
    </>
  );
}
