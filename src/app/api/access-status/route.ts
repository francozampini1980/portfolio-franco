import { NextResponse } from "next/server";
import { hasCaseAccess } from "@/lib/access";

export const dynamic = "force-dynamic";

export async function GET() {
  const unlocked = await hasCaseAccess().catch(() => false);
  return NextResponse.json(
    { unlocked },
    { headers: { "Cache-Control": "no-store" } },
  );
}
