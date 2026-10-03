import { cn } from "@/lib/cn";
import { uiCopy } from "@/lib/ui-copy";
import { TrackedLink } from "@/components/site/TrackedLink";

type Neighbor = { slug: string; title: string };

function NavCard({
  direction,
  target,
  fromSlug,
}: {
  direction: "prev" | "next";
  target: Neighbor;
  fromSlug: string;
}) {
  const nav = uiCopy.caso.navegacion;
  const label = direction === "prev" ? nav.anterior : nav.siguiente;
  return (
    <TrackedLink
      href={`/casos/${target.slug}`}
      track={{
        event: "case_nav_click",
        props: { direction, from_slug: fromSlug },
      }}
      aria-label={`${label} · ${target.title}`}
      className={cn(
        "flex flex-col gap-2 rounded-card border border-line p-5 transition-colors hover:border-line-strong hover:bg-surface-2 focus-visible:border-line-strong focus-visible:bg-surface-2",
        direction === "next" && "text-right md:col-start-2",
      )}
    >
      <span className="eyebrow text-violet-300">
        {direction === "prev" ? `← ${label}` : `${label} →`}
      </span>
      <span className="font-serif text-xl font-black leading-[26px] text-fg">
        {target.title}
      </span>
    </TrackedLink>
  );
}

/** Tarjetas de caso anterior / siguiente. Sin vuelta circular: la tarjeta presente ocupa su mitad. */
export function CaseNav({
  fromSlug,
  prev,
  next,
}: {
  fromSlug: string;
  prev: Neighbor | null;
  next: Neighbor | null;
}) {
  if (!prev && !next) return null;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {prev ? <NavCard direction="prev" target={prev} fromSlug={fromSlug} /> : null}
      {next ? <NavCard direction="next" target={next} fromSlug={fromSlug} /> : null}
    </div>
  );
}
