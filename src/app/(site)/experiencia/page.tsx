import type { Metadata } from "next";
import { getExperiences, getSiteContent } from "@/lib/content";
import { ButtonLink, Container, Eyebrow, Prose, Section } from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Experiencia",
  description: "Trayectoria profesional de Franco Zampini, UX Manager.",
};

export default async function ExperienciaPage() {
  const [experiences, profile] = await Promise.all([
    getExperiences(),
    getSiteContent("cv_profile"),
  ]);

  return (
    <Section className="pt-16 sm:pt-24">
      <Container className="max-w-3xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Eyebrow>Trayectoria</Eyebrow>
            <h1 className="display mt-6 text-5xl text-fg sm:text-6xl">
              Experiencia
            </h1>
          </div>
          <ButtonLink href="/api/cv" variant="outline" className="mt-2">
            Descargar CV (PDF)
          </ButtonLink>
        </div>

        {profile.summary ? (
          <p className="mt-8 text-lg text-fg-muted">{profile.summary}</p>
        ) : null}

        <ol className="mt-14 space-y-12 border-l border-line pl-6">
          {experiences.map((e) => (
            <li key={e.id} className="relative">
              <span
                className="absolute -left-[1.72rem] top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-violet-400 to-green-400"
                aria-hidden
              />
              <p className="text-sm text-fg-subtle">
                {e.date_from} — {e.date_to || "Actualidad"}
              </p>
              <h2 className="mt-1 font-serif text-xl font-black text-fg">
                {e.company}
              </h2>
              <p className="text-sm font-medium text-violet-300">{e.role}</p>
              {e.body ? <Prose html={e.body} className="mt-3 text-base" /> : null}
            </li>
          ))}
        </ol>

        {experiences.length === 0 ? (
          <p className="mt-10 text-fg-subtle">
            Todavía no hay experiencia cargada.
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
