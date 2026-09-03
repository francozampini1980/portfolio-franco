import type { Metadata } from "next";
import { getPublishedCases } from "@/lib/content";
import { Container, Eyebrow, Section } from "@/components/site/ui";
import { CaseCard } from "@/components/site/CaseCard";
import { CaseAccessNotice } from "@/components/site/CaseAccessNotice";

export const metadata: Metadata = {
  title: "Casos",
  description:
    "Casos de liderazgo de UX: decisiones estratégicas, desarrollo de equipo e impacto de negocio.",
};

export default async function CasosPage() {
  const cases = await getPublishedCases();

  return (
    <Section className="pt-16 sm:pt-24">
      <Container>
        <Eyebrow>Trabajo seleccionado</Eyebrow>
        <h1 className="display mt-6 text-5xl text-fg sm:text-6xl">
          Casos de liderazgo
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-fg-muted">
          Cada caso menciona información sensible de las empresas donde trabajé,
          por eso están protegidos con contraseña. <CaseAccessNotice />
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {cases.map((study) => (
            <CaseCard key={study.id} study={study} />
          ))}
        </div>

        {cases.length === 0 ? (
          <p className="mt-14 text-fg-subtle">Todavía no hay casos publicados.</p>
        ) : null}
      </Container>
    </Section>
  );
}
