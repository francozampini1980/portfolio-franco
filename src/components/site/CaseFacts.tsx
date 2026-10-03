import { uiCopy } from "@/lib/ui-copy";
import type { CaseStudy } from "@/lib/types";

/** Ficha del caso: Rol, Empresa, Período, Equipo. Un campo vacío o null se oculta y las columnas se redistribuyen. */
export function CaseFacts({
  study,
}: {
  study: Pick<
    CaseStudy,
    "summary_role" | "summary_company" | "summary_period" | "summary_team"
  >;
}) {
  const labels = uiCopy.caso.ficha;
  const all: { label: string; value: string | null }[] = [
    { label: labels.rol, value: study.summary_role },
    { label: labels.empresa, value: study.summary_company },
    { label: labels.periodo, value: study.summary_period },
    { label: labels.equipo, value: study.summary_team },
  ];
  const items = all.filter((i): i is { label: string; value: string } => !!i.value?.trim());

  if (items.length === 0) return null;

  return (
    <dl
      style={{ "--cols": items.length } as React.CSSProperties}
      className="grid gap-3 border-y border-line py-5 lg:gap-6 lg:py-6 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[96px_1fr] items-baseline gap-3 lg:block"
        >
          <dt className="eyebrow">{item.label}</dt>
          <dd className="text-sm leading-[22px] text-fg lg:mt-2">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
