import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArrowLeft, Clock, Eye, Tag, UserRound, Globe } from "lucide-react";
import { togglePublished } from "@/app/actions/blog";

const CATEGORY_COLORS: Record<string, string> = {
  Beveiliging:   "bg-blue-50 text-blue-700",
  Privacy:       "bg-violet-50 text-violet-700",
  Juridisch:     "bg-amber-50 text-amber-700",
  Productnieuws: "bg-green-50 text-green-700",
};

export default async function BlogPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminClient();
  const { data: post } = await db.from("blog_posts").select("*").eq("id", id).single();

  if (!post) notFound();

  async function handlePublish() {
    "use server";
    await togglePublished(id, true);
    redirect("/admin/blog");
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Preview banner */}
      <div className="flex items-center justify-between gap-4 mb-8 px-4 py-3 bg-violet-50 border border-violet-200 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Eye className="w-3.5 h-3.5 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-violet-900">Voorvertoning</p>
            <p className="text-xs text-violet-600">
              {post.published ? "Dit artikel is live" : "Dit artikel staat nog op concept"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-900 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Terug
          </Link>
          {!post.published && (
            <form action={handlePublish}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                Publiceer
              </button>
            </form>
          )}
        </div>
      </div>

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

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-lg text-slate-600 leading-relaxed mb-8 pb-8 border-b-2 border-slate-200">
          {post.excerpt}
        </p>
      )}

      {/* Content */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* CTA */}
      <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <p className="text-blue-900 font-semibold mb-1">Klaar om uw contract te scannen?</p>
        <p className="text-blue-700 text-sm mb-4">Probeer ContractScan AI gratis, geen credit card nodig.</p>
        <span className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl opacity-60 cursor-not-allowed">
          Scan gratis
        </span>
      </div>
    </div>
  );
}
