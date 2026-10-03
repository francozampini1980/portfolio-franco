import { uiCopy } from "@/lib/ui-copy";

const YEAR = /\d{4}/;

/** "Enero 2025" / "actualidad" → "2025 — actualidad" (home). */
export function yearRange(from: string, to: string | null): string {
  const start = from.match(YEAR)?.[0] ?? from;
  const end = !to || !to.trim() || to.trim().toLowerCase() === "actualidad"
    ? uiCopy.home.experiencia.actualidad
    : (to.match(YEAR)?.[0] ?? to);
  return `${start} — ${end}`;
}

/** "Mes AAAA - Mes AAAA" o "- actualidad" (página de experiencia). */
export function monthRange(from: string, to: string | null): string {
  const end = !to || !to.trim() ? uiCopy.home.experiencia.actualidad : to;
  return `${from} - ${end}`;
}

/** "Equipo de hasta 14 personas." → "Equipo de hasta 14 personas" (home, sin el punto final). */
export function teamLabelShort(label: string | null): string | null {
  if (!label) return null;
  return label.replace(/\.\s*$/, "");
}
