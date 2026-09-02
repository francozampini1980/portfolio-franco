import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container, Section } from "@/components/site/ui";
import {
  ACCESS_COOKIE,
  encodeAccessCookie,
  logAccessEvent,
  verifyPassword,
} from "@/lib/access";
import { AccessForm } from "@/components/site/AccessForm";

export const metadata: Metadata = {
  title: "Acceso a los casos",
  robots: { index: false, follow: false },
};

const ONE_YEAR = 60 * 60 * 24 * 365;

function safeNext(next?: string) {
  return next && next.startsWith("/casos") ? next : "/casos";
}

async function unlock(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  const version = await verifyPassword(password);
  if (!version) {
    redirect(
      `/acceso?error=1${
        next !== "/casos" ? `&next=${encodeURIComponent(next)}` : ""
      }`,
    );
  }

  const jar = await cookies();
  jar.set(ACCESS_COOKIE, encodeAccessCookie({ k: "pw", v: version, iat: Date.now() }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
  await logAccessEvent({ method: "password" });
  redirect(next);
}

export default async function AccesoPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <Section className="pt-20 sm:pt-28">
      <Container className="max-w-md">
        <p className="eyebrow">Contenido protegido</p>
        <h1 className="display mt-4 text-4xl text-fg">Acceso a los casos</h1>
        <p className="mt-5 text-fg-muted">
          Los casos incluyen información sensible de las empresas donde trabajé.
          Ingresá la contraseña que te compartí, o abrí el enlace de acceso
          directo.
        </p>

        <AccessForm action={unlock} next={next} hasError={!!error} />
      </Container>
    </Section>
  );
}
