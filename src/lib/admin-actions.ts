"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { getAdminUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanRichText } from "@/lib/sanitize";

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("No autorizado.");
  return user;
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------
// Site content blocks
// ---------------------------------------------------------------
export async function saveSiteContent(key: string, data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();

  // sanitise any html-ish string fields
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    clean[k] =
      typeof v === "string" && /<[a-z][\s\S]*>/i.test(v) ? cleanRichText(v) : v;
  }

  const { error } = await supabase
    .from("site_content")
    .upsert({ key, data: clean, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  revalidateSite();
}

// ---------------------------------------------------------------
// Case studies
// ---------------------------------------------------------------
export async function createCase(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const title = String(formData.get("title") ?? "").trim() || "Nuevo caso";
  const slugBase =
    String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `caso-${nanoid(6)}`;

  const { data: max } = await supabase
    .from("case_studies")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const { data, error } = await supabase
    .from("case_studies")
    .insert({
      title,
      slug: slugBase,
      order_index: (max?.order_index ?? -1) + 1,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidateSite();
  return data.id as string;
}

export async function updateCase(id: string, patch: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();

  const richFields = [
    "challenge_body",
    "role_body",
    "decisions_body",
    "impact_body",
  ];
  const clean = { ...patch };
  for (const f of richFields) {
    if (typeof clean[f] === "string") clean[f] = cleanRichText(clean[f] as string);
  }

  const { error } = await supabase
    .from("case_studies")
    .update({ ...clean, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function deleteCase(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  // remove images from storage
  const { data: imgs } = await supabase
    .from("case_images")
    .select("storage_path")
    .eq("case_id", id);
  if (imgs?.length) {
    await supabase.storage
      .from("case-images")
      .remove(imgs.map((i) => i.storage_path));
  }
  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function reorderCases(orderedIds: string[]) {
  await requireAdmin();
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase.from("case_studies").update({ order_index: i }).eq("id", id),
    ),
  );
  revalidateSite();
}

// ---------------------------------------------------------------
// Case images
// ---------------------------------------------------------------
export async function addCaseImage(caseId: string, formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Archivo vacío.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Máximo 8 MB por imagen.");

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${caseId}/${nanoid(10)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("case-images")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw new Error(upErr.message);

  const { data: max } = await supabase
    .from("case_images")
    .select("order_index")
    .eq("case_id", caseId)
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from("case_images").insert({
    case_id: caseId,
    storage_path: path,
    alt: String(formData.get("alt") ?? ""),
    order_index: (max?.order_index ?? -1) + 1,
  });
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function deleteCaseImage(imageId: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: img } = await supabase
    .from("case_images")
    .select("storage_path")
    .eq("id", imageId)
    .single();
  if (img) {
    await supabase.storage.from("case-images").remove([img.storage_path]);
  }
  const { error } = await supabase.from("case_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function reorderCaseImages(orderedIds: string[]) {
  await requireAdmin();
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase.from("case_images").update({ order_index: i }).eq("id", id),
    ),
  );
  revalidateSite();
}

// ---------------------------------------------------------------
// Experience
// ---------------------------------------------------------------
export async function createExperience() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: max } = await supabase
    .from("experiences")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const { data, error } = await supabase
    .from("experiences")
    .insert({
      date_from: "2024",
      date_to: null,
      company: "Empresa",
      role: "Rol",
      order_index: (max?.order_index ?? -1) + 1,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidateSite();
  return data.id as string;
}

export async function updateExperience(id: string, patch: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();
  const clean = { ...patch };
  if (typeof clean.body === "string") clean.body = cleanRichText(clean.body);
  const { error } = await supabase
    .from("experiences")
    .update({ ...clean, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function reorderExperiences(orderedIds: string[]) {
  await requireAdmin();
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase.from("experiences").update({ order_index: i }).eq("id", id),
    ),
  );
  revalidateSite();
}

// ---------------------------------------------------------------
// Access: password + token links
// ---------------------------------------------------------------
export async function setCasePassword(formData: FormData) {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  if (password.length < 6) throw new Error("Mínimo 6 caracteres.");
  const supabase = createAdminClient();
  const { error } = await supabase.rpc("set_access_password", {
    new_password: password,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/accesos");
}

export async function createAccessLink(formData: FormData) {
  await requireAdmin();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) throw new Error("Poné una etiqueta (ej. la empresa).");
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("access_links")
    .insert({ label, token: nanoid(24) });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/accesos");
}

export async function toggleAccessLink(id: string, revoked: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("access_links")
    .update({ revoked })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/accesos");
}

export async function deleteAccessLink(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("access_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/accesos");
}

// ---------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------
export async function markMessageRead(id: string, read: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ read })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/mensajes");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/mensajes");
}
