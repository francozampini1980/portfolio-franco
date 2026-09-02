import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-surface/40 p-6",
        className,
      )}
    >
      {title ? (
        <h2 className="mb-4 font-serif text-lg font-black text-fg">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}

export function Label({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-fg-muted">
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-line bg-ink/40 px-3.5 py-2.5 text-sm text-fg outline-none focus:border-violet-400";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return <textarea {...props} className={cn(inputClass, props.className)} />;
}
