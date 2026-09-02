import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientMeta } from "@/lib/access";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  message: z.string().trim().min(1).max(4000),
  company: z.string().optional(), // honeypot
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisá los campos del formulario." },
      { status: 400 },
    );
  }
  const { name, email, message, company } = parsed.data;

  // Honeypot: pretend success.
  if (company && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const { ip, userAgent } = await clientMeta();
  const supabase = createAdminClient();

  // Basic rate limit: max 3 messages per IP per 10 minutes.
  if (ip) {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: "Demasiados mensajes seguidos. Probá en un rato." },
        { status: 429 },
      );
    }
  }

  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, message, ip });
  if (error) {
    return NextResponse.json(
      { error: "No se pudo guardar el mensaje." },
      { status: 500 },
    );
  }

  // Email notification (best-effort).
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (apiKey && to && from && apiKey !== "REEMPLAZAR") {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `Portfolio · mensaje de ${name}`,
        text: `Nombre: ${name}\nCorreo: ${email}\nIP: ${ip ?? "—"}\nUser-Agent: ${
          userAgent ?? "—"
        }\n\n${message}`,
      });
    } catch {
      // message is already stored; ignore email failure
    }
  }

  return NextResponse.json({ ok: true });
}
