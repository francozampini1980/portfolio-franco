"use client";

import { useRef, useState, useTransition } from "react";
import type { SiteContentMap } from "@/lib/types";
import {
  createCvUploadUrl,
  createPublicAssetUploadUrl,
  deletePublicAsset,
  saveSiteContent,
} from "@/lib/admin-actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Card, Label, inputClass } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

function PortraitField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErr("Máximo 10 MB.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const { path, token, publicUrl } = await createPublicAssetUploadUrl(
        "home",
        file.name,
      );
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.storage
        .from("public-assets")
        .uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (error) throw new Error(error.message);
      onChange(`${publicUrl}?v=${Date.now()}`);
    } catch {
      setErr("No se pudo subir la imagen.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label>Foto (columna izquierda del encabezado)</Label>
      <div className="flex items-start gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Foto de la home"
            className="h-24 w-20 rounded-lg border border-line object-cover"
          />
        ) : (
          <div className="flex h-24 w-20 items-center justify-center rounded-lg border border-dashed border-line text-xs text-fg-subtle">
            sin foto
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => ref.current?.click()}
            className="h-9 rounded-lg border border-line px-3 text-sm text-fg-muted hover:text-fg disabled:opacity-60"
          >
            {busy ? "Subiendo…" : value ? "Cambiar foto" : "Subir foto"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-left text-xs text-red-400 hover:underline"
            >
              Quitar
            </button>
          ) : null}
          <input
            ref={ref}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            hidden
            onChange={pick}
          />
        </div>
      </div>
      {err ? <p className="mt-1 text-sm text-red-400">{err}</p> : null}
      <p className="mt-1 text-xs text-fg-subtle">
        Se muestra en formato vertical (~3:4). Si la dejás vacía, el título ocupa
        todo el ancho.
      </p>
    </div>
  );
}

