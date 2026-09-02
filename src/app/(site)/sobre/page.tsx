import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { Container, Eyebrow, Prose, Section } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Filosofía de liderazgo de Franco Zampini, UX Manager.",
};

export default async function SobrePage() {
  const [about, philosophy] = await Promise.all([
    getSiteContent("about"),
    getSiteContent("philosophy"),
  ]);

  return (
    <Section className="pt-16 sm:pt-24">
      <Container className="max-w-3xl">
        <Eyebrow>{about.eyebrow}</Eyebrow>
        <h1 className="display mt-6 text-5xl text-fg sm:text-6xl">
          {about.title}
        </h1>
        <Prose html={about.body} className="mt-10" />
      </Container>

      {philosophy.items.length > 0 ? (
        <Container className="mt-20 max-w-3xl">
          <h2 className="font-serif text-2xl font-black text-fg">
            {philosophy.title}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {philosophy.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-line bg-surface/40 p-6"
              >
                <p className="font-serif text-lg font-black text-fg">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      ) : null}
    </Section>
  );
}
