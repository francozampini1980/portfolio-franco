"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Anonymous browser client. Only used for direct-to-Storage uploads
 *  via short-lived signed upload URLs minted by a server action. */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
