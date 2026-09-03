import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * Uptime + keep-warm endpoint. A hit here every few minutes (e.g. from
 * UptimeRobot) both alerts on downtime and resets Supabase's free-tier
 * 7-day auto-pause timer.
 */
export async function GET() {
  const startedAt = Date.now();
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("site_settings")
      .select("id")
      .eq("id", 1)
      .single();
    if (error) throw error;
    return NextResponse.json(
      { status: "ok", db: "up", ms: Date.now() - startedAt },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        db: "down",
        message: e instanceof Error ? e.message : "unknown",
        ms: Date.now() - startedAt,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