function CvFileField({
  url,
  name,
  onChange,
}: {
  url: string;
  name: string;
  onChange: (patch: { cv_file_url: string; cv_file_name: string }) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErr("Tiene que ser un archivo PDF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErr("Máximo 10 MB.");
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const { path, token, publicUrl } = await createCvUploadUrl(file.name);
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.storage
        .from("public-assets")
        .uploadToSignedUrl(path, token, file, { contentType: "application/pdf" });
      if (error) throw new Error(error.message);
      const previousUrl = url;
      onChange({ cv_file_url: publicUrl, cv_file_name: file.name });
      if (previousUrl) deletePublicAsset(previousUrl).catch(() => {});
    } catch {
      setErr("No se pudo subir el archivo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label>Archivo del CV</Label>
      <div className="flex flex-wrap items-center gap-3">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-line px-3 py-1.5 text-sm text-violet-300 hover:text-violet-200"
          >
            {name || "Ver PDF actual"}
          </a>
        ) : (
          <span className="text-sm text-fg-subtle">
            Sin archivo — el botón &quot;Descargar CV&quot; usa el PDF autogenerado.
          </span>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={() => ref.current?.click()}
          className="h-9 rounded-lg border border-line px-3 text-sm text-fg-muted hover:text-fg disabled:opacity-60"
        >
          {busy ? "Subiendo…" : url ? "Reemplazar PDF" : "Subir PDF"}
        </button>
        {url ? (
          <button
            type="button"
            onClick={() => {
              deletePublicAsset(url).catch(() => {});
              onChange({ cv_file_url: "", cv_file_name: "" });
            }}
            className="text-sm text-red-400 hover:underline"
          >
            Quitar
          </button>
        ) : null}
        <input
          ref={ref}
          type="file"
          accept="application/pdf"
          hidden
          onChange={pick}
        />
      </div>
      {err ? <p className="mt-1 text-sm text-red-400">{err}</p> : null}
    </div>
  );
}

function SaveButton({
  onClick,
  pending,
  saved,
}: {
  onClick: () => void;
  pending: boolean;
  saved: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="h-10 rounded-xl bg-gradient-to-r from-violet-500 to-green-500 px-5 text-sm font-semibold text-ink disabled:opacity-60"
    >
      {pending ? "Guardando…" : saved ? "Guardado ✓" : "Guardar"}
    </button>
  );
}

function ListEditor<T>({
  label,
  items,
  onChange,
  make,
  max,
  addLabel,
  children,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  make: () => T;
  max?: number;
  addLabel: string;
  children: (item: T, update: (patch: Partial<T>) => void, i: number) => React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-line bg-ink/30 p-3">
            <div className="space-y-2">
              {children(
                item,
                (patch) => {
                  const next = [...items];
                  next[i] = { ...next[i], ...patch };
                  onChange(next);
                },
                i,
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, x) => x !== i))}
              className="mt-2 rounded-lg border border-line px-2 py-1 text-xs text-red-400"
            >
              Quitar
            </button>
          </div>
        ))}
        {max === undefined || items.length < max ? (
          <button
            type="button"
            onClick={() => onChange([...items, make()])}
            className="rounded-lg border border-line px-3 py-1.5 text-xs text-fg-muted hover:text-fg"
          >
            {addLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {rows ? (
        <textarea
          rows={rows}
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function useBlock<T>(key: keyof SiteContentMap, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const save = () =>
    start(async () => {
      await saveSiteContent(key, value as Record<string, unknown>);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  const set = (patch: Partial<T>) => {
    setValue((v) => ({ ...v, ...patch }));
    setSaved(false);
  };
  return { value, set, setValue, save, pending, saved };
}

export function TextosEditor({ content }: { content: SiteContentMap }) {
  const hero = useBlock("home_hero", content.home_hero);
  const intro = useBlock("home_intro", content.home_intro);
  const homeLab = useBlock("home_lab", content.home_lab);
  const labPage = useBlock("lab_page", content.lab_page);
  const about = useBlock("about", content.about);
  const philo = useBlock("philosophy", content.philosophy);
  const contact = useBlock("contact", content.contact);
  const cv = useBlock("cv_profile", content.cv_profile);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-black text-fg">Textos del sitio</h1>

      {/* HERO */}
      <Card title="Home · Encabezado">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Bajada superior (eyebrow)</Label>
            <input
              className={inputClass}
              value={hero.value.eyebrow}
              onChange={(e) => hero.set({ eyebrow: e.target.value })}
            />
          </div>
          <div>
            <Label>Título</Label>
            <input
              className={inputClass}
              value={hero.value.title}
              onChange={(e) => hero.set({ title: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <Label>Subtítulo</Label>
          <textarea
            rows={3}
            className={inputClass}
            value={hero.value.subtitle}
            onChange={(e) => hero.set({ subtitle: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <TextField
            label="Disponibilidad (píldora debajo de la bajada)"
            value={hero.value.availability}
            onChange={(availability) => hero.set({ availability })}
          />
        </div>
        <div className="mt-4">
          <ListEditor
            label="Números del encabezado (hasta 4)"
            items={hero.value.stats}
            max={4}
            addLabel="+ Agregar número"
            make={() => ({ value: "", label: "" })}
            onChange={(stats) => hero.set({ stats })}
          >
            {(s, update) => (
              <>
                <input
                  className={inputClass}
                  placeholder="12 años"
                  value={s.value}
                  onChange={(e) => update({ value: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="liderando equipos de UX"
                  value={s.label}
                  onChange={(e) => update({ label: e.target.value })}
                />
              </>
            )}
          </ListEditor>
        </div>
        <div className="mt-4">
          <PortraitField
            value={hero.value.portrait ?? ""}
            onChange={(portrait) => hero.set({ portrait })}
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Botón principal · texto</Label>
            <input
              className={inputClass}
              value={hero.value.primary_cta_label}
              onChange={(e) => hero.set({ primary_cta_label: e.target.value })}
            />
          </div>
          <div>
            <Label>Botón principal · enlace</Label>
            <input
              className={inputClass}
              value={hero.value.primary_cta_href}
              onChange={(e) => hero.set({ primary_cta_href: e.target.value })}
            />
          </div>
          <div>
            <Label>Botón secundario · texto</Label>
            <input
              className={inputClass}
              value={hero.value.secondary_cta_label}
              onChange={(e) =>
                hero.set({ secondary_cta_label: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Botón secundario · enlace</Label>
            <input
              className={inputClass}
              value={hero.value.secondary_cta_href}
              onChange={(e) =>
                hero.set({ secondary_cta_href: e.target.value })
              }
            />
          </div>
        </div>
        <div className="mt-5">
          <SaveButton onClick={hero.save} pending={hero.pending} saved={hero.saved} />
        </div>
      </Card>

      {/* HOME LAB */}
      <Card title="Home · Sección Lab">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Bajada superior"
            value={homeLab.value.eyebrow}
            onChange={(eyebrow) => homeLab.set({ eyebrow })}
          />
          <TextField
            label="Título"
            value={homeLab.value.title}
            onChange={(title) => homeLab.set({ title })}
          />
          <TextField
            label="Enlace · texto"
            value={homeLab.value.link_label}
            onChange={(link_label) => homeLab.set({ link_label })}
          />
          <TextField
            label="Enlace · destino"
            value={homeLab.value.link_href}
            onChange={(link_href) => homeLab.set({ link_href })}
          />
        </div>
        <div className="mt-4">
          <TextField
            label="Texto"
            rows={3}
            value={homeLab.value.body}
            onChange={(body) => homeLab.set({ body })}
          />
        </div>
        <div className="mt-4">
          <TextField
            label="Caja de pasos · título"
            value={homeLab.value.card_eyebrow}
            onChange={(card_eyebrow) => homeLab.set({ card_eyebrow })}
          />
        </div>
        <div className="mt-4">
          <ListEditor
            label="Pasos"
            items={homeLab.value.steps}
            addLabel="+ Agregar paso"
            make={() => ({ title: "", body: "" })}
            onChange={(steps) => homeLab.set({ steps })}
          >
            {(s, update) => (
              <>
                <input
                  className={inputClass}
                  placeholder="Título del paso"
                  value={s.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Descripción"
                  value={s.body}
                  onChange={(e) => update({ body: e.target.value })}
                />
              </>
            )}
          </ListEditor>
        </div>
        <div className="mt-5">
          <SaveButton onClick={homeLab.save} pending={homeLab.pending} saved={homeLab.saved} />
        </div>
      </Card>

      {/* LAB PAGE */}
      <Card title="Página Lab">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Bajada superior"
            value={labPage.value.eyebrow}
            onChange={(eyebrow) => labPage.set({ eyebrow })}
          />
          <TextField
            label="Título"
            value={labPage.value.title}
            onChange={(title) => labPage.set({ title })}
          />
        </div>
        <div className="mt-4">
          <TextField
            label="Bajada"
            rows={2}
            value={labPage.value.subtitle}
            onChange={(subtitle) => labPage.set({ subtitle })}
          />
        </div>
        <div className="mt-4">
          <ListEditor
            label="Cómo funciona (tarjetas)"
            items={labPage.value.how}
            addLabel="+ Agregar tarjeta"
            make={() => ({ title: "", body: "" })}
            onChange={(how) => labPage.set({ how })}
          >
            {(h, update) => (
              <>
                <input
                  className={inputClass}
                  placeholder="Título"
                  value={h.title}
                  onChange={(e) => update({ title: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Texto"
                  value={h.body}
                  onChange={(e) => update({ body: e.target.value })}
                />
              </>
            )}
          </ListEditor>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Caso real · bajada superior"
            value={labPage.value.case_eyebrow}
            onChange={(case_eyebrow) => labPage.set({ case_eyebrow })}
          />
          <TextField
            label="Caso real · título"
            value={labPage.value.case_title}
            onChange={(case_title) => labPage.set({ case_title })}
          />
        </div>
        <div className="mt-4">
          <ListEditor
            label="Agentes"
            items={labPage.value.agents}
            addLabel="+ Agregar agente"
            make={() => ({ number: "", title: "", body: "", status: "Próximo" as const })}
            onChange={(agents) => labPage.set({ agents })}
          >
            {(a, update) => (
              <>
                <div className="flex gap-2">
                  <input
                    className={`${inputClass} max-w-[5rem]`}
                    placeholder="01"
                    value={a.number}
                    onChange={(e) => update({ number: e.target.value })}
                  />
                  <input
                    className={inputClass}
                    placeholder="Título"
                    value={a.title}
                    onChange={(e) => update({ title: e.target.value })}
                  />
                  <select
                    className={`${inputClass} max-w-[9rem]`}
                    value={a.status}
                    onChange={(e) =>
                      update({ status: e.target.value as "Hecho" | "Próximo" })
                    }
                  >
                    <option value="Hecho">Hecho</option>
                    <option value="Próximo">Próximo</option>
                  </select>
                </div>
                <input
                  className={inputClass}
                  placeholder="Descripción"
                  value={a.body}
                  onChange={(e) => update({ body: e.target.value })}
                />
              </>
            )}
          </ListEditor>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Enlace a la presentación · texto"
            value={labPage.value.link_label}
            onChange={(link_label) => labPage.set({ link_label })}
          />
          <TextField
            label="Enlace a la presentación · URL (vacío = no se muestra)"
            value={labPage.value.link_href ?? ""}
            onChange={(link_href) => labPage.set({ link_href: link_href.trim() ? link_href : null })}
          />
        </div>
        <div className="mt-5">
          <SaveButton onClick={labPage.save} pending={labPage.pending} saved={labPage.saved} />
        </div>
      </Card>

      {/* INTRO */}
      <RichBlockCard
        title="Home · Introducción (hoy no se muestra en el sitio)"
        block={intro}
      />

      {/* ABOUT */}
      <RichBlockCard title="Página Sobre · Filosofía de liderazgo" block={about} />

      {/* PHILOSOPHY */}
      <Card title="Principios de liderazgo">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Bajada superior</Label>
            <input
              className={inputClass}
              value={philo.value.eyebrow}
              onChange={(e) => philo.set({ eyebrow: e.target.value })}
            />
          </div>
          <div>
            <Label>Título</Label>
            <input
              className={inputClass}
              value={philo.value.title}
              onChange={(e) => philo.set({ title: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {philo.value.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-line bg-ink/30 p-3"
            >
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="Título del principio"
                  value={item.title}
                  onChange={(e) => {
                    const items = [...philo.value.items];
                    items[i] = { ...items[i], title: e.target.value };
                    philo.set({ items });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    philo.set({
                      items: philo.value.items.filter((_, x) => x !== i),
                    })
                  }
                  className="rounded-lg border border-line px-2 text-xs text-red-400"
                >
                  Quitar
                </button>
              </div>
              <textarea
                rows={2}
                className={`${inputClass} mt-2`}
                placeholder="Descripción corta (home)"
                value={item.body}
                onChange={(e) => {
                  const items = [...philo.value.items];
                  items[i] = { ...items[i], body: e.target.value };
                  philo.set({ items });
                }}
              />
              <textarea
                rows={3}
                className={`${inputClass} mt-2`}
                placeholder="Texto completo (página Sobre)"
                value={item.about_body ?? ""}
                onChange={(e) => {
                  const items = [...philo.value.items];
                  items[i] = { ...items[i], about_body: e.target.value };
                  philo.set({ items });
                }}
              />
              <input
                className={`${inputClass} mt-2`}
                placeholder="En la práctica: ejemplo (página Sobre)"
                value={item.example ?? ""}
                onChange={(e) => {
                  const items = [...philo.value.items];
                  items[i] = { ...items[i], example: e.target.value };
                  philo.set({ items });
                }}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              philo.set({
                items: [...philo.value.items, { title: "", body: "" }],
              })
            }
            className="rounded-lg border border-line px-3 py-1.5 text-xs text-fg-muted hover:text-fg"
          >
            + Agregar principio
          </button>
        </div>
        <div className="mt-5">
          <SaveButton
            onClick={philo.save}
            pending={philo.pending}
            saved={philo.saved}
          />
        </div>
      </Card>

      {/* CONTACT */}
      <Card title="Contacto">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Bajada superior</Label>
            <input
              className={inputClass}
              value={contact.value.eyebrow}
              onChange={(e) => contact.set({ eyebrow: e.target.value })}
            />
          </div>
          <div>
            <Label>Título</Label>
            <input
              className={inputClass}
              value={contact.value.title}
              onChange={(e) => contact.set({ title: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <Label>Texto</Label>
          <textarea
            rows={2}
            className={inputClass}
            value={contact.value.body}
            onChange={(e) => contact.set({ body: e.target.value })}
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Email</Label>
            <input
              className={inputClass}
              value={contact.value.email}
              onChange={(e) => contact.set({ email: e.target.value })}
            />
          </div>
          <div>
            <Label>LinkedIn (URL)</Label>
            <input
              className={inputClass}
              value={contact.value.linkedin}
              onChange={(e) => contact.set({ linkedin: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-5">
          <SaveButton
            onClick={contact.save}
            pending={contact.pending}
            saved={contact.saved}
          />
        </div>
      </Card>

      {/* CV PROFILE */}
      <Card title="Datos para el CV (PDF)">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Nombre</Label>
            <input
              className={inputClass}
              value={cv.value.name}
              onChange={(e) => cv.set({ name: e.target.value })}
            />
          </div>
          <div>
            <Label>Título profesional</Label>
            <input
              className={inputClass}
              value={cv.value.headline}
              onChange={(e) => cv.set({ headline: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <input
              className={inputClass}
              value={cv.value.email}
              onChange={(e) => cv.set({ email: e.target.value })}
            />
          </div>
          <div>
            <Label>Ubicación</Label>
            <input
              className={inputClass}
              value={cv.value.location}
              onChange={(e) => cv.set({ location: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>LinkedIn (URL)</Label>
            <input
              className={inputClass}
              value={cv.value.linkedin}
              onChange={(e) => cv.set({ linkedin: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <Label>Resumen / perfil</Label>
          <textarea
            rows={3}
            className={inputClass}
            value={cv.value.summary}
            onChange={(e) => cv.set({ summary: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <CvFileField
            url={cv.value.cv_file_url ?? ""}
            name={cv.value.cv_file_name ?? ""}
            onChange={(patch) => cv.set(patch)}
          />
        </div>
        <div className="mt-5">
          <SaveButton onClick={cv.save} pending={cv.pending} saved={cv.saved} />
        </div>
      </Card>
    </div>
  );
}

function RichBlockCard({
  title,
  block,
}: {
  title: string;
  block: ReturnType<typeof useBlock<{ eyebrow: string; title: string; body: string }>>;
}) {
  return (
    <Card title={title}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Bajada superior</Label>
          <input
            className={inputClass}
            value={block.value.eyebrow}
            onChange={(e) => block.set({ eyebrow: e.target.value })}
          />
        </div>
        <div>
          <Label>Título</Label>
          <input
            className={inputClass}
            value={block.value.title}
            onChange={(e) => block.set({ title: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-4">
        <Label>Contenido</Label>
        <RichTextEditor
          value={block.value.body}
          onChange={(body) => block.set({ body })}
        />
      </div>
      <div className="mt-5">
        <SaveButton
          onClick={block.save}
          pending={block.pending}
          saved={block.saved}
        />
      </div>
    </Card>
  );
}
