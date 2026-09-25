import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCaseBySlug, signImageUrls } from "@/lib/content";
import { hasCaseAccess } from "@/lib/access";
import { cleanInlineText } from "@/lib/sanitize";
import { Container, Eyebrow, Prose, Section } from "@/components/site/ui";
import { CaseGallery } from "@/components/site/CaseGallery";

// Per-visitor gated + per-request signed image URLs — never cached.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCaseBySlug(slug);
  if (!data) return { title: "Caso" };
  return {
    title: data.study.title,
    description: data.study.teaser ?? undefined,
    robots: { index: false, follow: false },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!(await hasCaseAccess())) {
    redirect(`/acceso?next=${encodeURIComponent(`/casos/${slug}`)}`);
  }

  const data = await getCaseBySlug(slug);
  if (!data || !data.study.published) notFound();
  const { study, images } = data;

  const urls = await signImageUrls(images.map((i) => i.storage_path));
  const gallery = images
    .map((img, i) => ({ src: urls[i], alt: img.alt }))
    .filter((g) => g.src);

  const blocks = [
    { title: study.challenge_title, body: study.challenge_body },
    { title: study.role_title, body: study.role_body },
    { title: study.decisions_title, body: study.decisions_body },
    { title: study.impact_title, body: study.impact_body },
  ];

  return (
    <Section className="pt-14 sm:pt-20">
      <Container className="max-w-3xl">
        <Link
          href="/casos"
          className="text-sm font-semibold text-fg-subtle hover:text-fg"
        >
          ← Todos los casos
        </Link>

        <header className="mt-8 border-b border-line pb-10">
          {study.client_label ? <Eyebrow>{study.client_label}</Eyebrow> : null}
          <h1 className="display mt-4 text-4xl text-fg sm:text-5xl">
            {study.title}
          </h1>
          {study.teaser ? (
            <p className="mt-5 text-lg text-fg-muted">{study.teaser}</p>
          ) : null}
          {study.highlights.length > 0 ? (
            <div className="mt-8">
              <Eyebrow>Impacto</Eyebrow>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {study.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-600/20 via-surface to-green-600/10 px-4 py-4 sm:px-5"
                  >
                    <p
                      className="text-left font-sans text-lg font-normal leading-tight text-fg [&_em]:italic [&_strong]:font-bold sm:text-xl"
                      dangerouslySetInnerHTML={{ __html: cleanInlineText(h) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </header>

        <div className="mt-12 space-y-14">
          {blocks.map((b, i) => (
            <div key={i}>
              <h2 className="font-serif text-2xl font-black text-fg">
                {b.title}
              </h2>
              <Prose html={b.body} className="mt-4" />
            </div>
          ))}
        </div>

        {gallery.length > 0 ? (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-black text-fg">
              Galería
            </h2>
            <CaseGallery images={gallery} />
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
