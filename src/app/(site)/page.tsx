import Link from "next/link";
import {
  getAllSiteContent,
  getCompanyLogos,
  getExperiences,
  getPublishedCases,
} from "@/lib/content";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Prose,
  Section,
  SectionHeading,
} from "@/components/site/ui";
import { CaseCard } from "@/components/site/CaseCard";
import { LogoCarousel } from "@/components/site/LogoCarousel";

export default async function HomePage() {
  const [content, cases, experiences, logos] = await Promise.all([
    getAllSiteContent(),
    getPublishedCases(),
    getExperiences(),
    getCompanyLogos(),
  ]);
  const { home_hero: hero, home_intro: intro, philosophy } = content;

  return (
    <>
      {/* Hero */}
      <Section className="pt-12 sm:pt-20">
        <Container>
          <div
            className={
              hero.portrait
                ? "grid items-center gap-10 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-16"
                : ""
            }
          >
            {hero.portrait ? (
              <div className="relative mx-auto w-52 shrink-0 sm:w-60 lg:mx-0 lg:w-full">
                <div
                  aria-hidden
                  className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-violet-600/35 to-green-600/25 blur-2xl"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.portrait}
                  alt={hero.title}
                  width={480}
                  height={640}
                  className="relative w-full rounded-3xl border border-line object-cover"
                />
              </div>
            ) : null}

            <div>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
              <h1 className="display mt-6 text-5xl text-fg sm:text-6xl lg:text-7xl">
                {hero.title}
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-relaxed text-fg-muted sm:text-2xl">
                {hero.subtitle}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href={hero.primary_cta_href}>
                  {hero.primary_cta_label}
                </ButtonLink>
                <ButtonLink href={hero.secondary_cta_href} variant="outline">
                  {hero.secondary_cta_label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Empresas */}
      <LogoCarousel logos={logos} />

      {/* Intro / Sobre mí */}
      {intro.body ? (
        <Section>
          <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <SectionHeading eyebrow={intro.eyebrow} title={intro.title} />
            <Prose html={intro.body} />
          </Container>
        </Section>
      ) : null}

      {/* Casos */}
      <Section id="casos">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Trabajo seleccionado"
              title="Casos de liderazgo"
            />
            <Link
              href="/casos"
              className="text-sm font-semibold text-violet-300 hover:text-violet-200"
            >
              Ver todos →
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {cases.map((study) => (
              <CaseCard key={study.id} study={study} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Experiencia (resumen) */}
      {experiences.length > 0 ? (
        <Section>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Trayectoria" title="Experiencia" />
              <Link
                href="/experiencia"
                className="text-sm font-semibold text-violet-300 hover:text-violet-200"
              >
                Ver CV completo →
              </Link>
            </div>
            <ul className="mt-12 divide-y divide-line border-y border-line">
              {experiences.slice(0, 4).map((e) => (
                <li
                  key={e.id}
                  className="grid gap-1 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
                >
                  <span className="text-sm text-fg-subtle">
                    {e.date_from} — {e.date_to || "Actualidad"}
                  </span>
                  <div>
                    <p className="font-serif text-lg font-bold text-fg">
                      {e.company}
                    </p>
                    <p className="text-sm text-fg-muted">{e.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* Filosofía */}
      {philosophy.items.length > 0 ? (
        <Section>
          <Container>
            <SectionHeading
              eyebrow={philosophy.eyebrow}
              title={philosophy.title}
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {philosophy.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-line bg-surface/40 p-7"
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
        </Section>
      ) : null}

      {/* Contacto CTA */}
      <Section>
        <Container>
          <div className="overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-violet-700/25 via-surface to-green-700/15 p-10 sm:p-14">
            <h2 className="display max-w-xl text-3xl text-fg sm:text-4xl">
              {content.contact.title}
            </h2>
            <p className="mt-4 max-w-lg text-fg-muted">{content.contact.body}</p>
            <div className="mt-8">
              <ButtonLink href="/contacto">Ir a contacto</ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
