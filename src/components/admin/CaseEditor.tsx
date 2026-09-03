"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { CaseImage, CaseStudy } from "@/lib/types";
import {
  createCaseImageUploadUrl,
  deleteCaseImage,
  registerCaseImage,
  reorderCaseImages,
  updateCase,
} from "@/lib/admin-actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card, Label, inputClass } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type Props = {
  study: CaseStudy;
  images: (CaseImage & { previewUrl: string })[];
};

export function CaseEditor({ study, images }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(study);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const set = (patch: Partial<CaseStudy>) => {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
  };

  const save = () =>
    start(async () => {
      await updateCase(study.id, {
        title: form.title,
        slug: form.slug,
        client_label: form.client_label,
        teaser: form.teaser,
        published: form.published,
        challenge_title: form.challenge_title,
        challenge_body: form.challenge_body,
        role_title: form.role_title,
        role_body: form.role_body,
        decisions_title: form.decisions_title,
        decisions_body: form.decisions_body,
        impact_title: form.impact_title,
        impact_body: form.impact_body,
      });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    });

  const blocks: [keyof CaseStudy, keyof CaseStudy][] = [
    ["challenge_title", "challenge_body"],
    ["role_title", "role_body"],
    ["decisions_title", "decisions_body"],
    ["impact_title", "impact_body"],
  ];

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const file = fd.get("file") as File | null;
    const alt = String(fd.get("alt") ?? "");
    if (!file || file.size === 0) return;
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("La imagen supera los 10 MB. Comprimila o redimensionala.");
      return;
    }
    setUploadError("");
    setUploading(true);
    try {
      const { path, token } = await createCaseImageUploadUrl(study.id, file.name);
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.storage
        .from("case-images")
        .uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (error) throw new Error(error.message);
      await registerCaseImage(study.id, path, alt);
      formEl.reset();
      router.refresh();
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "No se pudo subir la imagen.",
      );
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (i: number, dir: -1 | 1) => {
    const next = [...images];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    start(async () => {
      await reorderCaseImages(next.map((x) => x.id));
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin/casos")}
          className="text-sm text-fg-subtle hover:text-fg"
        >
          ← Casos
        </button>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-fg-muted">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set({ published: e.target.checked })}
            />
            Publicado
          </label>
          <button
            onClick={save}
            disabled={pending}
            className="h-10 rounded-xl bg-gradient-to-r from-violet-500 to-green-500 px-5 text-sm font-semibold text-ink disabled:opacity-60"
          >
            {pending ? "Guardando…" : saved ? "Guardado ✓" : "Guardar"}
          </button>
        </div>
      </div>

      <Card title="Portada de la tarjeta">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Título</Label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => set({ title: e.target.value })}
            />
          </div>
          <div>
            <Label>Slug (URL)</Label>
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => set({ slug: e.target.value })}
            />
          </div>
          <div>
            <Label>Etiqueta (rubro · equipo)</Label>
            <input
              className={inputClass}
              value={form.client_label ?? ""}
              onChange={(e) => set({ client_label: e.target.value })}
              placeholder="FINTECH · EQUIPO DE 8"
            />
          </div>
          <div>
            <Label>Frase teaser (visible en la tarjeta bloqueada)</Label>
            <input
              className={inputClass}
              value={form.teaser ?? ""}
              onChange={(e) => set({ teaser: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {blocks.map(([tk, bk], i) => (
        <Card key={i}>
          <Label>Título de la sección</Label>
          <input
            className={inputClass}
            value={form[tk] as string}
            onChange={(e) => set({ [tk]: e.target.value } as Partial<CaseStudy>)}
          />
          <div className="mt-4">
            <Label>Contenido</Label>
            <RichTextEditor
              value={form[bk] as string}
              onChange={(html) =>
                set({ [bk]: html } as Partial<CaseStudy>)
              }
            />
          </div>
        </Card>
      ))}

      <Card title="Galería de imágenes">
        <form onSubmit={handleUpload} className="flex flex-wrap items-end gap-3">
          <div>
            <Label>Imagen (JPG, PNG, WEBP · máx 10 MB)</Label>
            <input
              type="file"
              name="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              required
              disabled={uploading}
              className="text-sm text-fg-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-fg-muted"
            />
          </div>
          <div className="grow">
            <Label>Texto alternativo (opcional)</Label>
            <input className={inputClass} name="alt" placeholder="Descripción para accesibilidad" />
          </div>
          <button
            disabled={uploading}
            className="h-[42px] rounded-xl border border-line-strong px-4 text-sm font-semibold text-fg hover:bg-surface disabled:opacity-60"
          >
            {uploading ? "Subiendo…" : "Subir"}
          </button>
        </form>
        {uploadError ? (
          <p className="mt-2 text-sm text-red-400">{uploadError}</p>
        ) : null}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {images.map((img, i) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt={img.alt}
                className="h-40 w-full object-cover"
              />
              <div className="flex items-center gap-2 p-2 text-xs">
                <span className="text-fg-subtle">#{i + 1}</span>
                <button
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  className="text-fg-subtle hover:text-fg disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveImage(i, 1)}
                  disabled={i === images.length - 1}
                  className="text-fg-subtle hover:text-fg disabled:opacity-30"
                >
                  ▼
                </button>
                <button
                  onClick={() => {
                    if (!confirm("¿Borrar imagen?")) return;
                    start(async () => {
                      await deleteCaseImage(img.id);
                      router.refresh();
                    });
                  }}
                  className="ml-auto text-red-400 hover:underline"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
          {images.length === 0 ? (
            <p className="text-sm text-fg-subtle">Sin imágenes todavía.</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
