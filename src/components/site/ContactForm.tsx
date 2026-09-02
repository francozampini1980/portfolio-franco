"use client";

import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-line bg-ink/40 px-4 py-3 text-fg outline-none focus:border-violet-400";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo enviar el mensaje.");
      }
      form.reset();
      setState("sent");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Error inesperado.");
    }
  }

  if (state === "sent") {
    return (
      <div className="py-8 text-center">
        <p className="font-serif text-xl font-black text-fg">¡Gracias!</p>
        <p className="mt-2 text-sm text-fg-muted">
          Recibí tu mensaje y te respondo pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-fg-muted">
          Nombre
        </label>
        <input id="name" name="name" required maxLength={120} className={field} />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-fg-muted">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={180}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-fg-muted">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          className={field}
        />
      </div>

      {/* honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          No completar
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state === "error" ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex h-12 items-center justify-center rounded-pill bg-gradient-to-r from-violet-500 to-green-500 px-6 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
