import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { metaCopy, uiCopy } from "@/lib/ui-copy";
import { Container, Eyebrow, Section } from "@/components/site/ui";
import { ContactForm } from "@/components/site/ContactForm";
import { TrackedAnchor } from "@/components/site/TrackedLink";

export const metadata: Metadata = {
  title: metaCopy.contacto.title,
  description: metaCopy.contacto.description,
};

function linkedinHandle(url: string): string {
  try {
    return new URL(url).pathname.replace(/\/$/, "");
  } catch {
    return url;
  }
}

export default async function ContactoPage() {
  const contact = await getSiteContent("contact");
  const canales = uiCopy.contacto.canales;
  const row =
    "flex min-h-11 items-center gap-3 text-fg-muted hover:text-fg";

  return (
    <Section className="pt-12 sm:pt-20">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-14">
        <div>
          <Eyebrow>{contact.eyebrow}</Eyebrow>
          <h1 className="type-page mt-4 text-fg">{contact.title}</h1>
          <p className="type-lead mt-6 max-w-md text-fg-muted">{contact.body}</p>

          <div className="mt-8 text-sm">
            <TrackedAnchor
              href={`mailto:${contact.email}`}
              track={{
                event: "contact_channel_click",
                props: { channel: "mail", location: "contacto" },
              }}
              className={row}
            >
              <span className="w-16 text-fg-subtle">{canales.mail}</span>
              {contact.email}
            </TrackedAnchor>
            <TrackedAnchor
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              track={{
                event: "contact_channel_click",
                props: { channel: "linkedin", location: "contacto" },
              }}
              className={row}
            >
              <span className="w-16 text-fg-subtle">{canales.linkedin}</span>
              {linkedinHandle(contact.linkedin)}
            </TrackedAnchor>
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-6 sm:p-7">
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
