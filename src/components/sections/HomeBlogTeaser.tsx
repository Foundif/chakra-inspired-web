import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-woven-label.jpg";

type Post = {
  id: string; slug: string; title: string; excerpt: string | null;
  cover_url: string | null; reading_minutes: number | null;
  published_at: string | null;
};

/** Latest published posts in an auto-moving, equal-height carousel. */
const HomeBlogTeaser = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id,slug,title,excerpt,cover_url,reading_minutes,published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(10);
      setPosts((data ?? []) as Post[]);
    };
    load();
    const ch = supabase
      .channel(`blog_home_${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "blog_posts" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // Auto-advance every 3.5s; pause on hover/touch
  useEffect(() => {
    if (!posts.length) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el || pausedRef.current) return;
      const card = el.querySelector<HTMLElement>("[data-card]");
      const step = card ? card.offsetWidth + 24 /* gap-6 */ : el.clientWidth;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, 3500);
    return () => clearInterval(id);
  }, [posts.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!posts.length) return null;

  return (
    <section className="py-24 md:py-28">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] font-semibold text-orange mb-3">From the Blog</div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.05] max-w-2xl break-words">
              Insights on <span className="text-orange">apparel branding</span> & textile labeling.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scrollBy(-1)}
                aria-label="Previous"
                className="w-10 h-10 rounded-full border border-border bg-background hover:bg-orange hover:text-white hover:border-orange transition-colors flex items-center justify-center"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scrollBy(1)}
                aria-label="Next"
                className="w-10 h-10 rounded-full border border-border bg-background hover:bg-orange hover:text-white hover:border-orange transition-colors flex items-center justify-center"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <Link
              to="/blog"
              className="text-sm font-semibold inline-flex items-center gap-2 text-foreground border-b-2 border-orange pb-1 hover:text-orange transition-colors"
            >
              View all posts <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div
          ref={trackRef}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onTouchStart={() => { pausedRef.current = true; }}
          onTouchEnd={() => { pausedRef.current = false; }}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/blog/${p.slug}`}
              data-card
              className="group flex-shrink-0 snap-start w-[85%] sm:w-[48%] lg:w-[calc((100%-3*1.5rem)/4)] rounded-2xl overflow-hidden bg-card shadow-soft hover:shadow-card transition-all flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary flex-shrink-0">
                <img
                  src={p.cover_url || hero}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={450}
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 25vw"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : ""} · {p.reading_minutes ?? 5} min
                </div>
                <h3 className="font-display font-bold text-base md:text-lg leading-snug group-hover:text-orange transition-colors line-clamp-3">
                  {p.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogTeaser;
