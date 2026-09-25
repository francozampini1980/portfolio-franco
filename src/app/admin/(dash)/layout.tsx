import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth-actions";

const NAV = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/textos", label: "Textos" },
  { href: "/admin/casos", label: "Casos" },
  { href: "/admin/experiencia", label: "Experiencia" },
  { href: "/admin/empresas", label: "Empresas" },
  { href: "/admin/accesos", label: "Accesos" },
  { href: "/admin/mensajes", label: "Mensajes" },
  { href: "/admin/cuenta", label: "Cuenta" },
];

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex flex-wrap items-center gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-1.5 text-sm text-fg-muted hover:bg-surface hover:text-fg"
            >
              {n.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-fg-subtle">
          <Link href="/" target="_blank" className="hover:text-fg">
            Ver sitio ↗
          </Link>
          <form action={signOut}>
            <button className="rounded-lg border border-line px-2.5 py-1 hover:text-fg">
              Salir
            </button>
          </form>
        </div>
      </header>
      <div className="py-8">{children}</div>
    </div>
  );
}
