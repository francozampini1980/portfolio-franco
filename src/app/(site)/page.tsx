import { cn } from "@/lib/cn";
import {
  getAllSiteContent,
  getCompanyLogos,
  getExperiences,
  getPublishedCases,
} from "@/lib/content";
import { teamLabelShort, yearRange } from "@/lib/experience-format";
import { uiCopy } from "@/lib/ui-copy";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
  TextLink,
} from "@/components/site/ui";
import { AvailabilityPill } from "@/components/site/AvailabilityPill";
import { CaseCard } from "@/components/site/CaseCard";
import { InfoCard } from "@/components/site/InfoCard";
import { LabSteps } from "@/components/site/LabSteps";
import { LogoTile } from "@/components/site/LogoTile";
import { StatGrid } from "@/components/site/Stat";

export default async function HomePage() {
  const [content, cases, experiences, logos] = await Promise.all([
    getAllSiteContent(),
    getPublishedCases(),
    getExperiences(),
    getCompanyLogos(),
  ]);
  const { home_hero: hero, home_lab: lab, philosophy, contact } = content;
  const copy = uiCopy.home;
  const logoItems = logos.filter((l) => l.logo_url);

  return (
    <>
      {/* Hero */}
      <Section className="pb-12 pt-10 sm:pb-16 sm:pt-16">
        <Container>
          <div
            className={cn(
              hero.portrait &&
                "grid grid-cols-[56px_1fr] items-center gap-x-4 gap-y-6 lg:grid-cols-[1fr_264px] lg:items-start lg:gap-x-12 lg:gap-y-6",
            )}
          >
            {hero.portrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.portrait}
                alt={hero.portrait_alt ?? ""}
                width={480}
                height={640}
                className="h-14 w-14 rounded-full object-cover lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:aspect-[3/4] lg:h-auto lg:w-full lg:rounded-card lg:border lg:border-line"
              />
            ) : null}

            <div
              className={cn(
                hero.portrait &&
                  "flex flex-col justify-center lg:col-start-1 lg:row-start-1",
              )}
            >
              {hero.portrait ? (
                <p className="text-sm font-semibold leading-[22px] text-fg lg:hidden">
                  {copy.heroNombreMobile}
                </p>
              ) : null}
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </div>

            <div
              className={cn(
                !hero.portrait && "mt-6",
                hero.portrait &&
                  "col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-2",
              )}
            >
              <h1 className="type-hero text-fg">{hero.title}</h1>
              <p className="type-lead mt-6 max-w-2xl text-fg-muted">
                {hero.subtitle}
              </p>
              <div className="mt-6">
                <AvailabilityPill text={hero.availability} />
              </div>
              <div className="mt-6 flex gap-3 sm:gap-4">
                <ButtonLink href={hero.primary_cta_href} fullWidthOnMobile>
                  {hero.primary_cta_label}
                </ButtonLink>
                <ButtonLink
                  href={hero.secondary_cta_href}
                  variant="outline"
                  fullWidthOnMobile
                  track={{ event: "cta_contact_click", props: { location: "hero" } }}
                >
                  {hero.secondary_cta_label}
                </ButtonLink>
              </div>
            </div>
          </div>

          {hero.stats.length > 0 ? (
            <StatGrid
              stats={hero.stats}
              className="mt-12 grid-cols-2 sm:mt-16 lg:grid-cols-4"
            />
          ) : null}
        </Container>
      </Section>

      {/* Logos */}
      {logoItems.length > 0 ? (
        <Section tone="alt" className="py-12 sm:py-12">
          <Container>
            <p className="eyebrow text-center">{copy.logos.etiqueta}</p>
            <ul className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-6">
              {logoItems.map((logo) => (
                <li key={logo.id}>
                  <LogoTile logo={logo} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* Casos */}
      {cases.length > 0 ? (
        <Section id="casos">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-x-4">
              <SectionHeading
                eyebrow={copy.casos.eyebrow}
                title={copy.casos.titulo}
              />
              <TextLink href="/casos">{copy.casos.enlace} →</TextLink>
            </div>
            <div className="mt-10 grid items-start gap-4 sm:mt-12 md:grid-cols-2 md:gap-6">
              {cases.map((study, i) => (
                <CaseCard key={study.id} study={study} origin="home" position={i + 1} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Lab */}
      {lab.title ? (
        <Section tone="alt">
          <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>{lab.eyebrow}</Eyebrow>
              <h2 className="type-section mt-4 text-fg">{lab.title}</h2>
              <p className="type-lead mt-6 text-fg-muted">{lab.body}</p>
              <TextLink
                href={lab.link_href}
                className="mt-4"
                track={{ event: "lab_link_click", props: { location: "home" } }}
              >
                {lab.link_label} →
              </TextLink>
            </div>
            <LabSteps eyebrow={lab.card_eyebrow} steps={lab.steps} />
          </Container>
        </Section>
      ) : null}

      {/* Experiencia (resumen) */}
      {experiences.length > 0 ? (
        <Section>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-x-4">
              <SectionHeading
                eyebrow={copy.experiencia.eyebrow}
                title={copy.experiencia.titulo}
              />
              <TextLink href="/experiencia">{copy.experiencia.enlace} →</TextLink>
            </div>
            <ul className="mt-10 divide-y divide-line border-y border-line sm:mt-12">
              {experiences.slice(0, 4).map((e) => {
                const years = yearRange(e.date_from, e.date_to);
                const team = teamLabelShort(e.team_label);
                return (
                  <li
                    key={e.id}
                    className="grid gap-1 py-6 md:grid-cols-[10rem_1fr_auto] md:items-center md:gap-8"
                  >
                    <span className="hidden text-sm leading-[22px] text-fg-subtle md:block">
                      {years}
                    </span>
                    <div>
                      <p className="font-serif text-lg font-black leading-[26px] text-fg">
                        {e.company}
                      </p>
                      <p className="text-sm leading-[22px] text-fg-muted">
                        {e.role}
                        <span className="md:hidden">
                          {" · "}
                          {years}
                          {team ? ` · ${team}` : null}
                        </span>
                      </p>
                    </div>
                    {team ? (
                      <span className="hidden text-sm leading-[22px] text-fg-subtle md:block">
                        {team}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      ) : null}

      {/* Principios */}
      {philosophy.items.length > 0 ? (
        <Section tone="alt">
          <Container>
            <SectionHeading
              eyebrow={copy.principios.eyebrow}
              title={copy.principios.titulo}
            />
            <div className="mt-10 grid gap-3 sm:mt-12 md:grid-cols-2 md:gap-4 lg:grid-cols-4">
              {philosophy.items.map((item, i) => (
                <InfoCard
                  key={item.title}
                  number={String(i + 1).padStart(2, "0")}
                  title={item.title}
                  body={item.body}
                  compactOnMobile
                />
              ))}
            </div>
            <TextLink href="/sobre" className="mt-6">
              {copy.principios.enlace} →
            </TextLink>
          </Container>
        </Section>
      ) : null}

      {/* Cierre */}
      <Section>
        <Container className="max-w-3xl text-center">
          <h2 className="type-section text-fg">{copy.cierre.titulo}</h2>
          <p className="type-lead mt-6 text-fg-muted">{contact.body}</p>
          <div className="mt-8 flex">
            <ButtonLink
              href="/contacto"
              className="mx-auto max-sm:w-full"
              track={{ event: "cta_contact_click", props: { location: "cierre" } }}
            >
              {copy.cierre.boton}
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
