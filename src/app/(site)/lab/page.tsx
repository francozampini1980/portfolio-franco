import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { metaCopy } from "@/lib/ui-copy";
import { Container, Eyebrow, Section } from "@/components/site/ui";
import { AgentCard } from "@/components/site/AgentCard";
import { InfoCard } from "@/components/site/InfoCard";
import { TrackedAnchor } from "@/components/site/TrackedLink";

export async function generateMetadata(): Promise<Metadata> {
  const lab = await getSiteContent("lab_page");
  return {
    title: metaCopy.lab.title,
    description: lab.subtitle || undefined,
  };
}

export default async function LabPage() {
  const lab = await getSiteContent("lab_page");

  return (
    <>
      <Section className="pb-12 pt-12 sm:pb-16 sm:pt-20">
        <Container>
          <Eyebrow>{lab.eyebrow}</Eyebrow>
          <h1 className="type-page mt-4 text-fg">{lab.title}</h1>
          <p className="type-lead mt-6 max-w-[760px] text-fg-muted">{lab.subtitle}</p>
          {lab.how.length > 0 ? (
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {lab.how.map((item) => (
                <InfoCard key={item.title} title={item.title} body={item.body} />
              ))}
            </div>
          ) : null}
        </Container>
      </Section>

      {lab.agents.length > 0 ? (
        <Section tone="alt">
          <Container>
            <Eyebrow>{lab.case_eyebrow}</Eyebrow>
            <h2 className="type-section mt-4 text-fg">{lab.case_title}</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lab.agents.map((agent) => (
                <AgentCard key={agent.number} agent={agent} />
              ))}
            </div>
            {lab.link_href ? (
              <TrackedAnchor
                href={lab.link_href}
                target="_blank"
                rel="noopener noreferrer"
                track={{ event: "lab_link_click", props: { location: "lab" } }}
                className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-violet-300 hover:text-violet-200"
              >
                {lab.link_label} →
              </TrackedAnchor>
            ) : null}
          </Container>
        </Section>
      ) : null}
    </>
  );
}
