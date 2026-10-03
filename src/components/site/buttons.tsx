import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { TrackedLink, type TrackSpec } from "@/components/site/TrackedLink";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "solid" | "outline";
  /** En mobile ocupa el ancho disponible (CTA del hero). */
  fullWidthOnMobile?: boolean;
  track?: TrackSpec;
};

export function ButtonLink({
  variant = "solid",
  fullWidthOnMobile,
  track,
  className,
  ...props
}: ButtonLinkProps) {
  const classes = cn(
    "inline-flex h-11 items-center justify-center rounded-pill px-6 text-sm font-semibold transition-colors",
    variant === "solid"
      ? "bg-gradient-to-r from-violet-500 to-green-500 text-ink hover:opacity-90"
      : "border border-line-strong text-fg hover:bg-surface",
    fullWidthOnMobile && "max-sm:flex-1",
    className,
  );
  return track ? (
    <TrackedLink {...props} track={track} className={classes} />
  ) : (
    <Link {...props} className={classes} />
  );
}

/** Enlace de texto violeta con área táctil de 44 px de alto. */
export function TextLink({
  className,
  track,
  ...props
}: ComponentProps<typeof Link> & { track?: TrackSpec }) {
  const classes = cn(
    "inline-flex min-h-11 items-center text-sm font-semibold text-violet-300 hover:text-violet-200",
    className,
  );
  return track ? (
    <TrackedLink {...props} track={track} className={classes} />
  ) : (
    <Link {...props} className={classes} />
  );
}
