import type { CaseStudy } from "@/lib/types";

const WORDS_PER_MINUTE = 200;

type ReadingFields = Pick<
  CaseStudy,
  | "challenge_body"
  | "role_body"
  | "decisions_body"
  | "impact_body"
  | "learnings_body"
  | "summary_problem"
  | "summary_decision"
  | "summary_result"
>;

function plainText(html: string): string {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function countWords(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

/** ceil(palabras / 200) sobre el texto plano de los bloques del caso; mínimo 1. */
export function readingTime(study: ReadingFields): number {
  const total = [
    study.challenge_body,
    study.role_body,
    study.decisions_body,
    study.impact_body,
    study.learnings_body,
    study.summary_problem,
    study.summary_decision,
    study.summary_result,
  ].reduce((sum, field) => sum + countWords(plainText(field)), 0);
  return Math.max(1, Math.ceil(total / WORDS_PER_MINUTE));
}
