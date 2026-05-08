import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Users, Bell, FileText, TrendingUp, ArrowUpRight } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: string;
};

function StatCard({ label, value, sub, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-extrabold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}

export default async function AdminDashboard() {
  const db = createAdminClient();
  const supabase = await createClient();

  // Fetch all stats in parallel
  const [usersRes, waitlistRes, postsRes, publishedRes, recentWaitlistRes, recentPostsRes] =
    await Promise.all([
      db.auth.admin.listUsers({ perPage: 1000 }),
      supabase.from("waitlist").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("waitlist").select("email, created_at").order("created_at", { ascending: false }).limit(8),
      supabase.from("blog_posts").select("id, title, category, published, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

  const userCount = usersRes.data?.users?.length ?? 0;
  const waitlistCount = waitlistRes.count ?? 0;
  const totalPosts = postsRes.count ?? 0;
  const publishedPosts = publishedRes.count ?? 0;
  const recentWaitlist = recentWaitlistRes.data ?? [];
  const recentPosts = recentPostsRes.data ?? [];

  const stats: StatCardProps[] = [
    {
      label: "Geregistreerde gebruikers",
      value: userCount,
      sub: "via e-mail & Google OAuth",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      label: "Wachtlijst aanmeldingen",
      value: waitlistCount,
      sub: "pre-launch inschrijvingen",
      icon: <Bell className="w-5 h-5 text-amber-600" />,
      color: "bg-amber-50",
    },
    {
      label: "Blog posts",
      value: `${publishedPosts} / ${totalPosts}`,
      sub: "gepubliceerd / totaal",
      icon: <FileText className="w-5 h-5 text-green-600" />,
      color: "bg-green-50",
    },
    {
      label: "Maandelijkse omzet (MRR)",
      value: "€0",
      sub: "productie nog niet live",
      icon: <TrendingUp className="w-5 h-5 text-violet-600" />,
      color: "bg-violet-50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Overzicht</h1>
        <p className="text-slate-500 text-sm mt-1">Alle belangrijke cijfers op één plek.</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent waitlist */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="font-semibold text-slate-800">Recente wachtlijst aanmeldingen</h2>
            <a href="/admin/wachtlijst" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Alles <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="divide-y divide-slate-50">
            {recentWaitlist.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-400 text-center">Nog geen aanmeldingen.</p>
            ) : recentWaitlist.map((entry) => (
              <div key={entry.email} className="flex items-center justify-between px-6 py-3">
                <span className="text-sm text-slate-700 truncate max-w-[200px]">{entry.email}</span>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {new Date(entry.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent blog posts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <h2 className="font-semibold text-slate-800">Recente blog posts</h2>
            <a href="/admin/blog" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Beheer <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="divide-y divide-slate-50">
            {recentPosts.length === 0 ? (
              <p className="px-6 py-8 text-sm text-slate-400 text-center">Nog geen blog posts.</p>
            ) : recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between px-6 py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{post.title}</p>
                  <p className="text-xs text-slate-400">{post.category}</p>
                </div>
                <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  post.published
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {post.published ? "Gepubliceerd" : "Concept"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
