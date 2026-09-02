"use client";

import { useState } from "react";

export function CopyButton({ value, label = "Copiar enlace" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      className="rounded-lg border border-line px-2.5 py-1 text-xs text-fg-muted hover:text-fg"
    >
      {copied ? "¡Copiado!" : label}
    </button>
  );
}
