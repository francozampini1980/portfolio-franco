import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { signImageUrls } from "@/lib/content";
import { signBodies } from "@/lib/inline-images";
import { CaseEditor } from "@/components/admin/CaseEditor";
import type { CaseImage, CaseStudy } from "@/lib/types";

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: study } = await supabase
    .from("case_studies")
    .select("*")
    .eq("id", id)
    .single();
  if (!study) notFound();

  const { data: images } = await supabase
    .from("case_images")
    .select("*")
    .eq("case_id", id)
    .order("order_index", { ascending: true });

  const list = (images as CaseImage[]) ?? [];
  const urls = await signImageUrls(list.map((i) => i.storage_path));
  const withUrls = list.map((img, i) => ({ ...img, previewUrl: urls[i] ?? "" }));

  const signedStudy = await signBodies(study as CaseStudy, [
    "challenge_body",
    "role_body",
    "decisions_body",
    "impact_body",
  ]);

  return <CaseEditor study={signedStudy} images={withUrls} />;
}
