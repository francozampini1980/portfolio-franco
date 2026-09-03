import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { cleanRichText } from "@/lib/sanitize";
import { signInlineImages } from "@/lib/inline-images";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6", className)}>
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
  id,
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="display mt-4 text-3xl text-fg sm:text-4xl">{title}</h2>
    </div>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "solid" | "outline";
};

export function ButtonLink({
  variant = "solid",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-pill px-6 text-sm font-semibold transition-colors",
        variant === "solid"
          ? "bg-gradient-to-r from-violet-500 to-green-500 text-ink hover:opacity-90"
          : "border border-line-strong text-fg hover:bg-surface",
        className,
      )}
    />
  );
}

/** Renders CMS rich text: sanitised, with inline images re-signed. */
export async function Prose({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const safe = await signInlineImages(cleanRichText(html));
  return (
    <div
      className={cn("prose-cms", className)}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
