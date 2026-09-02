import sanitizeHtml from "sanitize-html";

/** Whitelist for rich text produced by the TipTap editor in the CMS. */
export function cleanRichText(dirty: string): string {
  return sanitizeHtml(dirty ?? "", {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "a",
      "ul", "ol", "li", "blockquote", "h2", "h3", "hr",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}
