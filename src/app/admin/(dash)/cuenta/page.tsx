import { getAdminUser } from "@/lib/supabase/server";
import { changePassword } from "@/lib/auth-actions";
import { Card, Label, TextInput } from "@/components/admin/ui";

const ERRORS: Record<string, string> = {
  corta: "La contraseña necesita al menos 8 caracteres.",
  distinta: "Las dos contraseñas no coinciden.",
  "1": "No se pudo cambiar la contraseña. Probá de nuevo.",
};

export default async function CuentaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const user = await getAdminUser();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-black text-fg">Cuenta</h1>

      <Card title="Datos de acceso">
        <p className="text-sm text-fg-muted">
          Email: <span className="text-fg">{user?.email}</span>
        </p>
      </Card>

      <Card title="Cambiar contraseña">
        <form action={changePassword} className="max-w-sm space-y-4">
          <div>
            <Label htmlFor="password">Nueva contraseña</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <Label htmlFor="confirm">Repetir contraseña</Label>
            <TextInput
              id="confirm"
              name="confirm"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-400">
              {ERRORS[error] ?? "Revisá los datos."}
            </p>
          ) : null}
          {ok ? (
            <p className="text-sm text-green-300">Contraseña actualizada ✓</p>
          ) : null}
          <button className="h-10 rounded-xl bg-gradient-to-r from-violet-500 to-green-500 px-5 text-sm font-semibold text-ink">
            Guardar
          </button>
        </form>
      </Card>
    </div>
  );
}
