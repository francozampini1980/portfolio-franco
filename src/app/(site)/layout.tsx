import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await getSiteContent("contact");
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter email={contact.email} linkedin={contact.linkedin} />
    </div>
  );
}
