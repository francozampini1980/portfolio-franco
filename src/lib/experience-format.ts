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

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Ids de ancla para la página de experiencia, en el mismo orden que la lista:
 * `empresa-año` (ej. "frávega-tech" → "fravega-tech-2025"). Si dos trabajos
 * coinciden, el segundo suma su posición para que el id sea único.
 */
export function experienceAnchors(
  list: { company: string; date_from: string }[],
): string[] {
  const used = new Set<string>();
  return list.map((e, i) => {
    const year = e.date_from.match(YEAR)?.[0] ?? "";
    const base = ["trabajo", slugify(e.company), year].filter(Boolean).join("-");
    const id = used.has(base) ? `${base}-${i + 1}` : base;
    used.add(id);
    return id;
  });
}
