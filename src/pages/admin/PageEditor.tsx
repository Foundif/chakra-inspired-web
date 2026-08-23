import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MediaUpload from "@/components/admin/MediaUpload";
import { Save, ArrowUp, ArrowDown, Eye, EyeOff, Plus, Trash2, ExternalLink } from "lucide-react";

const PAGES = [
  { slug: "home", label: "Home" },
  { slug: "about", label: "About" },
  { slug: "products", label: "Products" },
  { slug: "services", label: "Services" },
  { slug: "gallery", label: "Gallery" },
  { slug: "industries", label: "Industries" },
  { slug: "process", label: "Process" },
  { slug: "contact", label: "Contact" },
];

type Block = any;

const PageEditor = () => {
  const [page, setPage] = useState("home");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [editing, setEditing] = useState<Block | null>(null);
  const { toast } = useToast();

  const load = async (slug: string) => {
    const { data } = await supabase.from("page_blocks").select("*").eq("page_slug", slug).order("sort_order", { ascending: true });
    setBlocks(data ?? []);
  };
  useEffect(() => { load(page); setEditing(null); }, [page]);

  const save = async () => {
    const p: any = { ...editing };
    delete p.created_at; delete p.updated_at;
    const { error } = editing.id
      ? await supabase.from("page_blocks").update(p).eq("id", editing.id)
      : await supabase.from("page_blocks").insert({ ...p, page_slug: page });
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved — live on the site" });
    setEditing(null);
    load(page);
  };

  const move = async (b: Block, dir: -1 | 1) => {
    const idx = blocks.findIndex((x) => x.id === b.id);
    const swap = blocks[idx + dir];
    if (!swap) return;
    await supabase.from("page_blocks").update({ sort_order: swap.sort_order }).eq("id", b.id);
    await supabase.from("page_blocks").update({ sort_order: b.sort_order }).eq("id", swap.id);
    load(page);
  };
  const toggle = async (b: Block) => {
    await supabase.from("page_blocks").update({ is_visible: !b.is_visible }).eq("id", b.id);
    load(page);
  };
  const remove = async (b: Block) => {
    if (!confirm(`Delete section "${b.block_key}"?`)) return;
    await supabase.from("page_blocks").delete().eq("id", b.id);
    if (editing?.id === b.id) setEditing(null);
    load(page);
  };
  const addNew = () => setEditing({ block_key: "", block_type: "section", is_visible: true, sort_order: (blocks.at(-1)?.sort_order ?? 0) + 10 });

  const Editor = () => (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-extrabold">{editing?.id ? "Edit section" : "New section"}</h2>
      {!editing?.id && (
        <div>
          <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Section key (no spaces)</label>
          <input value={editing?.block_key ?? ""} onChange={(e) => setEditing({ ...editing, block_key: e.target.value.replace(/\s+/g, "_") })} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
        </div>
      )}
      {[
        { k: "eyebrow", label: "Eyebrow / pre-title", type: "text" },
        { k: "title", label: "Title / heading", type: "text" },
        { k: "body", label: "Body / paragraph", type: "textarea" },
        { k: "cta_label", label: "Button label", type: "text" },
        { k: "cta_href", label: "Button link", type: "text" },
      ].map((f) => (
        <div key={f.k}>
          <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea rows={4} value={editing?.[f.k] ?? ""} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none" />
          ) : (
            <input value={editing?.[f.k] ?? ""} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          )}
        </div>
      ))}
      <div>
        <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Image</label>
        <MediaUpload value={editing?.image_url ?? ""} onChange={(url) => setEditing({ ...editing, image_url: url })} folder={`page_blocks/${page}`} />
      </div>
      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!editing?.is_visible} onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })} />
        Visible on the site
      </label>
      <div className="flex gap-2 pt-2">
        <button onClick={save} className="btn-orange flex-1 justify-center"><Save size={16} /> Save</button>
        <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full border border-border font-semibold">Cancel</button>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold">Page Editor</h1>
          <p className="text-muted-foreground text-sm">Edit headings, body text, images, CTAs. Toggle sections on/off and reorder. Changes go live instantly.</p>
        </div>
        <div className="flex gap-2">
          <a href={`/${page === "home" ? "" : page}`} target="_blank" rel="noopener" className="px-3 py-2 rounded-full border border-border font-semibold inline-flex items-center gap-2 text-xs hover:bg-secondary"><ExternalLink size={14} /> Preview</a>
          <button onClick={addNew} className="btn-orange text-xs"><Plus size={16} /> Add</button>
        </div>
      </div>

      <div className="-mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto mb-4">
        <div className="flex gap-2 min-w-max">
          {PAGES.map((p) => (
            <button key={p.slug} onClick={() => setPage(p.slug)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${page === p.slug ? "bg-foreground text-background" : "bg-secondary/60 border border-border"}`}>{p.label}</button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card rounded-2xl border border-border overflow-hidden">
          {/* Mobile: card list */}
          <ul className="md:hidden divide-y divide-border">
            {blocks.map((b, i) => (
              <li key={b.id} className={`p-3 ${editing?.id === b.id ? "bg-orange/5" : ""}`}>
                <button onClick={() => setEditing(b)} className="w-full text-left">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] text-muted-foreground truncate">{b.block_key}</div>
                      <div className="font-semibold truncate">{b.title || <span className="text-muted-foreground">Untitled</span>}</div>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold ${b.is_visible ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {b.is_visible ? "ON" : "OFF"}
                    </span>
                  </div>
                </button>
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={() => setEditing(b)} className="px-3 py-1.5 rounded-md bg-orange text-white text-xs font-bold">Edit</button>
                  <button onClick={() => toggle(b)} className="px-2 py-1.5 rounded-md border border-border text-xs">{b.is_visible ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                  <button onClick={() => move(b, -1)} disabled={i === 0} className="px-2 py-1.5 rounded-md border border-border disabled:opacity-30"><ArrowUp size={12} /></button>
                  <button onClick={() => move(b, 1)} disabled={i === blocks.length - 1} className="px-2 py-1.5 rounded-md border border-border disabled:opacity-30"><ArrowDown size={12} /></button>
                  <button onClick={() => remove(b)} className="px-2 py-1.5 rounded-md border border-border text-muted-foreground hover:text-orange ml-auto"><Trash2 size={12} /></button>
                </div>
              </li>
            ))}
            {!blocks.length && <li className="p-8 text-center text-muted-foreground text-sm">No sections yet for this page.</li>}
          </ul>

          {/* Tablet/desktop table */}
          <table className="w-full text-sm hidden md:table">
            <thead className="bg-secondary/50 text-xs uppercase">
              <tr><th className="text-left p-3">#</th><th className="text-left p-3">Section</th><th className="text-left p-3">Title</th><th className="text-left p-3">Visible</th><th></th></tr>
            </thead>
            <tbody>
              {blocks.map((b, i) => (
                <tr key={b.id} onClick={() => setEditing(b)} className={`border-t border-border cursor-pointer hover:bg-secondary/40 ${editing?.id === b.id ? "bg-orange/5" : ""}`}>
                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                  <td className="p-3 font-mono text-xs">{b.block_key}</td>
                  <td className="p-3 truncate max-w-[260px]">{b.title || <span className="text-muted-foreground">—</span>}</td>
                  <td className="p-3">
                    <button onClick={(e) => { e.stopPropagation(); toggle(b); }} className={`inline-flex items-center gap-1 text-xs font-bold ${b.is_visible ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {b.is_visible ? <><Eye size={12} /> ON</> : <><EyeOff size={12} /> OFF</>}
                    </button>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={(e) => { e.stopPropagation(); move(b, -1); }} disabled={i === 0} className="p-1 disabled:opacity-30"><ArrowUp size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); move(b, 1); }} disabled={i === blocks.length - 1} className="p-1 disabled:opacity-30"><ArrowDown size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); remove(b); }} className="p-1 text-muted-foreground hover:text-orange"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))}
              {!blocks.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No sections yet for this page.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Desktop editor panel */}
        <div className="hidden lg:block lg:col-span-2">
          {editing ? (
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-6">
              <Editor />
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-8 text-center text-muted-foreground">Select a section to edit.</div>
          )}
        </div>
      </div>

      {/* Mobile/tablet editor: full-screen overlay */}
      {editing && (
        <div className="lg:hidden fixed inset-0 z-[80] flex flex-col bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
            <h2 className="font-display text-lg font-extrabold">{editing.id ? "Edit section" : "New section"}</h2>
            <button onClick={() => setEditing(null)} aria-label="Close" className="w-9 h-9 grid place-items-center rounded-lg hover:bg-secondary text-lg">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pb-32">
            <Editor />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default PageEditor;