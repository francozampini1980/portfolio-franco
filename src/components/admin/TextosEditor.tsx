"use client";

import { useState, useTransition } from "react";
import type { SiteContentMap } from "@/lib/types";
import { saveSiteContent } from "@/lib/admin-actions";
import { Card, Label, inputClass } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

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

      {/* INTRO */}
      <RichBlockCard
        title="Home · Introducción / Sobre mí"
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
                placeholder="Descripción"
                value={item.body}
                onChange={(e) => {
                  const items = [...philo.value.items];
                  items[i] = { ...items[i], body: e.target.value };
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
