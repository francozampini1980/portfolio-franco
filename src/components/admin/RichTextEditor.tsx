"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import {
  createInlineImageUploadUrl,
  signInlineImagePreview,
} from "@/lib/admin-actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Storage folder for images inserted here (e.g. a case id, or "site"). */
  imageScope?: string;
};

const btn =
  "rounded px-2 py-1 text-xs font-medium text-fg-muted hover:bg-surface-2 hover:text-fg data-[on=true]:bg-violet-600/30 data-[on=true]:text-violet-200";

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  imageScope = "site",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: { class: "cms-inline-img" },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Escribí acá…" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose-cms min-h-[160px] max-w-none rounded-b-xl border border-t-0 border-line bg-ink/40 px-4 py-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    if (file.size > 10 * 1024 * 1024) {
      window.alert("La imagen supera los 10 MB. Redimensionala o comprimila.");
      return;
    }
    setUploading(true);
    try {
      const { path, token } = await createInlineImageUploadUrl(
        imageScope,
        file.name,
      );
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.storage
        .from("case-images")
        .uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (error) throw new Error(error.message);
      const previewUrl = await signInlineImagePreview(path);
      editor
        .chain()
        .focus()
        .setImage({ src: previewUrl ?? `inline:${path}` })
        .run();
    } catch {
      window.alert("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  if (!editor) {
    return (
      <div className="min-h-[200px] rounded-xl border border-line bg-ink/40" />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-0.5 rounded-t-xl border border-line bg-surface px-1.5 py-1">
        <button
          type="button"
          className={btn}
          data-on={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Negrita
        </button>
        <button
          type="button"
          className={btn}
          data-on={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Itálica
        </button>
        <button
          type="button"
          className={btn}
          data-on={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          Título
        </button>
        <button
          type="button"
          className={btn}
          data-on={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          Subtítulo
        </button>
        <button
          type="button"
          className={btn}
          data-on={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Lista
        </button>
        <button
          type="button"
          className={btn}
          data-on={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Lista num.
        </button>
        <button
          type="button"
          className={btn}
          data-on={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Cita
        </button>
        <button
          type="button"
          className={cn(btn)}
          data-on={editor.isActive("link")}
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            const url = window.prompt("URL del enlace");
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
        >
          Enlace
        </button>
        <button
          type="button"
          className={btn}
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Subiendo…" : "Imagen"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          hidden
          onChange={onPickImage}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
