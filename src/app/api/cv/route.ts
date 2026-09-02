import { NextResponse } from "next/server";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import React from "react";
import { getExperiences, getSiteContent } from "@/lib/content";
import { cleanRichText } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

const V = "#6d28d9";
const INK = "#1a1523";
const MUTED = "#4b4460";

const s = StyleSheet.create({
  page: { paddingVertical: 48, paddingHorizontal: 54, fontSize: 10, color: INK, fontFamily: "Helvetica" },
  name: { fontFamily: "Times-Bold", fontSize: 24, color: INK },
  headline: { fontFamily: "Times-Roman", fontSize: 12, color: V, marginTop: 2 },
  contact: { fontSize: 9, color: MUTED, marginTop: 6 },
  summary: { marginTop: 14, lineHeight: 1.5, color: MUTED },
  hr: { borderBottomWidth: 1, borderBottomColor: "#e6e1ef", marginVertical: 18 },
  sectionTitle: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    color: INK,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  job: { marginBottom: 14 },
  jobHead: { flexDirection: "row", justifyContent: "space-between" },
  company: { fontFamily: "Helvetica-Bold", fontSize: 11, color: INK },
  dates: { fontSize: 9, color: MUTED },
  role: { fontSize: 10, color: V, marginTop: 1, marginBottom: 4 },
  body: { lineHeight: 1.5, color: MUTED },
});

function htmlToLines(html: string): string[] {
  const clean = cleanRichText(html);
  return clean
    .replace(/<\/(p|li|h2|h3|blockquote)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function GET() {
  const [profile, experiences] = await Promise.all([
    getSiteContent("cv_profile"),
    getExperiences(),
  ]);

  const h = React.createElement;

  const doc = h(
    Document,
    { title: `CV ${profile.name}`, author: profile.name },
    h(
      Page,
      { size: "A4", style: s.page },
      h(Text, { style: s.name }, profile.name),
      h(Text, { style: s.headline }, profile.headline),
      h(
        Text,
        { style: s.contact },
        [profile.email, profile.linkedin, profile.location].filter(Boolean).join("   ·   "),
      ),
      profile.summary ? h(Text, { style: s.summary }, profile.summary) : null,
      h(View, { style: s.hr }),
      h(Text, { style: s.sectionTitle }, "Experiencia"),
      ...experiences.map((e, i) =>
        h(
          View,
          { key: i, style: s.job, wrap: false },
          h(
            View,
            { style: s.jobHead },
            h(Text, { style: s.company }, e.company),
            h(Text, { style: s.dates }, `${e.date_from} — ${e.date_to || "Actualidad"}`),
          ),
          h(Text, { style: s.role }, e.role),
          ...htmlToLines(e.body).map((line, j) =>
            h(Text, { key: j, style: s.body }, line),
          ),
        ),
      ),
    ),
  );

  const buffer = await renderToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="CV ${profile.name}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
