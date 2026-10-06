"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { CaseImage, CaseStudy } from "@/lib/types";
import {
  createCaseImageUploadUrl,
  createCaseThumbUploadUrl,
  deleteCaseImage,
  registerCaseImage,
  reorderCaseImages,
  updateCase,
} from "@/lib/admin-actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { THUMB_BUCKET, THUMB_EXTS, THUMB_MAX_BYTES, thumbUrl } from "@/lib/thumbs";
import { adminCopy } from "@/lib/ui-copy";
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
  // Vista previa de la card: la imagen elegida se sube recién al guardar.
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [thumbRemoved, setThumbRemoved] = useState(false);
  const [thumbError, setThumbError] = useState("");
  const thumbCopy = adminCopy.vistaPrevia;
  const thumbShown =
    thumbPreview ?? (thumbRemoved ? null : thumbUrl(form.thumb_path));

  const pickThumb = (file: File | null) => {
    setThumbError("");
    if (!file) return;
    const ext = (file.name.split(".").pop() ?? "").toLowerCase();
    if (!(THUMB_EXTS as readonly string[]).includes(ext)) {
      setThumbError("Formato no permitido. Usá JPG, PNG o WEBP.");
      return;
    }
    if (file.size > THUMB_MAX_BYTES) {
      setThumbError("La imagen supera los 2 MB. Comprimila o redimensionala.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setThumbFile(file);
      setThumbPreview(String(reader.result));
      setThumbRemoved(false);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const removeThumb = () => {
    setThumbFile(null);
    setThumbPreview(null);
    setThumbRemoved(true);
    setThumbError("");
    setSaved(false);
  };

  const set = (patch: Partial<CaseStudy>) => {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
  };

  const save = () =>
    start(async () => {
      // thumb_path solo viaja si cambió: así guardar no depende de la columna cuando no se toca la imagen.
      let thumbPatch: { thumb_path: string | null } | Record<string, never> = {};
      if (thumbFile) {
        try {
          const { path, token } = await createCaseThumbUploadUrl(
            study.id,
            thumbFile.name,
            thumbFile.size,
          );
          const supabase = createSupabaseBrowserClient();
          const { error } = await supabase.storage
            .from(THUMB_BUCKET)
            .uploadToSignedUrl(path, token, thumbFile, {
              contentType: thumbFile.type,
            });
          if (error) throw new Error(error.message);
          thumbPatch = { thumb_path: path };
        } catch (err) {
          setThumbError(
            err instanceof Error ? err.message : "No se pudo subir la imagen.",
          );
          return;
        }
      } else if (thumbRemoved) {
        thumbPatch = { thumb_path: null };
      }
      await updateCase(study.id, {
        ...thumbPatch,
        title: form.title,
        slug: form.slug,
        client_label: form.client_label,
        teaser: form.teaser,
        highlights: form.highlights,
        published: form.published,
        challenge_title: form.challenge_title,
        challenge_body: form.challenge_body,
        role_title: form.role_title,
        role_body: form.role_body,
        decisions_title: form.decisions_title,
        decisions_body: form.decisions_body,
        impact_title: form.impact_title,
        impact_body: form.impact_body,
        summary_role: form.summary_role,
        summary_company: form.summary_company?.trim() ? form.summary_company : null,
        summary_period: form.summary_period,
        summary_team: form.summary_team,
        summary_problem: form.summary_problem,
        summary_decision: form.summary_decision,
        summary_result: form.summary_result,
        stats: form.stats,
        learnings_title: form.learnings_title,
        learnings_body: form.learnings_body,
      });
      if ("thumb_path" in thumbPatch) {
        setForm((f) => ({ ...f, thumb_path: thumbPatch.thumb_path ?? null }));
        setThumbFile(null);
        setThumbPreview(null);
        setThumbRemoved(false);
      }
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    });

  const blocks: [keyof CaseStudy, keyof CaseStudy][] = [
    ["challenge_title", "challenge_body"],
    ["role_title", "role_body"],
    ["decisions_title", "decisions_body"],
    ["impact_title", "impact_body"],
    ["learnings_title", "learnings_body"],
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
            <Label>Frase teaser (la plantilla actual del caso ya no la muestra)</Label>
            <input
              className={inputClass}
              value={form.teaser ?? ""}
              onChange={(e) => set({ teaser: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4">
          <Label>
            Métricas de la tarjeta (píldoras; la tarjeta muestra las 2 primeras,
            ej. &quot;+40% conversión&quot;)
          </Label>
          <div className="space-y-2">
            {form.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="grow">
                  <RichTextEditor
                    value={h}
                    compact
                    placeholder="+40% conversión"
                    onChange={(html) => {
                      const highlights = [...form.highlights];
                      highlights[i] = html;
                      set({ highlights });
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    set({
                      highlights: form.highlights.filter((_, x) => x !== i),
                    })
                  }
                  className="mt-1 shrink-0 rounded-lg border border-line px-2 py-1 text-xs text-red-400"
                >
                  Quitar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set({ highlights: [...form.highlights, ""] })}
              className="rounded-lg border border-line px-3 py-1.5 text-xs text-fg-muted hover:text-fg"
            >
              + Agregar métrica
            </button>
          </div>
        </div>
      </Card>

      <Card title={thumbCopy.label}>
        <p className="text-sm text-fg-muted">{thumbCopy.ayuda}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              pickThumb(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
            aria-label={thumbCopy.label}
            className="text-sm text-fg-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-fg-muted"
          />
          {thumbShown ? (
            <button
              type="button"
              onClick={removeThumb}
              className="rounded-lg border border-line px-3 py-1.5 text-xs text-red-400"
            >
              {thumbCopy.quitar}
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-fg-subtle">JPG, PNG o WEBP · máx 2 MB</p>
        {thumbError ? (
          <p role="alert" className="mt-2 text-sm text-red-400">
            {thumbError}
          </p>
        ) : null}
        {thumbShown ? (
          <div className="mt-5 flex flex-wrap items-start gap-6">
            {[
              { name: "Desktop", width: 508 },
              { name: "Mobile", width: 286 },
            ].map((v) => (
              <figure key={v.name} className="max-w-full">
                <figcaption className="mb-2 text-xs text-fg-subtle">{v.name}</figcaption>
                <div
                  style={{ width: v.width }}
                  className="h-[180px] max-w-full overflow-hidden rounded-t-xl border border-b-0 border-line-strong"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbShown}
                    alt=""
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </figure>
            ))}
          </div>
        ) : null}
      </Card>

      <Card title="Ficha y resumen del caso">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Rol</Label>
            <input
              className={inputClass}
              value={form.summary_role}
              onChange={(e) => set({ summary_role: e.target.value })}
            />
          </div>
          <div>
            <Label>Empresa (vacío = no se muestra)</Label>
            <input
              className={inputClass}
              value={form.summary_company ?? ""}
              onChange={(e) => set({ summary_company: e.target.value })}
            />
          </div>
          <div>
            <Label>Período</Label>
            <input
              className={inputClass}
              value={form.summary_period}
              onChange={(e) => set({ summary_period: e.target.value })}
            />
          </div>
          <div>
            <Label>Equipo</Label>
            <input
              className={inputClass}
              value={form.summary_team}
              onChange={(e) => set({ summary_team: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <Label>El problema</Label>
            <textarea
              rows={4}
              className={inputClass}
              value={form.summary_problem}
              onChange={(e) => set({ summary_problem: e.target.value })}
            />
          </div>
          <div>
            <Label>Lo que decidí</Label>
            <textarea
              rows={4}
              className={inputClass}
              value={form.summary_decision}
              onChange={(e) => set({ summary_decision: e.target.value })}
            />
          </div>
          <div>
            <Label>El resultado</Label>
            <textarea
              rows={4}
              className={inputClass}
              value={form.summary_result}
              onChange={(e) => set({ summary_result: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card title="Números del encabezado (hasta 3, solo desktop)">
        <div className="space-y-2">
          {form.stats.map((s, i) => (
            <div key={i} className="flex items-start gap-2">
              <input
                className={`${inputClass} max-w-[9rem]`}
                placeholder="x2"
                value={s.value}
                onChange={(e) => {
                  const stats = [...form.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  set({ stats });
                }}
              />
              <input
                className={inputClass}
                placeholder="velocidad de los equipos de desarrollo"
                value={s.label}
                onChange={(e) => {
                  const stats = [...form.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  set({ stats });
                }}
              />
              <button
                type="button"
                onClick={() =>
                  set({ stats: form.stats.filter((_, x) => x !== i) })
                }
                className="mt-1 shrink-0 rounded-lg border border-line px-2 py-1 text-xs text-red-400"
              >
                Quitar
              </button>
            </div>
          ))}
          {form.stats.length < 3 ? (
            <button
              type="button"
              onClick={() =>
                set({ stats: [...form.stats, { value: "", label: "" }] })
              }
              className="rounded-lg border border-line px-3 py-1.5 text-xs text-fg-muted hover:text-fg"
            >
              + Agregar número
            </button>
          ) : null}
          {form.stats.length === 0 ? (
            <p className="text-xs text-fg-subtle">
              Sin números: la fila no se muestra en el caso.
            </p>
          ) : null}
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
              imageScope={study.id}
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
