import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { metaCopy } from "@/lib/ui-copy";
import { Container, Eyebrow, Prose, Section } from "@/components/site/ui";

export const metadata: Metadata = {
  title: metaCopy.sobre.title,
  description: metaCopy.sobre.description,
};

const hasTags = (s: string) => /<[a-z][\s\S]*>/i.test(s);

export default async function SobrePage() {
  const [about, philosophy] = await Promise.all([
    getSiteContent("about"),
    getSiteContent("philosophy"),
  ]);

  return (
    <Section className="pt-12 sm:pt-20">
      <Container className="max-w-3xl">
        <Eyebrow>{about.eyebrow}</Eyebrow>
        <h1 className="type-page mt-4 text-fg">{about.title}</h1>
        {about.body ? (
          hasTags(about.body) ? (
            <Prose html={about.body} className="mt-6" />
          ) : (
            <p className="type-lead mt-6 text-fg-muted">{about.body}</p>
          )
        ) : null}

        <div className="mt-16 space-y-14 sm:mt-20">
          {philosophy.items.map((item) => (
            <section key={item.title}>
              <h2 className="type-section text-fg">{item.title}</h2>
              <p className="type-lead mt-4 text-fg-muted">
                {item.about_body || item.body}
              </p>
              {item.example ? (
                <p className="mt-6 border-l-2 border-violet-500 pl-5 text-base leading-[26px] text-fg">
                  {item.example}
                </p>
              ) : null}
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
