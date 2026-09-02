import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cookie-aware Supabase client used only for the admin session
 * (Supabase Auth magic-code login). Content reads/writes use the
 * service-role client in ./admin.ts.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — middleware refreshes the session.
          }
        },
      },
    },
  );
}

/** Returns the signed-in admin user, or null. */
export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (adminEmail && user.email?.toLowerCase() !== adminEmail) return null;
  return user;
}
