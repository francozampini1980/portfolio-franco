import "server-only";
import { headers } from "next/headers";

/** IP y navegador del visitante, para el límite de envíos del formulario de contacto. */
export async function clientMeta() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    null;
  const userAgent = h.get("user-agent") || null;
  return { ip, userAgent };
}
