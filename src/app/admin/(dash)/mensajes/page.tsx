import { createAdminClient } from "@/lib/supabase/admin";
import { markMessageRead, deleteMessage } from "@/lib/admin-actions";
import { Card } from "@/components/admin/ui";
import type { ContactMessage } from "@/lib/types";

export default async function MensajesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  const messages = (data as ContactMessage[]) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-black text-fg">Mensajes</h1>
      {messages.length === 0 ? (
        <p className="text-sm text-fg-subtle">Todavía no hay mensajes.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <Card key={m.id} className={m.read ? "opacity-70" : ""}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-fg">
                    {m.name}{" "}
                    <a
                      href={`mailto:${m.email}`}
                      className="text-sm font-normal text-violet-300"
                    >
                      {m.email}
                    </a>
                  </p>
                  <p className="text-xs text-fg-subtle">
                    {new Date(m.created_at).toLocaleString("es-AR")}
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <form
                    action={markMessageRead.bind(null, m.id, !m.read)}
                  >
                    <button className="rounded-lg border border-line px-2.5 py-1 text-fg-muted hover:text-fg">
                      {m.read ? "Marcar no leído" : "Marcar leído"}
                    </button>
                  </form>
                  <form action={deleteMessage.bind(null, m.id)}>
                    <button className="rounded-lg border border-line px-2.5 py-1 text-red-400 hover:bg-red-500/10">
                      Borrar
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-fg-muted">
                {m.message}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
