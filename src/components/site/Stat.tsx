import { cn } from "@/lib/cn";
import type { CaseStat } from "@/lib/types";

/** Número de impacto. Va dentro de un <dl> (ver StatGrid) para que valor y descripción se lean juntos. */
export function Stat({ value, label }: CaseStat) {
  return (
    <div className="rounded-card border border-line bg-surface p-6">
      <dt className="font-serif text-[32px] font-black leading-[36px] tracking-[-0.64px] text-violet-300 sm:text-[40px] sm:leading-[44px] sm:tracking-[-0.8px]">
        {value}
      </dt>
      <dd className="mt-2 text-sm leading-[22px] text-fg-muted">{label}</dd>
    </div>
  );
}

export function StatGrid({
  stats,
  className,
}: {
  stats: CaseStat[];
  className?: string;
}) {
  if (stats.length === 0) return null;
  return (
    <dl
      style={{ "--cols": stats.length } as React.CSSProperties}
      className={cn("grid gap-3 sm:gap-4", className)}
    >
      {stats.map((s, i) => (
        <Stat key={i} {...s} />
      ))}
    </dl>
  );
}
