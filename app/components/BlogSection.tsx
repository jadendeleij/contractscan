import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Clock } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  Beveiliging:   "bg-blue-50 text-blue-700",
  Privacy:       "bg-violet-50 text-violet-700",
  Juridisch:     "bg-amber-50 text-amber-700",
  Productnieuws: "bg-green-50 text-green-700",
};

export default async function BlogSection() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, title, excerpt, category, tags, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (!posts?.length) return null;

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">Kennisbank</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Actuele inzichten</h2>
            <p className="text-slate-500">Alles over contractveiligheid, privacy en AI.</p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Alle artikelen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-600"}`}>
                  {post.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                {post.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">
                {post.excerpt}
              </p>

              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(post.tags as string[]).slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(post.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Lees meer <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile link */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Alle artikelen <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
