"use client";

import { useFormStatus } from "react-dom";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-pill bg-gradient-to-r from-violet-500 to-green-500 px-6 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Verificando…" : "Ingresar"}
    </button>
  );
}

export function AccessForm({
  action,
  next,
  hasError,
}: {
  action: (formData: FormData) => void | Promise<void>;
  next?: string;
  hasError?: boolean;
}) {
  return (
    <form action={action} className="mt-8 space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-fg-muted"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="off"
          autoFocus
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-fg outline-none focus:border-violet-400"
        />
      </div>
      {hasError ? (
        <p className="text-sm text-red-400">
          La contraseña no es correcta. Probá de nuevo.
        </p>
      ) : null}
      <Submit />
    </form>
  );
}
