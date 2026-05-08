import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import BlogPostForm from "@/app/components/admin/BlogPostForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminClient();
  const { data: post } = await db
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Terug naar Blog Beheer
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Post bewerken</h1>
            <p className="text-slate-400 text-sm mt-1 truncate max-w-sm">{post.title}</p>
          </div>
          {post.published && (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Bekijk live
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <BlogPostForm post={post} />
      </div>
    </div>
  );
}
