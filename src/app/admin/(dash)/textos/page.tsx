import { getAllSiteContent } from "@/lib/content";
import { signInlineImages } from "@/lib/inline-images";
import { TextosEditor } from "@/components/admin/TextosEditor";

export default async function TextosPage() {
  const content = await getAllSiteContent();
  content.home_intro.body = await signInlineImages(content.home_intro.body);
  content.about.body = await signInlineImages(content.about.body);
  return <TextosEditor content={content} />;
}
