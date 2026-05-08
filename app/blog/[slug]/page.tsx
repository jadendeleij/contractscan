import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Clock, Tag, UserRound } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import type { Metadata } from "next";

export const revalidate = 60;

const CATEGORY_COLORS: Record<string, string> = {
  Beveiliging:   "bg-blue-50 text-blue-700",
  Privacy:       "bg-violet-50 text-violet-700",
  Juridisch:     "bg-amber-50 text-amber-700",
  Productnieuws: "bg-green-50 text-green-700",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("title, excerpt, meta_description").eq("slug", slug).eq("published", true).single();
  return {
    title: data ? `${data.title} — ContractScan AI` : "Blog",
    description: data?.meta_description || data?.excerpt || "",
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-600"}`}>
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <UserRound className="w-3 h-3" />
              {post.author ?? "Redactie"}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(post.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Tags */}
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {(post.tags as string[]).map((tag) => (
                <span key={tag} className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt / lead */}
          {post.excerpt && (
            <p className="text-lg text-slate-600 leading-relaxed mb-8 pb-8 border-b-2 border-slate-200">
              {post.excerpt}
            </p>
          )}

          {/* Content — rendered from rich-text HTML */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-blue-900 font-semibold mb-1">Klaar om uw contract te scannen?</p>
            <p className="text-blue-700 text-sm mb-4">Probeer ContractScan AI gratis — geen credit card nodig.</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all active:scale-95"
            >
              Scan gratis
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
