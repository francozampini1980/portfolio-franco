import Link from "next/link";
import type { CaseStudy } from "@/lib/types";
import { cn } from "@/lib/cn";

export function CaseCard({
  study,
  className,
}: {
  study: CaseStudy;
  className?: string;
}) {
  return (
    <Link
      href={`/casos/${study.slug}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface/60 p-7 transition-colors hover:border-line-strong hover:bg-surface",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
        style={{
          background:
            "radial-gradient(circle, var(--color-violet-600), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative">
        {study.client_label ? (
          <p className="eyebrow">{study.client_label}</p>
        ) : null}
        <h3 className="mt-3 font-serif text-xl font-black leading-tight text-fg">
          {study.title}
        </h3>
        {study.highlights.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {study.highlights.slice(0, 3).map((h, i) => (
              <span
                key={i}
                className="rounded-pill border border-violet-500/25 bg-gradient-to-r from-violet-600/15 to-green-600/15 px-2.5 py-1 text-xs font-semibold text-fg"
              >
                {h}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative mt-6 flex items-center gap-2 text-xs font-semibold text-fg-subtle">
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-1 text-fg-subtle">
          <span aria-hidden>🔒</span>
          Contenido protegido
        </span>
        <span className="ml-auto transition-transform group-hover:translate-x-1">
          Ver caso →
        </span>
      </div>
    </Link>
  );
}
