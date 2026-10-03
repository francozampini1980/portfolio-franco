import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCaseBySlug, getPublishedCases, signImageUrls } from "@/lib/content";
import { readingTime } from "@/lib/reading-time";
import { uiCopy } from "@/lib/ui-copy";
import { Container, Eyebrow, Prose, Section } from "@/components/site/ui";
import { CaseFacts } from "@/components/site/CaseFacts";
import { CaseGallery } from "@/components/site/CaseGallery";
import { CaseIndex } from "@/components/site/CaseIndex";
import { CaseNav } from "@/components/site/CaseNav";
import { CaseSummary } from "@/components/site/CaseSummary";
import { StatGrid } from "@/components/site/Stat";

// Imágenes firmadas por request (bucket privado): no se cachea la página (P-11).
export const dynamic = "force-dynamic";

const hasText = (html: string) => html.replace(/<[^>]*>/g, "").trim().length > 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCaseBySlug(slug);
  if (!data || !data.study.published) return { title: "Caso" };
  return {
    title: data.study.title,
    description: data.study.summary_problem || undefined,
    robots: { index: true, follow: true },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [data, published] = await Promise.all([
    getCaseBySlug(slug),
    getPublishedCases(),
  ]);
  if (!data || !data.study.published) notFound();
  const { study, images } = data;

  const urls = await signImageUrls(images.map((i) => i.storage_path));
  const gallery = images
    .map((img, i) => ({ src: urls[i], alt: img.alt }))
    .filter((g) => g.src);

  const copy = uiCopy.caso;
  const sections = [
    { id: "desafio", title: study.challenge_title || copy.secciones.desafio, body: study.challenge_body },
    { id: "aporte", title: study.role_title || copy.secciones.aporte, body: study.role_body },
    { id: "decisiones", title: study.decisions_title || copy.secciones.decisiones, body: study.decisions_body },
    { id: "resultados", title: study.impact_title || copy.secciones.resultados, body: study.impact_body },
    { id: "aprendizajes", title: study.learnings_title || copy.secciones.aprendizajes, body: study.learnings_body },
  ].filter((s) => hasText(s.body));

  const position = published.findIndex((c) => c.slug === study.slug);
  const prev = position > 0 ? published[position - 1] : null;
  const next =
    position >= 0 && position < published.length - 1 ? published[position + 1] : null;

  const eyebrow = [study.client_label, copy.lectura(readingTime(study))]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Section className="pb-12 pt-10 sm:pb-16 sm:pt-14">
        <Container>
          <Link
            href="/casos"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-fg-subtle hover:text-fg"
          >
            {copy.volver}
          </Link>

          <header className="mt-4">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="type-page mt-4 max-w-[720px] text-fg">{study.title}</h1>
            <div className="mt-8">
              <CaseFacts study={study} />
            </div>
            <div className="mt-4 sm:mt-6">
              <CaseSummary study={study} />
            </div>
            {study.stats.length > 0 ? (
              <StatGrid
                stats={study.stats.slice(0, 3)}
                className="mt-4 hidden md:grid md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
              />
            ) : null}
          </header>
        </Container>
      </Section>

      <Section className="pb-16 pt-0 sm:pb-24 sm:pt-0">
        <Container className="lg:grid lg:grid-cols-[minmax(0,720px)_160px] lg:justify-between lg:gap-12">
          <div className="space-y-12 sm:space-y-14">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 tabIndex={-1} className="type-section text-fg">
                  {s.title}
                </h2>
                <Prose html={s.body} className="prose-case mt-4" />
              </section>
            ))}

            {gallery.length > 0 ? (
              <div>
                <h2 className="type-section text-fg">{copy.galeria.titulo}</h2>
                <CaseGallery images={gallery} />
              </div>
            ) : null}
          </div>

          <aside>
            <CaseIndex
              title={copy.indice.titulo}
              items={sections.map((s) => ({ id: s.id, label: s.title }))}
            />
          </aside>
        </Container>
      </Section>

      <Section tone="alt" className="py-10 sm:py-12">
        <Container>
          <CaseNav
            fromSlug={study.slug}
            prev={prev ? { slug: prev.slug, title: prev.title } : null}
            next={next ? { slug: next.slug, title: next.title } : null}
          />
        </Container>
      </Section>
    </>
  );
}
