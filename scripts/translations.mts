// Versión en inglés: lista los textos sin traducir y guarda traducciones.
//
//   npx tsx --tsconfig scripts/tsconfig.json scripts/translations.mts pending <salida.json>
//     → escribe ["texto en español", …] con lo que falta traducir.
//   npx tsx --tsconfig scripts/tsconfig.json scripts/translations.mts apply <entrada.json>
//     → guarda [{ "source": "…", "translated": "…" }, …] en la tabla translations.
//
// Lee las variables de .env.local sin imprimirlas. Después de `apply`, el sitio
// muestra las traducciones cuando se revalida (al guardar algo en el admin o a la hora).
import { readFileSync, writeFileSync } from "node:fs";
import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd(), false, { info: () => {}, error: console.error });

const [command, file] = process.argv.slice(2);
const { listPendingTexts, saveTranslations } = await import("../src/lib/translate-sync");

if (command === "pending" && file) {
  const pending = await listPendingTexts();
  writeFileSync(file, JSON.stringify(pending, null, 2));
  console.log(`${pending.length} textos sin traducir → ${file}`);
} else if (command === "apply" && file) {
  const rows = JSON.parse(readFileSync(file, "utf8")) as {
    source: string;
    translated: string;
  }[];
  const pending = new Set(await listPendingTexts());
  const unknown = rows.filter((r) => !pending.has(r.source));
  if (unknown.length > 0) {
    console.warn(`${unknown.length} textos ya no están en el sitio o ya estaban traducidos: se guardan igual.`);
  }
  const saved = await saveTranslations(rows);
  console.log(`${saved} traducciones guardadas.`);
} else {
  console.error("Uso: translations.mts pending <salida.json> | apply <entrada.json>");
  process.exit(1);
}
