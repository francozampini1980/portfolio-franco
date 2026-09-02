import { getAdminUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (await getAdminUser()) redirect("/admin");

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6">
      <p className="font-serif text-2xl font-black text-fg">CMS</p>
      <p className="mt-1 text-sm text-fg-subtle">Portfolio de Franco Zampini</p>

      <form action={signIn} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-fg-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-fg outline-none focus:border-violet-400"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm text-fg-muted">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-fg outline-none focus:border-violet-400"
          />
        </div>
        {error ? (
          <p className="text-sm text-red-400">
            No pudimos iniciar sesión. Revisá el email y la contraseña.
          </p>
        ) : null}
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-pill bg-gradient-to-r from-violet-500 to-green-500 text-sm font-semibold text-ink"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
