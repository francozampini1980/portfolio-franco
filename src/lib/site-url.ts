/**
 * Canonical site origin, resolved in this order:
 *  1. NEXT_PUBLIC_SITE_URL (set once the real domain exists)
 *  2. Vercel's production URL / current deployment URL
 *  3. localhost for dev
 * Always returns a valid absolute URL with no trailing slash.
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const withProto = raw.startsWith("http") ? raw : `https://${raw}`;
    try {
      return new URL(withProto).origin;
    } catch {
      /* try next */
    }
  }
  return "http://localhost:3000";
}
