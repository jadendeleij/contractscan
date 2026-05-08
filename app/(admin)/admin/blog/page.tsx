import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deletePost, togglePublished } from "@/app/actions/blog";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, category, published, created_at, updated_at")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Beheer</h1>
          <p className="text-slate-500 text-sm mt-1">{posts?.length ?? 0} posts totaal</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nieuwe post
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {!posts?.length ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 text-sm mb-4">Nog geen blog posts.</p>
            <Link href="/admin/blog/new" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              Maak je eerste post →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">Titel</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-600 hidden sm:table-cell">Categorie</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-600 hidden md:table-cell">Datum</th>
                <th className="text-center px-4 py-3.5 font-semibold text-slate-600">Status</th>
                <th className="text-right px-6 py-3.5 font-semibold text-slate-600">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 truncate max-w-[200px] md:max-w-xs">{post.title}</div>
                    <div className="text-xs text-slate-400">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-400 hidden md:table-cell">
                    {new Date(post.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <form action={togglePublished.bind(null, post.id, !post.published)}>
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                          post.published
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {post.published
                          ? <><Eye className="w-3 h-3" /> Gepubliceerd</>
                          : <><EyeOff className="w-3 h-3" /> Concept</>
                        }
                      </button>
                    </form>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Bewerken"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form action={deletePost.bind(null, post.id)}>
                        <button
                          type="submit"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Verwijderen"
                          onClick={(e) => { if (!confirm(`"${post.title}" verwijderen?`)) e.preventDefault(); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
