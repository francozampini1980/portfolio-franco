import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCases } from "@/lib/content";
import { hasCaseAccess } from "@/lib/access";
import { Container, Eyebrow, Section } from "@/components/site/ui";
import { CaseCard } from "@/components/site/CaseCard";

export const metadata: Metadata = {
  title: "Casos",
  description:
    "Casos de liderazgo de UX: decisiones estratégicas, desarrollo de equipo e impacto de negocio.",
};

export default async function CasosPage() {
  const [cases, unlocked] = await Promise.all([
    getPublishedCases(),
    hasCaseAccess(),
  ]);

  return (
    <Section className="pt-16 sm:pt-24">
      <Container>
        <Eyebrow>Trabajo seleccionado</Eyebrow>
        <h1 className="display mt-6 text-5xl text-fg sm:text-6xl">
          Casos de liderazgo
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-fg-muted">
          Cada caso menciona información sensible de las empresas donde trabajé,
          por eso están protegidos con contraseña.{" "}
          {unlocked ? (
            <span className="text-green-300">Tenés acceso habilitado.</span>
          ) : (
            <Link
              href="/acceso"
              className="font-semibold text-violet-300 hover:text-violet-200"
            >
              Ingresar contraseña →
            </Link>
          )}
        </p>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {cases.map((study) => (
            <CaseCard key={study.id} study={study} unlocked={unlocked} />
          ))}
        </div>

        {cases.length === 0 ? (
          <p className="mt-14 text-fg-subtle">Todavía no hay casos publicados.</p>
        ) : null}
      </Container>
    </Section>
  );
}
