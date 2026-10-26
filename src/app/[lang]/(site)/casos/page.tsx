import type { Metadata } from "next";
import { getPublishedCases } from "@/lib/content";
import { getCopy } from "@/lib/lang-server";
import { pageAlternates } from "@/lib/seo";
import { Container, Eyebrow, Section } from "@/components/site/ui";
import { CaseCard } from "@/components/site/CaseCard";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, meta } = await getCopy();
  return {
    title: meta.casos.title,
    description: meta.casos.description,
    alternates: pageAlternates("/casos", lang),
  };
}

export default async function CasosPage() {
  const { lang, copy: ui } = await getCopy();
  const cases = await getPublishedCases(lang);
  const copy = ui.casosListado;

  return (
    <Section className="pt-12 sm:pt-20">
      <Container>
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 className="type-page mt-4 text-fg">{copy.titulo}</h1>
        <p className="type-lead mt-6 max-w-3xl text-fg-muted">{copy.bajada}</p>

        <div className="mt-12 grid items-start gap-4 md:grid-cols-2 md:gap-6">
          {cases.map((study, i) => (
            <CaseCard key={study.id} study={study} origin="casos" position={i + 1} />
          ))}
        </div>

        {cases.length === 0 ? (
          <p className="mt-12 text-fg-subtle">{ui.vacio.casos}</p>
        ) : null}
      </Container>
    </Section>
  );
}
