import Link from "next/link";

export function SiteFooter({
  email = "francozampini@gmail.com",
  linkedin = "https://www.linkedin.com/in/francozampini/",
}: {
  email?: string;
  linkedin?: string;
}) {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-serif text-xl font-black text-fg">Franco Zampini</p>
          <p className="mt-1 text-sm text-fg-subtle">
            UX Manager · Liderazgo de equipos de diseño
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
          <a href={`mailto:${email}`} className="hover:text-fg">
            {email}
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fg"
          >
            LinkedIn
          </a>
          <Link href="/casos" className="hover:text-fg">
            Casos
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-10 text-xs text-fg-subtle">
        © {new Date().getFullYear()} Franco Zampini. Hecho con Next.js.
      </div>
    </footer>
  );
}
