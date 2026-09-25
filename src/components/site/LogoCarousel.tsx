import type { CompanyLogo } from "@/lib/types";

export function LogoCarousel({ logos }: { logos: CompanyLogo[] }) {
  const items = logos.filter((l) => l.logo_url);
  if (items.length === 0) return null;

  return (
    <div className="border-y border-line py-10 sm:py-12">
      <div
        className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 px-6 sm:gap-6"
        role="group"
        aria-label="Empresas donde trabajé"
      >
        {items.map((logo) => {
          const chip = (
            <span className="logo-hover flex h-16 w-32 shrink-0 items-center justify-center rounded-xl bg-white/90 p-3 shadow-sm sm:h-20 sm:w-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.logo_url}
                alt={logo.name}
                className="max-h-8 max-w-full object-contain sm:max-h-10"
              />
            </span>
          );
          return logo.website_url ? (
            <a
              key={logo.id}
              href={logo.website_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={logo.name}
            >
              {chip}
            </a>
          ) : (
            <span key={logo.id}>{chip}</span>
          );
        })}
      </div>
    </div>
  );
}
