import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getSiteContent } from "@/lib/content";

// Public pages are statically generated and revalidated hourly; the CMS
// also revalidates on demand after every save.
export const revalidate = 3600;

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
