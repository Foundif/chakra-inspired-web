import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Filter } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/sections/Reveal";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-woven-label.jpg";

type Post = {
  id: string; slug: string; title: string; excerpt: string | null;
  cover_url: string | null; reading_minutes: number | null;
  published_at: string | null; tags: string[] | null;
};

// Category groups map tags → product family.
const PRODUCT_CATEGORIES: Record<string, string[]> = {
  "Woven Labels": ["woven", "woven-labels", "labels"],
  "Hang Tags": ["hang-tag", "hang-tags", "tags"],
  "Wash Care": ["wash-care", "care-labels", "compliance"],
  "Heat Transfer": ["heat-transfer", "sportswear"],
  "Silicon Patches": ["silicon", "silicon-patches", "denim"],
  "Packaging": ["packaging", "boxes"],
  "Sustainability": ["sustainable", "eco", "sustainability"],
  "Branding": ["brand", "branding", "identity", "pantone"],
  "Manufacturing": ["tiruppur", "manufacturing", "factory"],
};

const INTENTS = [
  { label: "Guides", tags: ["guide", "how-to", "compliance"] },
  { label: "Comparisons", tags: ["vs", "comparison", "woven-vs-printed"] },
  { label: "Design Tips", tags: ["design", "pantone", "identity"] },
  { label: "Industry", tags: ["tiruppur", "manufacturing", "sustainability"] },
];

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeIntent, setActiveIntent] = useState<string | null>(null);
  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const load = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,cover_url,reading_minutes,published_at,tags")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    setPosts((data ?? []) as Post[]);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel(`blog_list_${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags ?? []))).sort(),
    [posts],
  );

  const matchesAny = (postTags: string[], wanted: string[]) => {
    const lower = postTags.map((t) => t.toLowerCase());
    return wanted.some((w) => lower.some((t) => t.includes(w)));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const tags = p.tags ?? [];
      if (activeTag && !tags.map((t) => t.toLowerCase()).includes(activeTag.toLowerCase())) return false;
      if (activeCategory) {
        const wanted = PRODUCT_CATEGORIES[activeCategory] ?? [];
        if (!matchesAny(tags, wanted) && !p.title.toLowerCase().includes(activeCategory.toLowerCase())) return false;
      }
      if (activeIntent) {
        const wanted = INTENTS.find((i) => i.label === activeIntent)?.tags ?? [];
        if (!matchesAny(tags, wanted) && !p.title.toLowerCase().includes(activeIntent.toLowerCase())) return false;
      }
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, activeTag, activeCategory, activeIntent]);

  const clearAll = () => { setQuery(""); setActiveTag(null); setActiveCategory(null); setActiveIntent(null); };
  const hasFilter = !!(query || activeTag || activeCategory || activeIntent);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Sri Kanish Enterprises Blog",
    url: "https://srikanishenterprises.in/blog",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://srikanishenterprises.in/blog/${p.slug}`,
      datePublished: p.published_at,
    })),
  };

  return (
    <>
      <Seo
        title="Textile Labels & Apparel Branding Blog | Sri Kanish Enterprises"
        description="Insights on woven labels, hang tags, wash care compliance, Pantone matching and apparel branding from a top Tiruppur manufacturer."
        path="/blog"
        keywords="textile labels blog, woven labels guide, hang tag design, wash care compliance, apparel branding India"
        jsonLd={jsonLd}
      />
      <PageHero
        eyebrow="Insights"
        title="Notes on apparel branding & textile labeling."
        subtitle="Practical knowledge from the floor — for brands, designers, and exporters."
        background
      />

      {/* Search + tag filter */}
      <section className="pt-8">
        <div className="container-luxe space-y-5">
          <div className="relative max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts by keyword, topic, or tag…"
              className="w-full rounded-full border border-border bg-card pl-11 pr-11 py-3 text-sm outline-none focus:border-orange transition"
              aria-label="Search blog posts"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {/* Product category */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Filter size={12} /> Product Category
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`chip transition-colors ${activeCategory === null ? "bg-orange text-white border-orange" : "hover:bg-orange/10"}`}
              >
                All Products
              </button>
              {Object.keys(PRODUCT_CATEGORIES).map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory((cur) => (cur === c ? null : c))}
                  className={`chip transition-colors ${activeCategory === c ? "bg-orange text-white border-orange" : "hover:bg-orange/10"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Intent */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2">Read by Intent</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveIntent(null)}
                className={`chip transition-colors ${activeIntent === null ? "bg-foreground text-background border-foreground" : "hover:bg-foreground/10"}`}
              >
                Any
              </button>
              {INTENTS.map((i) => (
                <button
                  key={i.label}
                  onClick={() => setActiveIntent((cur) => (cur === i.label ? null : i.label))}
                  className={`chip transition-colors ${activeIntent === i.label ? "bg-foreground text-background border-foreground" : "hover:bg-foreground/10"}`}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </div>

          {allTags.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTag(null)}
                  className={`chip transition-colors ${activeTag === null ? "bg-orange text-white border-orange" : "hover:bg-orange/10"}`}
                >
                  All
                </button>
                {allTags.slice(0, 16).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTag((cur) => (cur === t ? null : t))}
                    className={`chip transition-colors ${activeTag === t ? "bg-orange text-white border-orange" : "hover:bg-orange/10"}`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "post" : "posts"}
              {activeCategory ? ` in ${activeCategory}` : ""}
              {activeIntent ? ` · ${activeIntent}` : ""}
              {activeTag ? ` · #${activeTag}` : ""}
              {query ? ` matching "${query}"` : ""}
            </p>
            {hasFilter && (
              <button onClick={clearAll} className="text-xs font-semibold text-orange hover:underline">Clear filters</button>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-luxe grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.1}>
              <Link to={`/blog/${p.slug}`} className="group block">
                <div className="hover-zoom rounded-2xl overflow-hidden mb-6 aspect-[4/3] bg-secondary">
                  <img
                    src={p.cover_url || hero}
                    alt={p.title}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={i === 0 ? "high" : "low"}
                    width={800}
                    height={600}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : ""} · {p.reading_minutes ?? 5} min read
                </div>
                <h2 className="font-display text-2xl md:text-3xl mb-3 group-hover:text-orange transition-colors text-balance font-extrabold">{p.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{p.excerpt}</p>
                {p.tags && p.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-[11px] text-orange/90 font-semibold">#{t}</span>
                    ))}
                  </div>
                )}
              </Link>
            </Reveal>
          ))}
          {!filtered.length && (
            <p className="text-muted-foreground md:col-span-2 lg:col-span-3">
              {posts.length === 0 ? "No posts yet. Check back soon." : "No posts match your search. Try different keywords or clear the filter."}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;
