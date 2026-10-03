import type { CompanyLogo } from "@/lib/types";

/** Tile de logo de empresa: 160×80 en desktop, ancho de columna en la grilla 2×2 de mobile. Sin animación ni link. */
export function LogoTile({ logo }: { logo: CompanyLogo }) {
  return (
    <div className="flex h-20 w-full items-center justify-center rounded-xl bg-white/90 p-3 sm:w-40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.logo_url}
        alt={logo.name}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}
