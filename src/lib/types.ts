export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  client_label: string | null;
  teaser: string | null;
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

export type Experience = {
  id: string;
  date_from: string;
  date_to: string | null;
  company: string;
  role: string;
  body: string;
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
  /** Public URL of the portrait shown next to the hero text. */
  portrait?: string;
};

export type RichBlock = { eyebrow: string; title: string; body: string };

export type PhilosophyBlock = {
  eyebrow: string;
  title: string;
  items: { title: string; body: string }[];
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
};

export type SiteContentMap = {
  home_hero: HomeHero;
  home_intro: RichBlock;
  about: RichBlock;
  philosophy: PhilosophyBlock;
  contact: ContactBlock;
  cv_profile: CvProfile;
};
