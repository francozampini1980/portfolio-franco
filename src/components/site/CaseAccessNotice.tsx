"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Static-page-friendly access hint: checks the visitor's cookie via a
 *  tiny dynamic endpoint after hydration, so the page itself stays static. */
export function CaseAccessNotice() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/access-status")
      .then((r) => r.json())
      .then((d) => {
        if (alive) setUnlocked(!!d.unlocked);
      })
      .catch(() => {
        if (alive) setUnlocked(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (unlocked === null) return null;
  if (unlocked) {
    return <span className="text-green-300">Tenés acceso habilitado.</span>;
  }
  return (
    <Link
      href="/acceso"
      className="font-semibold text-violet-300 hover:text-violet-200"
    >
      Ingresar contraseña →
    </Link>
  );
}
