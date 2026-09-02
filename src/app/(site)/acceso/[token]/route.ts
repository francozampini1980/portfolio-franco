import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ACCESS_COOKIE, clientMeta, encodeAccessCookie } from "@/lib/access";

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const supabase = createAdminClient();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data: link } = await supabase
    .from("access_links")
    .select("id, label, revoked")
    .eq("token", token)
    .single();

  if (!link || link.revoked) {
    return NextResponse.redirect(new URL("/acceso?error=link", base));
  }

  const { ip, userAgent } = await clientMeta();
  await Promise.all([
    supabase.rpc("bump_access_link", { p_link_id: link.id }),
    supabase.from("access_events").insert({
      method: "link",
      link_id: link.id,
      link_label: link.label,
      ip,
      user_agent: userAgent,
    }),
  ]);

  const res = NextResponse.redirect(new URL("/casos", base));
  res.cookies.set(
    ACCESS_COOKIE,
    encodeAccessCookie({ k: "lk", v: link.id, iat: Date.now() }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR,
    },
  );
  return res;
}
