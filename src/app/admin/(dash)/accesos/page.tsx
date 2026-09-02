import { createAdminClient } from "@/lib/supabase/admin";
import {
  createAccessLink,
  deleteAccessLink,
  setCasePassword,
  toggleAccessLink,
} from "@/lib/admin-actions";
import { Card, Label, TextInput } from "@/components/admin/ui";
import { CopyButton } from "@/components/admin/CopyButton";
import type { AccessEvent, AccessLink } from "@/lib/types";

export default async function AccesosPage() {
  const supabase = createAdminClient();
  const [{ data: links }, { data: events }, { data: settings }] = await Promise.all([
    supabase.from("access_links").select("*").order("created_at", { ascending: false }),
    supabase.from("access_events").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("site_settings").select("access_password_hash, updated_at").eq("id", 1).single(),
  ]);

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const hasPassword = !!settings?.access_password_hash;

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-black text-fg">Accesos</h1>

      <Card title="Contraseña de los casos">
        <p className="mb-4 text-sm text-fg-subtle">
          {hasPassword
            ? "Hay una contraseña activa. Cambiarla deja fuera a quien ya la tenía."
            : "Todavía no configuraste una contraseña. Los casos no se pueden abrir hasta que lo hagas."}
        </p>
        <form action={setCasePassword} className="flex flex-wrap items-end gap-3">
          <div className="grow">
            <Label htmlFor="password">Nueva contraseña</Label>
            <TextInput
              id="password"
              name="password"
              type="text"
              minLength={6}
              required
              placeholder="mínimo 6 caracteres"
            />
          </div>
          <button className="h-[42px] rounded-xl bg-gradient-to-r from-violet-500 to-green-500 px-5 text-sm font-semibold text-ink">
            Guardar
          </button>
        </form>
      </Card>

      <Card title="Enlaces de acceso directo">
        <p className="mb-4 text-sm text-fg-subtle">
          Cada enlace abre todos los casos sin pedir contraseña. Poné una
          etiqueta para reconocer a quién se lo diste, y revocalo cuando quieras.
        </p>
        <form action={createAccessLink} className="flex flex-wrap items-end gap-3">
          <div className="grow">
            <Label htmlFor="label">Etiqueta</Label>
            <TextInput id="label" name="label" required placeholder="ej. Mercado Libre — Ana" />
          </div>
          <button className="h-[42px] rounded-xl border border-line-strong px-5 text-sm font-semibold text-fg hover:bg-surface">
            Crear enlace
          </button>
        </form>

        <ul className="mt-5 divide-y divide-line">
          {(links as AccessLink[] | null)?.map((l) => {
            const url = `${base}/acceso/${l.token}`;
            return (
              <li key={l.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-[12rem] grow">
                  <p className="text-sm font-medium text-fg">
                    {l.label}{" "}
                    {l.revoked ? (
                      <span className="text-xs text-red-400">· revocado</span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-fg-subtle">{url}</p>
                  <p className="text-xs text-fg-subtle">
                    {l.use_count} uso{l.use_count === 1 ? "" : "s"}
                    {l.last_used_at
                      ? ` · último ${new Date(l.last_used_at).toLocaleString("es-AR")}`
                      : " · sin usar"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!l.revoked ? <CopyButton value={url} /> : null}
                  <form action={toggleAccessLink.bind(null, l.id, !l.revoked)}>
                    <button className="rounded-lg border border-line px-2.5 py-1 text-xs text-fg-muted hover:text-fg">
                      {l.revoked ? "Reactivar" : "Revocar"}
                    </button>
                  </form>
                  <form action={deleteAccessLink.bind(null, l.id)}>
                    <button className="rounded-lg border border-line px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/10">
                      Borrar
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
          {!links?.length ? (
            <li className="py-3 text-sm text-fg-subtle">Sin enlaces todavía.</li>
          ) : null}
        </ul>
      </Card>

      <Card title="Registro de ingresos">
        {events?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-fg-subtle">
                <tr>
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4">Método</th>
                  <th className="py-2 pr-4">Etiqueta</th>
                  <th className="py-2 pr-4">IP</th>
                </tr>
              </thead>
              <tbody className="text-fg-muted">
                {(events as AccessEvent[]).map((e) => (
                  <tr key={e.id} className="border-t border-line">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleString("es-AR")}
                    </td>
                    <td className="py-2 pr-4">
                      {e.method === "link" ? "Enlace" : "Contraseña"}
                    </td>
                    <td className="py-2 pr-4">{e.link_label ?? "—"}</td>
                    <td className="py-2 pr-4">{e.ip ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-fg-subtle">Nadie ingresó todavía.</p>
        )}
      </Card>
    </div>
  );
}
