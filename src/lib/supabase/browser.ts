"use client";

import { createClient } from "@supabase/supabase-js";

/** Minimal anonymous browser client, used only for direct-to-Storage
 *  uploads via short-lived signed upload URLs minted by a server action. */
export function createSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
