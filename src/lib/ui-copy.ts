// Textos de interfaz que no edita el CMS. Fuente: docs/handoff/portfolio-mejoras/05-contenido/copy.json (ui, meta).
// No escribir strings sueltos en los componentes: agregarlos acá.

export const uiCopy = {
  nav: {
    logoAriaLabel: "Franco Zampini — inicio",
    links: [
      { href: "/casos", label: "Casos" },
      { href: "/lab", label: "Lab" },
      { href: "/experiencia", label: "Experiencia" },
      { href: "/sobre", label: "Sobre" },
      { href: "/contacto", label: "Contacto" },
    ],
    cta: "Escribime",
    menuAbrirAria: "Abrir menú",
    menuCerrarAria: "Cerrar menú",
  },
  footer: {
    nombre: "Franco Zampini · UX Manager",
    email: "francozampini@gmail.com",
    linkedin: "LinkedIn",
    casos: "Casos",
    legal: "© 2026 Franco Zampini. Hecho con Next.js.",
  },
  home: {
    heroNombreMobile: "Franco Zampini",
    logos: { etiqueta: "Lideré equipos de UX en" },
    casos: {
      eyebrow: "Casos de liderazgo",
      titulo: "Decisiones con resultados medibles",
      enlace: "Ver todos los casos",
    },
    experiencia: {
      eyebrow: "Trayectoria",
      titulo: "Experiencia",
      enlace: "Ver trayectoria completa",
      actualidad: "actualidad",
    },
    principios: {
      eyebrow: "Cómo lidero",
      titulo: "Cuatro principios",
      enlace: "Ver los principios con ejemplos",
    },
    cierre: { titulo: "Conversemos", boton: "Escribime" },
  },
  cardCaso: {
    boton: "Ver caso",
    lectura: (n: number) => `${n} min`,
  },
  casosListado: {
    eyebrow: "Trabajo seleccionado",
    titulo: "Casos de liderazgo",
    bajada:
      "Cuatro decisiones de liderazgo con su contexto, mi rol y los resultados.",
  },
  caso: {
    volver: "← Todos los casos",
    lectura: (n: number) => `${n} min de lectura`,
    ficha: {
      rol: "Rol",
      empresa: "Empresa",
      periodo: "Período",
      equipo: "Equipo",
    },
    resumen: {
      problema: "El problema",
      decision: "Lo que decidí",
      resultado: "El resultado",
    },
    secciones: {
      desafio: "El desafío",
      aporte: "Mi aporte",
      decisiones: "Decisiones clave",
      resultados: "Resultados",
      aprendizajes: "Aprendizajes",
    },
    indice: { titulo: "En este caso" },
    navegacion: { anterior: "Caso anterior", siguiente: "Caso siguiente" },
    galeria: { titulo: "Galería" },
  },
  experiencia: {
    eyebrow: "Trayectoria",
    titulo: "Experiencia",
    bajada:
      "12 años liderando equipos de UX y 16 en productos digitales. Acá están mis últimos roles; la trayectoria completa está en LinkedIn.",
    cv: "Descargar CV (PDF)",
    linkedin: "Ver LinkedIn",
  },
  contacto: {
    eyebrow: "Contacto",
    titulo: "Conversemos",
    canales: { mail: "Mail", linkedin: "LinkedIn" },
    form: {
      nombre: "Nombre",
      correo: "Correo",
      mensaje: "Mensaje",
      boton: "Enviar mensaje",
      botonEnviando: "Enviando…",
      errorVacio: (campo: "nombre" | "correo" | "mensaje") =>
        `Completá tu ${campo} para poder responderte.`,
      errorCorreo: "Revisá el correo: falta la @ o el dominio.",
      exito: "¡Gracias! Te respondo en las próximas 48 horas.",
      errorEnvio:
        "No se pudo enviar. Probá de nuevo o escribime a francozampini@gmail.com.",
      errorLimite: "Demasiados mensajes seguidos. Probá en un rato.",
    },
  },
  lab: {
    estadoHecho: "Hecho",
    estadoProximo: "Próximo",
  },
} as const;

// Títulos y descripciones por página. Los títulos van sin " · Franco Zampini":
// el template del layout raíz ("%s · Franco Zampini") lo agrega.
export const metaCopy = {
  templateTitulo: "%s · Franco Zampini",
  home: {
    title: "Franco Zampini · UX Manager",
    description:
      "Franco Zampini, UX Manager con 12 años liderando equipos de diseño. Casos de liderazgo, design systems y medición de experiencia.",
  },
  casos: {
    title: "Casos",
    description:
      "Cuatro casos de liderazgo en UX: medición de experiencia, design system, comunicaciones y gestión de equipo.",
  },
  sobre: {
    title: "Sobre mí",
    description:
      "Los principios con los que lidero equipos de UX, con ejemplos de mi trabajo.",
  },
  experiencia: {
    title: "Experiencia",
    description:
      "12 años liderando equipos de UX en Frávega, Payway, Mercado Pago y Despegar.",
  },
  contacto: {
    title: "Contacto",
    description:
      "Busco mi próximo rol como Head o Director de Diseño. Escribime.",
  },
  // P-07 (pendiente): título "Lab" con el template; descripción = lab_page.subtitle.
  lab: { title: "Lab" },
} as const;

/** Textos de ayuda del admin (solo los ve Fran). Origen: copy.json > ui.admin_vista_previa. */
export const adminCopy = {
  vistaPrevia: {
    label: "Imagen de vista previa",
    ayuda:
      "Recomendado 1600 × 900, con lo importante en la mitad de arriba. Revisá que la imagen no muestre datos internos o de terceros.",
    quitar: "Quitar imagen",
  },
} as const;
