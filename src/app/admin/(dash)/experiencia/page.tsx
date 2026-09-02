import { getExperiences } from "@/lib/content";
import { ExperienciaEditor } from "@/components/admin/ExperienciaEditor";

export default async function AdminExperienciaPage() {
  const items = await getExperiences();
  return <ExperienciaEditor items={items} />;
}
