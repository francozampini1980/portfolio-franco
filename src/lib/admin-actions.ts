"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { getAdminUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cleanRichText } from "@/lib/sanitize";
import { packInlineImages } from "@/lib/inline-images";

/** Sanitise + normalise inline image URLs for a rich-text field. */
function cleanBody(html: string): string {
  return packInlineImages(cleanRichText(html));
}

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
      typeof v === "string" && /<[a-z][\s\S]*>/i.test(v) ? cleanBody(v) : v;
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
    if (typeof clean[f] === "string") clean[f] = cleanBody(clean[f] as string);
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
// Case images — uploaded straight from the browser to Storage via a
// short-lived signed URL, so we never route the file bytes through a
// server action (1 MB) or the serverless function body (4.5 MB) limit.
// ---------------------------------------------------------------
const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "webp", "gif", "avif"]);

export async function createCaseImageUploadUrl(caseId: string, filename: string) {
  await requireAdmin();
  const ext = (filename.split(".").pop() ?? "").toLowerCase();
  if (!IMAGE_EXTS.has(ext)) {
    throw new Error("Formato no permitido. Usá PNG, JPG, WEBP, GIF o AVIF.");
  }
  const supabase = createAdminClient();
  const path = `${caseId}/${nanoid(12)}.${ext}`;
  const { data, error } = await supabase.storage
    .from("case-images")
    .createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  return { path, token: data.token };
}

/**
 * Upload target for an image embedded *inside* rich text (not the gallery).
 * Returns a signed preview URL to show in the editor immediately; the
 * stored HTML keeps `inline:<path>` and is re-signed on every render.
 */
export async function createInlineImageUploadUrl(
  scope: string,
  filename: string,
) {
  await requireAdmin();
  const ext = (filename.split(".").pop() ?? "").toLowerCase();
  if (!IMAGE_EXTS.has(ext)) {
    throw new Error("Formato no permitido. Usá PNG, JPG, WEBP, GIF o AVIF.");
  }
  const safeScope = /^[a-z0-9-]{1,64}$/i.test(scope) ? scope : "site";
  const supabase = createAdminClient();
  const path = `${safeScope}/inline/${nanoid(12)}.${ext}`;
  const { data, error } = await supabase.storage
    .from("case-images")
    .createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  return { path, token: data.token };
}

/** Signed URL to display an already-uploaded inline image in the editor. */
export async function signInlineImagePreview(path: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from("case-images")
    .createSignedUrl(path, 60 * 60);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

/**
 * Upload target for a non-sensitive public brand asset (e.g. the home
 * portrait). Stored in a public bucket, so the returned URL is permanent.
 */
export async function createPublicAssetUploadUrl(
  prefix: string,
  filename: string,
) {
  await requireAdmin();
  const ext = (filename.split(".").pop() ?? "").toLowerCase();
  if (!IMAGE_EXTS.has(ext) && ext !== "svg") {
    throw new Error("Formato no permitido.");
  }
  const safePrefix = /^[a-z0-9-]{1,32}$/i.test(prefix) ? prefix : "misc";
  const supabase = createAdminClient();
  const path = `${safePrefix}/${nanoid(10)}.${ext}`;
  const { data, error } = await supabase.storage
    .from("public-assets")
    .createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  const {
    data: { publicUrl },
  } = supabase.storage.from("public-assets").getPublicUrl(path);
  return { path, token: data.token, publicUrl };
}

/** Upload target for the downloadable CV PDF (public bucket, PDF only). */
export async function createCvUploadUrl(filename: string) {
  await requireAdmin();
  const ext = (filename.split(".").pop() ?? "").toLowerCase();
  if (ext !== "pdf") throw new Error("Solo se permiten archivos PDF.");
  const supabase = createAdminClient();
  const path = `cv/${nanoid(10)}.pdf`;
  const { data, error } = await supabase.storage
    .from("public-assets")
    .createSignedUploadUrl(path);
  if (error) throw new Error(error.message);
  const {
    data: { publicUrl },
  } = supabase.storage.from("public-assets").getPublicUrl(path);
  return { path, token: data.token, publicUrl };
}

/** Removes a previously uploaded public-assets file, given its public URL. */
export async function deletePublicAsset(publicUrl: string) {
  await requireAdmin();
  const marker = "/object/public/public-assets/";
  const i = publicUrl.indexOf(marker);
  if (i === -1) return;
  const path = decodeURIComponent(publicUrl.slice(i + marker.length));
  const supabase = createAdminClient();
  await supabase.storage.from("public-assets").remove([path]);
}

export async function registerCaseImage(
  caseId: string,
  path: string,
  alt: string,
) {
  await requireAdmin();
  const supabase = createAdminClient();
  if (!path.startsWith(`${caseId}/`)) throw new Error("Ruta inválida.");

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
    alt: alt.slice(0, 300),
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
  if (typeof clean.body === "string") clean.body = cleanBody(clean.body);
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
// Company logos (home carousel)
// ---------------------------------------------------------------
export async function createLogo() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: max } = await supabase
    .from("company_logos")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();
  const { data, error } = await supabase
    .from("company_logos")
    .insert({ name: "Empresa", order_index: (max?.order_index ?? -1) + 1 })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidateSite();
  return data.id as string;
}

export async function updateLogo(id: string, patch: Record<string, unknown>) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("company_logos")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateSite();
}

export async function deleteLogo(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: logo } = await supabase
    .from("company_logos")
    .select("logo_url")
    .eq("id", id)
    .single();
  const { error } = await supabase.from("company_logos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (logo?.logo_url) await deletePublicAsset(logo.logo_url);
  revalidateSite();
}

export async function reorderLogos(orderedIds: string[]) {
  await requireAdmin();
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, i) =>
      supabase.from("company_logos").update({ order_index: i }).eq("id", id),
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
