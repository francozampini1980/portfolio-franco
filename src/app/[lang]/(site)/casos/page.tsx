import type { Metadata } from "next";
import { getPublishedCases } from "@/lib/content";
import { metaCopy, uiCopy } from "@/lib/ui-copy";
import { Container, Eyebrow, Section } from "@/components/site/ui";
import { CaseCard } from "@/components/site/CaseCard";

export const metadata: Metadata = {
  title: metaCopy.casos.title,
  description: metaCopy.casos.description,
};

export default async function CasosPage() {
  const cases = await getPublishedCases();
  const copy = uiCopy.casosListado;

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
          <p className="mt-12 text-fg-subtle">Todavía no hay casos publicados.</p>
        ) : null}
      </Container>
    </Section>
  );
}
