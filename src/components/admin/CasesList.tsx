"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { CaseStudy } from "@/lib/types";
import {
  createCase,
  deleteCase,
  reorderCases,
  updateCase,
} from "@/lib/admin-actions";
import { Card } from "@/components/admin/ui";

export function CasesList({ cases }: { cases: CaseStudy[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const move = (i: number, dir: -1 | 1) => {
    const next = [...cases];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    start(async () => {
      await reorderCases(next.map((c) => c.id));
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-black text-fg">Casos</h1>
        <form
          action={async (fd) => {
            const id = await createCase(fd);
            router.push(`/admin/casos/${id}`);
          }}
        >
          <input type="hidden" name="title" value="Nuevo caso" />
          <button className="h-10 rounded-xl bg-gradient-to-r from-violet-500 to-green-500 px-4 text-sm font-semibold text-ink">
            + Nuevo caso
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {cases.map((c, i) => (
          <Card key={c.id} className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col">
              <button
                onClick={() => move(i, -1)}
                disabled={pending || i === 0}
                className="text-fg-subtle hover:text-fg disabled:opacity-30"
              >
                ▲
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={pending || i === cases.length - 1}
                className="text-fg-subtle hover:text-fg disabled:opacity-30"
              >
                ▼
              </button>
            </div>
            <div className="grow">
              <p className="font-medium text-fg">{c.title}</p>
              <p className="text-xs text-fg-subtle">
                /casos/{c.slug} · {c.client_label || "sin etiqueta"}
              </p>
            </div>
            <button
              onClick={() =>
                start(async () => {
                  await updateCase(c.id, { published: !c.published });
                  router.refresh();
                })
              }
              className={`rounded-lg border px-2.5 py-1 text-xs ${
                c.published
                  ? "border-green-500/40 text-green-300"
                  : "border-line text-fg-subtle"
              }`}
            >
              {c.published ? "Publicado" : "Borrador"}
            </button>
            <Link
              href={`/admin/casos/${c.id}`}
              className="rounded-lg border border-line px-2.5 py-1 text-xs text-fg-muted hover:text-fg"
            >
              Editar
            </Link>
            <button
              onClick={() => {
                if (!confirm(`¿Borrar "${c.title}"?`)) return;
                start(async () => {
                  await deleteCase(c.id);
                  router.refresh();
                });
              }}
              className="rounded-lg border border-line px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/10"
            >
              Borrar
            </button>
          </Card>
        ))}
        {cases.length === 0 ? (
          <p className="text-sm text-fg-subtle">
            Todavía no hay casos. Creá el primero.
          </p>
        ) : null}
      </div>
    </div>
  );
}
