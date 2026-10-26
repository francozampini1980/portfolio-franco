import { Card } from "@/components/admin/ui";

/** Estado de la versión en inglés: cuántos textos del sitio no tienen traducción. */
export function TranslationsCard({ pending }: { pending: number }) {
  return (
    <Card>
      <p className="font-serif text-lg font-black text-fg">Versión en inglés</p>
      <p className="mt-1 text-sm text-fg-subtle">
        {pending === 0
          ? "Todo el contenido está traducido."
          : `${pending} ${pending === 1 ? "texto sin traducir" : "textos sin traducir"}: en /en se ven en español.`}
      </p>
      {pending > 0 ? (
        <p className="mt-1 text-xs text-fg-subtle">
          Pedile a Claude que traduzca los pendientes.
        </p>
      ) : null}
    </Card>
  );
}
