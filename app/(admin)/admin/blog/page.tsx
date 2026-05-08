import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import DeletePostButton from "@/app/components/admin/DeletePostButton";
import PublishToggle from "@/app/components/admin/PublishToggle";

export default async function AdminBlogPage() {
  const db = createAdminClient();
  const { data: posts } = await db
    .from("blog_posts")
    .select("id, title, slug, category, published, created_at, updated_at")
    .order("created_at", { ascending: false });

  const total = posts?.length ?? 0;
  const published = posts?.filter((p) => p.published).length ?? 0;
  const drafts = total - published;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Beheer</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-slate-500">{total} posts totaal</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-sm text-green-600 font-medium">{published} gepubliceerd</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-sm text-slate-400">{drafts} concept{drafts !== 1 ? "en" : ""}</span>
          </div>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-blue-200 self-start"
        >
          <Plus className="w-4 h-4" />
          Nieuwe post
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {!posts?.length ? (
          <div className="py-20 text-center">
            <FileTextIcon />
            <p className="text-slate-500 text-sm font-medium mt-3 mb-1">Nog geen blog posts</p>
            <p className="text-slate-400 text-xs mb-5">Maak je eerste artikel aan</p>
            <Link href="/admin/blog/new" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              + Nieuwe post aanmaken
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Titel</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden sm:table-cell">Categorie</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Aangemaakt</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Bijgewerkt</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800 truncate max-w-[180px] lg:max-w-xs">{post.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">/blog/{post.slug}</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs hidden lg:table-cell">
                      {new Date(post.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs hidden lg:table-cell">
                      {new Date(post.updated_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <PublishToggle id={post.id} published={post.published} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {post.published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Bekijk live"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Bewerken"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <DeletePostButton id={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function FileTextIcon() {
  return (
    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    </div>
  );
}
