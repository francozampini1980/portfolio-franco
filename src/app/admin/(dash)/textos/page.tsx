import { getAllSiteContent } from "@/lib/content";
import { TextosEditor } from "@/components/admin/TextosEditor";

export default async function TextosPage() {
  const content = await getAllSiteContent();
  return <TextosEditor content={content} />;
}
