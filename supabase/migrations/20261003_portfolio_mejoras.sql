-- case_studies: ficha, resumen, números y aprendizajes  [DISEÑO 11:137] [CONTENT]
alter table public.case_studies
  add column if not exists summary_role     text not null default '',
  add column if not exists summary_company  text,              -- null = no se muestra (caso 4)
  add column if not exists summary_period   text not null default '',
  add column if not exists summary_team     text not null default '',
  add column if not exists summary_problem  text not null default '',
  add column if not exists summary_decision text not null default '',
  add column if not exists summary_result   text not null default '',
  add column if not exists stats            jsonb not null default '[]'::jsonb, -- [{value,label}] máx. 3
  add column if not exists learnings_title  text not null default 'Aprendizajes',
  add column if not exists learnings_body   text not null default '';

-- experiences: tamaño de equipo  [CONTENT decisión A] [DISEÑO Anot. 7]
alter table public.experiences
  add column if not exists team_label text;
