import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { cleanRichText } from "@/lib/sanitize";
import { signInlineImages } from "@/lib/inline-images";
export { ButtonLink, TextLink } from "@/components/site/buttons";

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
  tone = "default",
}: {
  className?: string;
  children: ReactNode;
  id?: string;
  /** "alt" alterna al fondo --color-ink-2 (semitransparente para dejar ver el aura). */
  tone?: "default" | "alt";
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 sm:py-28",
        tone === "alt" && "bg-ink-2/80",
        className,
      )}
    >
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
      <h2 className="type-section mt-4 text-fg">{title}</h2>
    </div>
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
