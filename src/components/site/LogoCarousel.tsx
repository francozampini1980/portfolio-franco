import type { CompanyLogo } from "@/lib/types";

export function LogoCarousel({ logos }: { logos: CompanyLogo[] }) {
  const items = logos.filter((l) => l.logo_url);
  if (items.length === 0) return null;

  // Duplicated for a seamless infinite loop (the track scrolls exactly -50%).
  const track = [...items, ...items];

  return (
    <div className="border-y border-line py-10 sm:py-12">
      <div
        className="logo-marquee"
        role="group"
        aria-label="Empresas donde trabajé"
      >
        <div className="logo-marquee__track">
          {track.map((logo, i) => {
            const chip = (
              <span className="flex h-16 w-32 shrink-0 items-center justify-center rounded-xl bg-white/90 p-3 shadow-sm sm:h-20 sm:w-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.logo_url}
                  alt={logo.name}
                  className="max-h-8 max-w-full object-contain sm:max-h-10"
                />
              </span>
            );
            return (
              <div
                key={`${logo.id}-${i}`}
                className="logo-marquee__item"
                aria-hidden={i >= items.length}
              >
                {logo.website_url ? (
                  <a
                    href={logo.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={logo.name}
                    tabIndex={i >= items.length ? -1 : 0}
                  >
                    {chip}
                  </a>
                ) : (
                  chip
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
