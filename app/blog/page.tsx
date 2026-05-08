import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Clock } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const CATEGORY_COLORS: Record<string, string> = {
  Beveiliging:   "bg-blue-50 text-blue-700",
  Privacy:       "bg-violet-50 text-violet-700",
  Juridisch:     "bg-amber-50 text-amber-700",
  Productnieuws: "bg-green-50 text-green-700",
};

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, tags, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Blog</h1>
            <p className="text-slate-500 text-lg">Alles over contractveiligheid, privacy en AI.</p>
          </div>

          {!posts?.length ? (
            <p className="text-slate-400 text-center py-16">Binnenkort meer artikelen.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(post.tags as string[]).slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                    Lees meer <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
