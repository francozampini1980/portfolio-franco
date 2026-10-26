import Link from "next/link";
import { localizePath } from "@/lib/i18n";
import { getCopy } from "@/lib/lang-server";
import { uiCopy } from "@/lib/ui-copy";
import { TrackedAnchor } from "@/components/site/TrackedLink";

export async function SiteFooter({
  email = uiCopy.footer.email,
  linkedin = "https://www.linkedin.com/in/francozampini/",
}: {
  email?: string;
  linkedin?: string;
}) {
  const { lang, copy } = await getCopy();
  const f = copy.footer;
  const link = "inline-flex min-h-11 min-w-11 items-center hover:text-fg";
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold leading-[22px] text-fg">{f.nombre}</p>
          <p className="mt-1 text-xs leading-[18px] text-fg-subtle">{f.legal}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 text-sm text-fg-muted">
          <TrackedAnchor
            href={`mailto:${email}`}
            track={{
              event: "contact_channel_click",
              props: { channel: "mail", location: "footer" },
            }}
            className={link}
          >
            {email}
          </TrackedAnchor>
          <TrackedAnchor
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            track={{
              event: "contact_channel_click",
              props: { channel: "linkedin", location: "footer" },
            }}
            className={link}
          >
            {f.linkedin}
          </TrackedAnchor>
          <Link href={localizePath("/casos", lang)} className={link}>
            {f.casos}
          </Link>
          <Link href={localizePath("/experiencia", lang)} className={link}>
            {f.experiencia}
          </Link>
          <Link href={localizePath("/sobre", lang)} className={link}>
            {f.sobre}
          </Link>
        </div>
      </div>
    </footer>
  );
}
