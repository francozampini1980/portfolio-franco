import { cn } from "@/lib/cn";

/**
 * Caja con borde: título + texto. Con `number` se usa para los principios de la home
 * ("01–04"); con `compactOnMobile` en mobile queda como fila número + título, sin texto.
 */
export function InfoCard({
  title,
  body,
  number,
  compactOnMobile,
  className,
}: {
  title: string;
  body: string;
  number?: string;
  compactOnMobile?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-surface p-6",
        compactOnMobile && "max-md:flex max-md:items-center max-md:gap-4 max-md:px-5 max-md:py-4",
        className,
      )}
    >
      {number ? <p className="eyebrow">{number}</p> : null}
      <h3
        className={cn(
          "font-serif text-xl font-black leading-[26px] text-fg",
          number && "md:mt-3",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-2 text-sm leading-[22px] text-fg-muted",
          compactOnMobile && "max-md:hidden",
        )}
      >
        {body}
      </p>
    </div>
  );
}
