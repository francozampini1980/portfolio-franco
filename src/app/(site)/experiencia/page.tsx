import type { Metadata } from "next";
import { getExperiences, getSiteContent } from "@/lib/content";
import { monthRange } from "@/lib/experience-format";
import { metaCopy, uiCopy } from "@/lib/ui-copy";
import { ButtonLink, Container, Eyebrow, Prose, Section } from "@/components/site/ui";
import { TrackedAnchor } from "@/components/site/TrackedLink";

export const metadata: Metadata = {
  title: metaCopy.experiencia.title,
  description: metaCopy.experiencia.description,
};

export default async function ExperienciaPage() {
  const [experiences, profile, contact] = await Promise.all([
    getExperiences(),
    getSiteContent("cv_profile"),
    getSiteContent("contact"),
  ]);
  const copy = uiCopy.experiencia;

  const cvHref = profile.cv_file_url
    ? `${profile.cv_file_url}?download=${encodeURIComponent(
        profile.cv_file_name || "CV.pdf",
      )}`
    : "/api/cv";

  return (
    <Section className="pt-12 sm:pt-20">
      <Container className="max-w-3xl">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1 className="type-page mt-4 text-fg">{copy.titulo}</h1>
        <p className="type-lead mt-6 text-fg-muted">{copy.bajada}</p>

        <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
          <ButtonLink
            href={cvHref}
            variant="outline"
            prefetch={false}
            track={{ event: "cv_download" }}
          >
            {copy.cv}
          </ButtonLink>
          <TrackedAnchor
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            track={{
              event: "contact_channel_click",
              props: { channel: "linkedin", location: "experiencia" },
            }}
            className="inline-flex h-11 items-center justify-center rounded-pill border border-line-strong px-6 text-sm font-semibold text-fg transition-colors hover:bg-surface"
          >
            {copy.linkedin}
          </TrackedAnchor>
        </div>

        <ol className="mt-14 space-y-12 border-l border-line pl-6">
          {experiences.map((e) => (
            <li key={e.id} className="relative">
              <span
                className="absolute -left-[1.72rem] top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-violet-400 to-green-400"
                aria-hidden
              />
              <p className="text-sm leading-[22px] text-fg-subtle">
                {monthRange(e.date_from, e.date_to)}
              </p>
              <h2 className="mt-1 font-serif text-xl font-black leading-[26px] text-fg">
                {e.company}
              </h2>
              <p className="text-sm font-medium text-violet-300">{e.role}</p>
              {e.team_label ? (
                <p className="mt-1 text-sm leading-[22px] text-fg-muted">{e.team_label}</p>
              ) : null}
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
