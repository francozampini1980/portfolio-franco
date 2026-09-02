"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { cn } from "@/lib/cn";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const btn =
  "rounded px-2 py-1 text-xs font-medium text-fg-muted hover:bg-surface-2 hover:text-fg data-[on=true]:bg-violet-600/30 data-[on=true]:text-violet-200";

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
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
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
