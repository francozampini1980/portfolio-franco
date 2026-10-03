"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { trackEvent } from "@/lib/analytics";
import { uiCopy } from "@/lib/ui-copy";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "sending" | "sent" | "error" | "rate_limited";

const copy = uiCopy.contacto.form;
const FIELD_LABEL: Record<FieldName, "nombre" | "correo" | "mensaje"> = {
  name: "nombre",
  email: "correo",
  message: "mensaje",
};
const FIELD_ORDER: FieldName[] = ["name", "email", "message"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(field: FieldName, value: string): string | undefined {
  const v = value.trim();
  if (!v) return copy.errorVacio(FIELD_LABEL[field]);
  if (field === "email" && !EMAIL_RE.test(v)) return copy.errorCorreo;
  return undefined;
}

const fieldClass =
  "w-full rounded-xl border bg-ink/40 px-4 py-3 text-fg focus:border-violet-400";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const read = (): Record<FieldName, string> => {
    const fd = new FormData(formRef.current!);
    return {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
  };

  function onBlur(field: FieldName, value: string) {
    setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const values = read();
    const next: Errors = {};
    for (const f of FIELD_ORDER) next[f] = validate(f, values[f]);
    setErrors(next);

    const firstInvalid = FIELD_ORDER.find((f) => next[f]);
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
      trackEvent("contact_form_submit", { result: "validation_error" });
      return;
    }

    setStatus("sending");
    try {
      const payload = Object.fromEntries(new FormData(formRef.current!).entries());
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 429) {
        setStatus("rate_limited");
        trackEvent("contact_form_submit", { result: "rate_limited" });
        return;
      }
      if (!res.ok) throw new Error("server");
      formRef.current?.reset();
      setStatus("sent");
      trackEvent("contact_form_submit", { result: "success" });
    } catch {
      setStatus("error");
      trackEvent("contact_form_submit", { result: "server_error" });
    }
  }

  return (
    <>
      <div role="status">
        {status === "sent" ? (
          <p className="py-8 text-center font-serif text-xl font-black leading-[26px] text-fg">
            {copy.exito}
          </p>
        ) : null}
      </div>
      {status !== "sent" ? (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4">
          <Field
            id="name"
            label={copy.nombre}
            error={errors.name}
            onBlur={(v) => onBlur("name", v)}
          >
            {(props) => (
              <input {...props} name="name" required maxLength={120} autoComplete="name" />
            )}
          </Field>
          <Field
            id="email"
            label={copy.correo}
            error={errors.email}
            onBlur={(v) => onBlur("email", v)}
          >
            {(props) => (
              <input
                {...props}
                name="email"
                type="email"
                required
                maxLength={180}
                autoComplete="email"
              />
            )}
          </Field>
          <Field
            id="message"
            label={copy.mensaje}
            error={errors.message}
            onBlur={(v) => onBlur("message", v)}
          >
            {(props) => (
              <textarea {...props} name="message" required rows={5} maxLength={4000} />
            )}
          </Field>

          {/* honeypot */}
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              No completar
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {status === "error" || status === "rate_limited" ? (
            <p role="alert" className="text-sm leading-[22px] text-red-400">
              {status === "rate_limited" ? copy.errorLimite : copy.errorEnvio}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-11 items-center justify-center rounded-pill bg-gradient-to-r from-violet-500 to-green-500 px-6 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? copy.botonEnviando : copy.boton}
          </button>
        </form>
      ) : null}
    </>
  );
}

type ControlProps = {
  id: string;
  className: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement & HTMLTextAreaElement>) => void;
};

function Field({
  id,
  label,
  error,
  onBlur,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  onBlur: (value: string) => void;
  children: (props: ControlProps) => React.ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg-muted">
        {label}
      </label>
      {children({
        id,
        className: cn(fieldClass, error ? "border-red-400" : "border-line"),
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        onBlur: (e) => onBlur(e.target.value),
      })}
      {error ? (
        <p id={errorId} className="mt-2 text-sm leading-[22px] text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}
