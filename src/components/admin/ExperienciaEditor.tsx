"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Experience } from "@/lib/types";
import {
  createExperience,
  deleteExperience,
  reorderExperiences,
  updateExperience,
} from "@/lib/admin-actions";
import { Card, Label, inputClass } from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

function Row({ exp, onMove, canUp, canDown }: {
  exp: Experience;
  onMove: (dir: -1 | 1) => void;
  canUp: boolean;
  canDown: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(exp);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const set = (p: Partial<Experience>) => {
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
            if (!confirm("¿Borrar este trabajo?")) return;
            start(async () => {
              await deleteExperience(exp.id);
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
          <Label>Desde</Label>
          <input className={inputClass} value={form.date_from} onChange={(e) => set({ date_from: e.target.value })} />
        </div>
        <div>
          <Label>Hasta (vacío = «Actualidad»)</Label>
          <input className={inputClass} value={form.date_to ?? ""} onChange={(e) => set({ date_to: e.target.value })} />
        </div>
        <div>
          <Label>Empresa</Label>
          <input className={inputClass} value={form.company} onChange={(e) => set({ company: e.target.value })} />
        </div>
        <div>
          <Label>Rol</Label>
          <input className={inputClass} value={form.role} onChange={(e) => set({ role: e.target.value })} />
        </div>
      </div>
      <div className="mt-4">
        <Label>Descripción</Label>
        <RichTextEditor value={form.body} onChange={(body) => set({ body })} />
      </div>
      <div className="mt-4">
        <button
          onClick={() =>
            start(async () => {
              await updateExperience(exp.id, {
                date_from: form.date_from,
                date_to: form.date_to || null,
                company: form.company,
                role: form.role,
                body: form.body,
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

export function ExperienciaEditor({ items }: { items: Experience[] }) {
  const router = useRouter();
  const [, start] = useTransition();

  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    start(async () => {
      await reorderExperiences(next.map((x) => x.id));
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-black text-fg">Experiencia</h1>
        <button
          onClick={() =>
            start(async () => {
              await createExperience();
              router.refresh();
            })
          }
          className="h-10 rounded-xl bg-gradient-to-r from-violet-500 to-green-500 px-4 text-sm font-semibold text-ink"
        >
          + Nuevo trabajo
        </button>
      </div>

      {items.map((exp, i) => (
        <Row
          key={exp.id}
          exp={exp}
          canUp={i > 0}
          canDown={i < items.length - 1}
          onMove={(dir) => move(i, dir)}
        />
      ))}
      {items.length === 0 ? (
        <p className="text-sm text-fg-subtle">Todavía no cargaste trabajos.</p>
      ) : null}
    </div>
  );
}
