import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Bold, Italic, Underline as UIcon, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link2, Image as ImgIcon, Undo, Redo, Minus
} from "lucide-react";

type Props = { value: string; onChange: (html: string) => void; folder?: string };

const Btn = ({ active, onClick, title, children }: any) => (
  <button type="button" title={title} onClick={onClick}
    className={`w-8 h-8 grid place-items-center rounded-md text-sm transition-colors ${active ? "bg-orange text-white" : "hover:bg-secondary text-foreground/80"}`}>
    {children}
  </button>
);

const Toolbar = ({ editor, folder }: { editor: Editor; folder: string }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") return editor.chain().focus().unsetLink().run();
    editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
  };

  const addImage = async (file: File) => {
    if (!file.type.startsWith("image/")) return toast({ title: "Image files only", variant: "destructive" });
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", contentType: file.type });
    if (error) return toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl, alt: file.name }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-secondary/40 sticky top-0 z-10">
      <Btn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={14} /></Btn>
      <Btn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={14} /></Btn>
      <Btn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UIcon size={14} /></Btn>
      <Btn title="Strike" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={14} /></Btn>
      <div className="w-px h-5 bg-border mx-1" />
      <Btn title="H1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 size={14} /></Btn>
      <Btn title="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={14} /></Btn>
      <Btn title="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={14} /></Btn>
      <div className="w-px h-5 bg-border mx-1" />
      <Btn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={14} /></Btn>
      <Btn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={14} /></Btn>
      <Btn title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={14} /></Btn>
      <Btn title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={14} /></Btn>
      <Btn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={14} /></Btn>
      <div className="w-px h-5 bg-border mx-1" />
      <Btn title="Link" active={editor.isActive("link")} onClick={addLink}><Link2 size={14} /></Btn>
      <Btn title="Image" onClick={() => fileRef.current?.click()}><ImgIcon size={14} /></Btn>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) addImage(f); e.target.value = ""; }} />
      <div className="w-px h-5 bg-border mx-1" />
      <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo size={14} /></Btn>
      <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo size={14} /></Btn>
    </div>
  );
};

const RichEditor = ({ value, onChange, folder = "blog" }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: "text-orange underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-4" } }),
      Placeholder.configure({ placeholder: "Start writing your post…" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none min-h-[320px] focus:outline-none p-4 prose-headings:font-display prose-headings:font-extrabold prose-a:text-orange prose-img:rounded-xl",
      },
    },
  });

  // Sync external value changes (e.g., when switching rows)
  useEffect(() => {
    if (!editor) return;
    if ((value || "") !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  return (
    <div className="mt-1 rounded-xl border border-border bg-background overflow-hidden">
      {editor && <Toolbar editor={editor} folder={folder} />}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichEditor;
