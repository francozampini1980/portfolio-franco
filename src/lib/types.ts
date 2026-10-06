export type CaseStat = { value: string; label: string };

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  client_label: string | null;
  teaser: string | null;
  /** Short quantitative pills shown below the teaser, e.g. "+40% conversión". */
  highlights: string[];
  order_index: number;
  published: boolean;
  challenge_title: string;
  challenge_body: string;
  role_title: string;
  role_body: string;
  decisions_title: string;
  decisions_body: string;
  impact_title: string;
  impact_body: string;
  summary_role: string;
  /** null = the fact sheet hides the company (e.g. confidential case). */
  summary_company: string | null;
  summary_period: string;
  summary_team: string;
  summary_problem: string;
  summary_decision: string;
  summary_result: string;
  /** Up to 3 headline numbers shown in the case header. */
  stats: CaseStat[];
  learnings_title: string;
  learnings_body: string;
  /** Ruta en el bucket público `case-thumbs`; null = la card se ve solo con texto. */
  thumb_path: string | null;
  created_at: string;
  updated_at: string;
};

export type CaseImage = {
  id: string;
  case_id: string;
  storage_path: string;
  alt: string;
  order_index: number;
  created_at: string;
};

export type CompanyLogo = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: string;
  date_from: string;
  date_to: string | null;
  company: string;
  role: string;
  body: string;
  /** e.g. "Equipo de hasta 14 personas." */
  team_label: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type AccessLink = {
  id: string;
  token: string;
  label: string;
  revoked: boolean;
  created_at: string;
  last_used_at: string | null;
  use_count: number;
};

export type AccessEvent = {
  id: string;
  method: "password" | "link";
  link_id: string | null;
  link_label: string | null;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  ip: string | null;
  read: boolean;
  created_at: string;
};

// ---- site_content shapes (data jsonb) ----

export type HomeHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  availability: string;
  stats: CaseStat[];
  /** Public URL of the portrait shown next to the hero text. */
  portrait?: string;
  portrait_alt?: string;
};

export type RichBlock = { eyebrow: string; title: string; body: string };

export type HomeIntro = RichBlock & { link_label?: string };

export type HomeLab = {
  eyebrow: string;
  title: string;
  body: string;
  link_label: string;
  link_href: string;
  card_eyebrow: string;
  steps: { title: string; body: string }[];
};

export type LabAgent = {
  number: string;
  title: string;
  body: string;
  status: "Hecho" | "Próximo";
};

export type LabPage = {
  eyebrow: string;
  title: string;
  subtitle: string;
  how: { title: string; body: string }[];
  case_eyebrow: string;
  case_title: string;
  agents: LabAgent[];
  link_label: string;
  link_href: string | null;
};

export type PhilosophyItem = {
  title: string;
  body: string;
  about_body?: string;
  example?: string;
};

export type PhilosophyBlock = {
  eyebrow: string;
  title: string;
  items: PhilosophyItem[];
};

export type ContactBlock = {
  eyebrow: string;
  title: string;
  body: string;
  email: string;
  linkedin: string;
};

export type CvProfile = {
  name: string;
  headline: string;
  summary: string;
  email: string;
  linkedin: string;
  location: string;
  /** Public URL of the uploaded CV PDF (falls back to the auto-generated one). */
  cv_file_url?: string;
  /** Original filename, used for the downloaded file's name. */
  cv_file_name?: string;
};

export type SiteContentMap = {
  home_hero: HomeHero;
  home_intro: HomeIntro;
  home_lab: HomeLab;
  lab_page: LabPage;
  about: RichBlock;
  philosophy: PhilosophyBlock;
  contact: ContactBlock;
  cv_profile: CvProfile;
};
