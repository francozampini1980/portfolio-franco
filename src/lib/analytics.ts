"use client";

import { track } from "@vercel/analytics";

type Props = Record<string, string | number>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type EventName =
  | "case_card_click"
  | "cta_contact_click"
  | "contact_channel_click"
  | "contact_form_submit"
  | "case_nav_click"
  | "cv_download"
  | "lab_link_click";

/** Envía el evento a Vercel Web Analytics y a GA4. Sin datos personales en props. */
export function trackEvent(name: EventName, props?: Props) {
  try {
    track(name, props);
  } catch {
    // la medición nunca debe romper la navegación
  }
  try {
    window.gtag?.("event", name, props);
  } catch {
    // idem
  }
}
