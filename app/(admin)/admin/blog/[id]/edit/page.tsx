import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BlogPostForm from "@/app/components/admin/BlogPostForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Terug naar Blog Beheer
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Post bewerken</h1>
        <p className="text-slate-400 text-sm mt-1">{post.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <BlogPostForm post={post} />
      </div>
    </div>
  );
}
