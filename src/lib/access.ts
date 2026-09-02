import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export const ACCESS_COOKIE = "pf_case_access";

type Payload =
  | { k: "pw"; v: string; iat: number }
  | { k: "lk"; v: string; iat: number };

function secret() {
  const s = process.env.ACCESS_COOKIE_SECRET;
  if (!s) throw new Error("Falta ACCESS_COOKIE_SECRET en el entorno.");
  return s;
}

function sign(data: string) {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

export function encodeAccessCookie(payload: Payload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeAccessCookie(raw: string | undefined): Payload | null {
  if (!raw) return null;
  const [body, sig] = raw.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
  } catch {
    return null;
  }
}

/**
 * Whether the current visitor may read protected case-study content.
 * Re-checks the DB every call so revoking a link / rotating the password
 * kills access immediately.
 */
export async function hasCaseAccess(): Promise<boolean> {
  const jar = await cookies();
  const payload = decodeAccessCookie(jar.get(ACCESS_COOKIE)?.value);
  if (!payload) return false;

  const supabase = createAdminClient();

  if (payload.k === "pw") {
    const { data } = await supabase
      .from("site_settings")
      .select("access_password_version")
      .eq("id", 1)
      .single();
    return !!data && String(data.access_password_version) === payload.v;
  }

  // link
  const { data } = await supabase
    .from("access_links")
    .select("id, revoked")
    .eq("id", payload.v)
    .single();
  return !!data && data.revoked === false;
}

export async function clientMeta() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null;
  const userAgent = h.get("user-agent") || null;
  return { ip, userAgent };
}

export async function logAccessEvent(entry: {
  method: "password" | "link";
  linkId?: string | null;
  linkLabel?: string | null;
}) {
  const { ip, userAgent } = await clientMeta();
  const supabase = createAdminClient();
  await supabase.from("access_events").insert({
    method: entry.method,
    link_id: entry.linkId ?? null,
    link_label: entry.linkLabel ?? null,
    ip,
    user_agent: userAgent,
  });
}

/** Verifies the global case password via the DB (bcrypt). */
export async function verifyPassword(candidate: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("verify_access_password", {
    candidate,
  });
  if (error || data == null) return null;
  return String(data);
}
