import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Card } from "@/components/admin/ui";
import { TranslationsCard } from "@/components/admin/TranslationsCard";
import { countPendingTranslations } from "@/lib/translate-sync";

async function counts() {
  const supabase = createAdminClient();
  const [cases, exp, logos, unread] = await Promise.all([
    supabase.from("case_studies").select("id", { count: "exact", head: true }),
    supabase.from("experiences").select("id", { count: "exact", head: true }),
    supabase.from("company_logos").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false),
  ]);
  return {
    cases: cases.count ?? 0,
    exp: exp.count ?? 0,
    logos: logos.count ?? 0,
    unread: unread.count ?? 0,
  };
}

export default async function AdminHome() {
  const [c, pendingTranslations] = await Promise.all([
    counts(),
    countPendingTranslations().catch(() => 0),
  ]);
  const tiles = [
    { href: "/admin/textos", label: "Textos del sitio", meta: "Home · Sobre · Contacto" },
    { href: "/admin/casos", label: "Casos", meta: `${c.cases} cargados` },
    { href: "/admin/experiencia", label: "Experiencia", meta: `${c.exp} trabajos` },
    { href: "/admin/empresas", label: "Empresas", meta: `${c.logos} logos` },
    {
      href: "/admin/mensajes",
      label: "Mensajes",
      meta: c.unread > 0 ? `${c.unread} sin leer` : "Todo leído",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-black text-fg">Panel</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href}>
            <Card className="transition-colors hover:border-line-strong hover:bg-surface">
              <p className="font-serif text-lg font-black text-fg">{t.label}</p>
              <p className="mt-1 text-sm text-fg-subtle">{t.meta}</p>
            </Card>
          </Link>
        ))}
        <TranslationsCard pending={pendingTranslations} />
      </div>
    </div>
  );
}
