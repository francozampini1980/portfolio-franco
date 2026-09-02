import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { Container, Eyebrow, Section } from "@/components/site/ui";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribile a Franco Zampini para hablar de equipos de UX.",
};

export default async function ContactoPage() {
  const contact = await getSiteContent("contact");

  return (
    <Section className="pt-16 sm:pt-24">
      <Container className="grid gap-14 lg:grid-cols-2">
        <div>
          <Eyebrow>{contact.eyebrow}</Eyebrow>
          <h1 className="display mt-6 text-5xl text-fg sm:text-6xl">
            {contact.title}
          </h1>
          <p className="mt-6 max-w-md text-lg text-fg-muted">{contact.body}</p>

          <div className="mt-10 space-y-3 text-sm">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 text-fg-muted hover:text-fg"
            >
              <span className="text-fg-subtle">Mail</span>
              {contact.email}
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-fg-muted hover:text-fg"
            >
              <span className="text-fg-subtle">LinkedIn</span>
              /in/francozampini
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface/50 p-7">
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
