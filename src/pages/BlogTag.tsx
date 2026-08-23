import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BlogTag = () => {
  const { tag = "" } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_url,reading_minutes,published_at,tags")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (!active) return;
      const filtered = (data ?? []).filter((p: any) =>
        (p.tags ?? []).some((t: string) => slugify(t) === tag)
      ) as Post[];
      setPosts(filtered);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [tag]);

  const label = decodeURIComponent(tag).replace(/-/g, " ");
  const title = `${label.replace(/\b\w/g, (c) => c.toUpperCase())} — Articles & Guides`;

  return (
    <>
      <Seo
        title={`${title} | Sri Kanish Enterprises Blog`}
        description={`Articles tagged ${label} — practical guides on textile labels, apparel branding and manufacturing from Tiruppur.`}
        path={`/blog/tag/${tag}`}
      />
      <PageHero eyebrow="Blog · Topic" title={title} subtitle={`Every article we've published on ${label}.`} />
      <section className="py-20 md:py-24">
        <div className="container-luxe">
          <Link to="/blog" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-orange">← All posts</Link>
          <div className="mt-8 grid md:grid-cols-2 gap-8 md:gap-10">
            {loading && <p className="text-muted-foreground">Loading…</p>}
            {!loading && !posts.length && <p className="text-muted-foreground">No posts in this topic yet.</p>}
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) * 0.08}>
                <Link to={`/blog/${p.slug}`} className="group block">
                  <div className="hover-zoom rounded-2xl overflow-hidden mb-6 aspect-[4/3] bg-secondary">
                    <img src={p.cover_url || hero} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : ""} · {p.reading_minutes ?? 5} min read
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl mb-3 group-hover:text-orange transition-colors text-balance font-extrabold">{p.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{p.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogTag;