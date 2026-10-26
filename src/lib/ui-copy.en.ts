// Textos de interfaz en inglés. Misma forma que ui-copy.ts (TypeScript avisa si falta una clave).
import type { metaCopy, uiCopy } from "@/lib/ui-copy";

/** Igual que T pero con string en lugar de los literales de `as const`. */
type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => Widen<R>
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : { readonly [K in keyof T]: Widen<T[K]> };

export type UiCopy = Widen<typeof uiCopy>;
export type MetaCopy = Widen<typeof metaCopy>;

const FIELD_EN = { nombre: "name", correo: "email", mensaje: "message" } as const;

export const uiCopyEn: UiCopy = {
  nav: {
    logoAriaLabel: "Franco Zampini — home",
    links: [
      { href: "/casos", label: "Cases" },
      { href: "/lab", label: "Lab" },
      { href: "/experiencia", label: "Experience" },
      { href: "/sobre", label: "About" },
      { href: "/contacto", label: "Contact" },
    ],
    cta: "Get in touch",
    menuAbrirAria: "Open menu",
    menuCerrarAria: "Close menu",
    idioma: { label: "ES", aria: "Ver el sitio en español" },
  },
  footer: {
    nombre: "Franco Zampini",
    email: "francozampini@gmail.com",
    linkedin: "LinkedIn",
    casos: "Cases",
    experiencia: "Experience",
    sobre: "About",
    legal: "© 2026 Franco Zampini. Built with Next.js.",
  },
  home: {
    heroNombreMobile: "Franco Zampini",
    logos: { etiqueta: "I've led UX teams at" },
    casos: {
      eyebrow: "Leadership cases",
      titulo: "Decisions with measurable results",
      enlace: "See all cases",
    },
    experiencia: {
      eyebrow: "Career",
      titulo: "Experience",
      enlace: "See full career",
      actualidad: "present",
    },
    principios: {
      eyebrow: "How I lead",
      titulo: "Four principles",
      enlace: "See the principles",
    },
    cierre: { titulo: "Let's talk", boton: "Get in touch" },
  },
  cardCaso: {
    boton: "View case",
    lectura: (n: number) => `${n} min`,
  },
  casosListado: {
    eyebrow: "Selected work",
    titulo: "Leadership cases",
    bajada: "Six leadership decisions with their context, my role and the results.",
  },
  caso: {
    volver: "← All cases",
    lectura: (n: number) => `${n} min read`,
    ficha: {
      rol: "Role",
      empresa: "Company",
      periodo: "Period",
      equipo: "Team",
    },
    resumen: {
      problema: "The problem",
      decision: "What I decided",
      resultado: "The result",
    },
    secciones: {
      desafio: "The challenge",
      aporte: "My contribution",
      decisiones: "Key decisions",
      resultados: "Results",
      aprendizajes: "Learnings",
    },
    indice: { titulo: "In this case" },
    navegacion: { anterior: "Previous case", siguiente: "Next case" },
    galeria: { titulo: "Gallery", ampliar: "Enlarge image", cerrar: "Close" },
  },
  experiencia: {
    eyebrow: "Career",
    titulo: "Experience",
    bajada:
      "12 years leading UX teams and 16 in digital products. Here are my most recent roles.",
    cv: "Download CV (PDF)",
    linkedin: "View LinkedIn",
  },
  contacto: {
    eyebrow: "Contact",
    titulo: "Let's talk",
    canales: { mail: "Email", linkedin: "LinkedIn" },
    form: {
      nombre: "Name",
      correo: "Email",
      mensaje: "Message",
      boton: "Send message",
      botonEnviando: "Sending…",
      errorVacio: (campo: "nombre" | "correo" | "mensaje") =>
        `Please enter your ${FIELD_EN[campo]} so I can reply.`,
      errorCorreo: "Check the email: the @ or the domain is missing.",
      exito: "Thank you! I'll reply within 48 hours.",
      errorEnvio:
        "The message couldn't be sent. Try again or email me at francozampini@gmail.com.",
      errorLimite: "Too many messages in a row. Try again in a while.",
    },
  },
  lab: {
    estado: { Hecho: "Done", Próximo: "Next" },
  },
  vacio: {
    casos: "No cases published yet.",
    experiencia: "No experience added yet.",
  },
};

export const metaCopyEn: MetaCopy = {
  templateTitulo: "%s · Franco Zampini",
  home: {
    title: "Franco Zampini · UX Manager",
    description:
      "Franco Zampini, UX Manager with 12 years leading design teams. Leadership cases, design systems and experience measurement.",
  },
  casos: {
    title: "Cases",
    description:
      "UX leadership cases: experience measurement, design system, communications, team management, post-sale self-service and the in-store app.",
  },
  sobre: {
    title: "About me",
    description: "The principles I lead UX teams with, with examples from my work.",
  },
  experiencia: {
    title: "Experience",
    description:
      "12 years leading UX teams at Frávega, Payway, Mercado Pago and Despegar.",
  },
  contacto: {
    title: "Contact",
    description: "I'm looking for my next role as Head or Director of Design. Get in touch.",
  },
  lab: { title: "Lab" },
};
