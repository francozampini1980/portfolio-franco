// One-off: genera supabase/migrations/20261003_portfolio_mejoras_contenido.sql
// a partir de docs/handoff/portfolio-mejoras/05-contenido/copy.json (cms.*).
// Uso: node scripts/gen-contenido-sql.mjs
import { readFileSync, writeFileSync } from "node:fs";

const copy = JSON.parse(
  readFileSync("docs/handoff/portfolio-mejoras/05-contenido/copy.json", "utf8"),
);
const { cms } = copy;

const TAG = "$cp$";
const lit = (v) => {
  if (v === null || v === undefined) return "null";
  const s = String(v);
  if (s.includes(TAG)) throw new Error("El texto contiene el delimitador " + TAG);
  return `${TAG}${s}${TAG}`;
};
const json = (v) => `${lit(JSON.stringify(v))}::jsonb`;
const strip = (o) =>
  Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith("_")));

const out = [];
out.push(
  "-- Carga de contenido del handoff portfolio-mejoras.",
  "-- Generado por scripts/gen-contenido-sql.mjs desde copy.json (cms). No editar a mano.",
  "-- Requiere haber aplicado antes 20261003_portfolio_mejoras.sql.",
  "begin;",
  "",
  "-- ---------------- case_studies (update por slug) ----------------",
);

for (const c of cms.case_studies) {
  out.push(
    `update public.case_studies set`,
    `  client_label     = ${lit(c.client_label)},`,
    `  title            = ${lit(c.title)},`,
    `  highlights       = ${json(c.highlights)},`,
    `  summary_role     = ${lit(c.summary_role)},`,
    `  summary_company  = ${lit(c.summary_company)},`,
    `  summary_period   = ${lit(c.summary_period)},`,
    `  summary_team     = ${lit(c.summary_team)},`,
    `  summary_problem  = ${lit(c.summary_problem)},`,
    `  summary_decision = ${lit(c.summary_decision)},`,
    `  summary_result   = ${lit(c.summary_result)},`,
    `  stats            = ${json(c.stats)},`,
    `  challenge_title  = ${lit(c.challenge_title)},`,
    `  challenge_body   = ${lit(c.challenge_body_html)},`,
    `  role_title       = ${lit(c.role_title)},`,
    `  role_body        = ${lit(c.role_body_html)},`,
    `  decisions_title  = ${lit(c.decisions_title)},`,
    `  decisions_body   = ${lit(c.decisions_body_html)},`,
    `  impact_title     = ${lit(c.impact_title)},`,
    `  impact_body      = ${lit(c.impact_body_html)},`,
    `  learnings_title  = ${lit(c.learnings_title)},`,
    `  learnings_body   = ${lit(c.learnings_body_html)},`,
    `  updated_at       = now()`,
    `where slug = ${lit(c.slug)};`,
    "",
  );
}

out.push("-- ---------------- experiences (update por order_index) ----------------");
for (const e of cms.experiences) {
  out.push(
    `update public.experiences set`,
    `  company    = ${lit(e.company)},`,
    `  role       = ${lit(e.role)},`,
    `  date_from  = ${lit(e.date_from)},`,
    `  date_to    = ${lit(e.date_to)},`,
    `  team_label = ${lit(e.team_label)},`,
    `  body       = ${lit(e.body_html)},`,
    `  updated_at = now()`,
    `where order_index = ${e.order_index};`,
    "",
  );
}

out.push(
  "-- ---------------- site_content (upsert con merge de jsonb) ----------------",
  "-- data = data || nuevo: conserva claves que copy.json no define (portrait, linkedin, cv_profile).",
);
const sc = cms.site_content;
const upsert = (key, data) =>
  out.push(
    `insert into public.site_content (key, data, updated_at)`,
    `values (${lit(key)}, ${json(data)}, now())`,
    `on conflict (key) do update`,
    `  set data = public.site_content.data || excluded.data, updated_at = now();`,
    "",
  );

const hero = strip(sc.home_hero);
delete hero.portrait; // "(se mantiene el valor actual)"
upsert("home_hero", hero);

upsert("home_lab", strip(sc.home_lab));

const lab = strip(sc.lab_page);
delete lab.how_text_content;
delete lab.case_text_content;
upsert("lab_page", lab);

const philo = strip(sc.philosophy);
philo.items = sc.philosophy.items.map(strip);
upsert("philosophy", philo);

upsert("about", strip(sc.about));

const intro = strip(sc.home_intro);
intro.body = intro.body_html;
delete intro.body_html;
upsert("home_intro", intro);

const contact = strip(sc.contact);
delete contact.linkedin; // "(se mantiene el valor actual)"
upsert("contact", contact);

out.push("commit;", "");
writeFileSync("supabase/migrations/20261003_portfolio_mejoras_contenido.sql", out.join("\n"));
console.log("OK", out.length, "líneas");
