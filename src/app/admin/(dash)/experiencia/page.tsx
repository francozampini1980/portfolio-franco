import { getExperiences } from "@/lib/content";
import { signInlineImages } from "@/lib/inline-images";
import { ExperienciaEditor } from "@/components/admin/ExperienciaEditor";

export default async function AdminExperienciaPage() {
  const items = await getExperiences();
  const signed = await Promise.all(
    items.map(async (e) => ({ ...e, body: await signInlineImages(e.body) })),
  );
  return <ExperienciaEditor items={signed} />;
}
