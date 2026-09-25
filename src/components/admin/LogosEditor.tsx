"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { CompanyLogo } from "@/lib/types";
import {
  createLogo,
  createPublicAssetUploadUrl,
  deleteLogo,
  deletePublicAsset,
  reorderLogos,
  updateLogo,
} from "@/lib/admin-actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card, Label, inputClass } from "@/components/admin/ui";

function LogoImageField({
  url,
  onChange,
}: {
  url: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErr("Máximo 5 MB.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const { path, token, publicUrl } = await createPublicAssetUploadUrl(
        "logos",
        file.name,
      );
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.storage
        .from("public-assets")
        .uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (error) throw new Error(error.message);
      const previousUrl = url;
      onChange(`${publicUrl}?v=${Date.now()}`);
      if (previousUrl) deletePublicAsset(previousUrl).catch(() => {});
    } catch {
      setErr("No se pudo subir el logo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label>Logo</Label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-line bg-white/90 p-2">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-black/40">sin logo</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => ref.current?.click()}
            className="h-9 rounded-lg border border-line px-3 text-sm text-fg-muted hover:text-fg disabled:opacity-60"
          >
            {busy ? "Subiendo…" : url ? "Reemplazar" : "Subir logo"}
          </button>
          {url ? (
            <button
              type="button"
              onClick={() => {
                deletePublicAsset(url).catch(() => {});
                onChange("");
              }}
              className="text-left text-xs text-red-400 hover:underline"
            >
              Quitar
            </button>
          ) : null}
          <input
            ref={ref}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
            hidden
            onChange={pick}
          />
        </div>
      </div>
      {err ? <p className="mt-1 text-sm text-red-400">{err}</p> : null}
    </div>
  );
}

function Row({
  logo,
  onMove,
  canUp,
  canDown,
}: {
  logo: CompanyLogo;
  onMove: (dir: -1 | 1) => void;
  canUp: boolean;
  canDown: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(logo);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const set = (p: Partial<CompanyLogo>) => {
    setForm((f) => ({ ...f, ...p }));
    setSaved(false);
  };

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2 text-xs text-fg-subtle">
        <button onClick={() => onMove(-1)} disabled={!canUp} className="hover:text-fg disabled:opacity-30">▲</button>
        <button onClick={() => onMove(1)} disabled={!canDown} className="hover:text-fg disabled:opacity-30">▼</button>
        <span className="ml-auto" />
        <button
          onClick={() => {
            if (!confirm(`¿Borrar "${logo.name}"?`)) return;
            start(async () => {
              await deleteLogo(logo.id);
              router.refresh();
            });
          }}
          className="text-red-400 hover:underline"
        >
          Borrar
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Nombre de la empresa</Label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
          />
        </div>
        <div>
          <Label>Sitio web (opcional)</Label>
          <input
            className={inputClass}
            placeholder="https://…"
            value={form.website_url ?? ""}
            onChange={(e) => set({ website_url: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-4">
        <LogoImageField url={form.logo_url} onChange={(logo_url) => set({ logo_url })} />
      </div>

      <div className="mt-4">
        <button
          onClick={() =>
            start(async () => {
              await updateLogo(logo.id, {
                name: form.name,
                website_url: form.website_url || null,
                logo_url: form.logo_url,
              });
              setSaved(true);
              router.refresh();
              setTimeout(() => setSaved(false), 2000);
            })
          }
          disabled={pending}
          className="h-10 rounded-xl bg-gradient-to-r from-violet-500 to-green-500 px-5 text-sm font-semibold text-ink disabled:opacity-60"
        >
          {pending ? "Guardando…" : saved ? "Guardado ✓" : "Guardar"}
        </button>
      </div>
    </Card>
  );
}

export function LogosEditor({ items }: { items: CompanyLogo[] }) {
  const router = useRouter();
  const [, start] = useTransition();

  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    start(async () => {
      await reorderLogos(next.map((x) => x.id));
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-black text-fg">Empresas</h1>
          <p className="mt-1 text-sm text-fg-subtle">
            Carrousel de logos que se muestra en la home, arriba de "Sobre mí".
          </p>
        </div>
        <button
          onClick={() =>
            start(async () => {
              await createLogo();
              router.refresh();
            })
          }
          className="h-10 rounded-xl bg-gradient-to-r from-violet-500 to-green-500 px-4 text-sm font-semibold text-ink"
        >
          + Nueva empresa
        </button>
      </div>

      {items.map((logo, i) => (
        <Row
          key={logo.id}
          logo={logo}
          canUp={i > 0}
          canDown={i < items.length - 1}
          onMove={(dir) => move(i, dir)}
        />
      ))}
      {items.length === 0 ? (
        <p className="text-sm text-fg-subtle">Todavía no cargaste empresas.</p>
      ) : null}
    </div>
  );
}
