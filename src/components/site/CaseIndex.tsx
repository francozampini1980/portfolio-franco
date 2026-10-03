"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Item = { id: string; label: string };

/** Índice lateral del caso: sticky desde lg, marca la sección visible y mueve el foco al h2 al hacer clic. */
export function CaseIndex({ title, items }: { title: string; items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const idsKey = items.map((i) => i.id).join(",");

  useEffect(() => {
    const ids = idsKey ? idsKey.split(",") : [];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = ids.find((id) => visible.has(id));
        if (first) setActive(first);
      },
      { rootMargin: "-96px 0px -55% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey]);

  function go(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const section = document.getElementById(id);
    if (!section) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    section.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  }

  return (
    <nav
      aria-label={title}
      className="sticky top-24 hidden w-40 rounded-card border border-line p-4 lg:block"
    >
      <p className="eyebrow">{title}</p>
      <ul className="mt-3 space-y-1">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => go(e, item.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block py-1 text-sm leading-[22px] transition-colors",
                  isActive
                    ? "text-violet-300"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
