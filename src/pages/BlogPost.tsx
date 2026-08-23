import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-woven-label.jpg";

type Post = {
  id: string; slug: string; title: string; excerpt: string | null;
  content: string | null; cover_url: string | null;
  reading_minutes: number | null; published_at: string | null;
  updated_at: string | null; tags: string[] | null; author: string | null;
  meta_title: string | null; meta_description: string | null;
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Array<{ id: string; slug: string; title: string; cover_url: string | null }>>([]);
  const [loading, setLoading] = useState(true);
  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("is_published", true)
        .maybeSingle();
      if (active) { setPost(data as Post | null); setLoading(false); }
      if (data) {
        const tags = (data as any).tags as string[] | null;
        const { data: rel } = await supabase
          .from("blog_posts")
          .select("id,slug,title,cover_url,tags")
          .eq("is_published", true)
          .neq("slug", slug!)
          .order("published_at", { ascending: false })
          .limit(20);
        const scored = ((rel ?? []) as any[])
          .map((r) => ({ ...r, score: (r.tags ?? []).filter((t: string) => (tags ?? []).includes(t)).length }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        if (active) setRelated(scored);
      }
    })();
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="container-luxe py-40 text-center text-muted-foreground">Loading…</div>;
  if (!post) return <div className="container-luxe py-40 text-center"><h1 className="font-display text-3xl font-extrabold mb-4">Post not found</h1><Link to="/blog" className="text-orange">← Back to blog</Link></div>;

  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.cover_url || `https://srikanishenterprises.in/og.jpg`,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: post.author || "Sri Kanish Enterprises" },
    publisher: { "@type": "Organization", name: "Sri Kanish Enterprises", logo: { "@type": "ImageObject", url: "https://srikanishenterprises.in/og.jpg" } },
    mainEntityOfPage: `https://srikanishenterprises.in/blog/${post.slug}`,
  };

  return (
    <>
      <Seo
        title={post.meta_title || `${post.title} | Sri Kanish Enterprises`}
        description={post.meta_description || post.excerpt || post.title}
        path={`/blog/${post.slug}`}
        type="article"
        image={post.cover_url || "/og.jpg"}
        publishedAt={post.published_at || undefined}
        updatedAt={post.updated_at || undefined}
        keywords={(post.tags || []).join(", ")}
        jsonLd={ld}
      />
      <article className="pt-32 md:pt-40 pb-24">
        <div className="container-luxe max-w-3xl">
          <Link to="/blog" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-orange">← All posts</Link>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] mt-6 mb-6 text-balance">{post.title}</h1>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-10">
            {post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : ""} · {post.reading_minutes ?? 5} min read
          </div>
          {(post.cover_url || hero) && (
            <div className="rounded-2xl overflow-hidden mb-12 aspect-[16/9] bg-secondary">
              <img src={post.cover_url || hero} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-extrabold prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h3:text-2xl prose-a:text-orange hover:prose-a:underline prose-img:rounded-xl prose-strong:text-foreground prose-li:my-1">
            {/\<\/?[a-z][^>]*\>/i.test(post.content || "")
              ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || "") }} />
              : <ReactMarkdown>{post.content || ""}</ReactMarkdown>}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link key={t} to={`/blog/tag/${slugify(t)}`} className="chip hover:bg-orange hover:text-white transition-colors">
                  #{t}
                </Link>
              ))}
            </div>
          )}
          {related.length > 0 && (
            <aside className="mt-20 pt-12 border-t border-border">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-8">Related reading</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link key={r.id} to={`/blog/${r.slug}`} className="group block">
                    <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3] bg-secondary hover-zoom">
                      <img src={r.cover_url || hero} alt={r.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-display font-bold text-base group-hover:text-orange transition-colors leading-snug line-clamp-3">{r.title}</h3>
                  </Link>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/blog" className="text-sm font-semibold text-orange">← Back to all posts</Link>
              </div>
            </aside>
          )}
        </div>
      </article>
    </>
  );
};

export default BlogPost;