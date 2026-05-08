import { createAdminClient } from "@/lib/supabase/admin";
import {
  Users, Bell, FileText, TrendingUp, ArrowUpRight,
  Plus, Eye, UserCheck, Globe, Zap, Wrench, AlertTriangle,
} from "lucide-react";
import Link from "next/link";

type User = { id: string; email?: string; created_at: string; last_sign_in_at?: string; app_metadata?: { provider?: string } };

function StatCard({
  label, value, sub, icon, color, href,
}: {
  label: string; value: string | number; sub: string;
  icon: React.ReactNode; color: string; href?: string;
}) {
  const inner = (
    <div className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-full transition-all ${href ? "hover:shadow-md hover:border-blue-100 cursor-pointer" : ""}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl font-extrabold text-slate-900 mb-0.5">{value}</div>
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : <div>{inner}</div>;
}

function QuickAction({ href, icon, label, desc, color }: { href: string; icon: React.ReactNode; label: string; desc: string; color: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{label}</p>
        <p className="text-xs text-slate-400 truncate">{desc}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0 ml-auto transition-colors" />
    </Link>
  );
}

export default async function AdminDashboard() {
  const db = createAdminClient();

  const [usersRes, waitlistRes, postsRes, publishedRes, recentWaitlistRes, recentPostsRes, siteSettingsRes] =
    await Promise.all([
      db.auth.admin.listUsers({ perPage: 1000 }),
      db.from("waitlist").select("email, created_at").order("created_at", { ascending: false }),
      db.from("blog_posts").select("id, title, category, published, created_at").order("created_at", { ascending: false }),
      db.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
      db.from("waitlist").select("email, created_at").order("created_at", { ascending: false }).limit(6),
      db.from("blog_posts").select("id, title, category, published, created_at").order("created_at", { ascending: false }).limit(5),
      db.from("site_settings").select("key, value"),
    ]);

  const allUsers: User[] = usersRes.data?.users ?? [];
  const allWaitlist = waitlistRes.data ?? [];
  const allPosts = postsRes.data ?? [];
  const publishedCount = publishedRes.count ?? 0;
  const siteSettings = Object.fromEntries((siteSettingsRes.data ?? []).map((r) => [r.key, r.value]));
  const maintenanceMode = siteSettings.maintenance_mode === "true";

  // Time-based stats
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
  const usersThisWeek = allUsers.filter((u) => new Date(u.created_at).getTime() > weekAgo).length;
  const usersThisMonth = allUsers.filter((u) => new Date(u.created_at).getTime() > monthAgo).length;
  const waitlistThisWeek = allWaitlist.filter((w) => new Date(w.created_at).getTime() > weekAgo).length;
  const googleUsers = allUsers.filter((u) => u.app_metadata?.provider === "google").length;

  const stats = [
    { label: "Geregistreerde gebruikers", value: allUsers.length, sub: `+${usersThisWeek} deze week`, icon: <Users className="w-5 h-5 text-blue-600" />, color: "bg-blue-50", href: "/admin/gebruikers" },
    { label: "Wachtlijst aanmeldingen", value: allWaitlist.length, sub: `+${waitlistThisWeek} deze week`, icon: <Bell className="w-5 h-5 text-amber-600" />, color: "bg-amber-50", href: "/admin/wachtlijst" },
    { label: "Blog posts", value: `${publishedCount} / ${allPosts.length}`, sub: "gepubliceerd / totaal", icon: <FileText className="w-5 h-5 text-green-600" />, color: "bg-green-50", href: "/admin/blog" },
    { label: "MRR", value: "€0", sub: "scan-functie nog niet live", icon: <TrendingUp className="w-5 h-5 text-violet-600" />, color: "bg-violet-50" },
    { label: "Google OAuth gebruikers", value: googleUsers, sub: `van ${allUsers.length} totaal`, icon: <Globe className="w-5 h-5 text-red-500" />, color: "bg-red-50", href: "/admin/gebruikers" },
    { label: "Nieuwe gebruikers (maand)", value: usersThisMonth, sub: "afgelopen 30 dagen", icon: <UserCheck className="w-5 h-5 text-teal-600" />, color: "bg-teal-50", href: "/admin/analytics" },
  ];

  const quickActions = [
    { href: "/admin/blog/new", icon: <Plus className="w-4 h-4 text-blue-600" />, label: "Nieuwe blog post", desc: "Schrijf en publiceer een artikel", color: "bg-blue-50" },
    { href: "/admin/blog", icon: <Eye className="w-4 h-4 text-green-600" />, label: "Posts beheren", desc: `${allPosts.filter(p => !p.published).length} concepten wachten`, color: "bg-green-50" },
    { href: "/admin/gebruikers", icon: <Users className="w-4 h-4 text-violet-600" />, label: "Gebruikers bekijken", desc: `${allUsers.length} geregistreerd`, color: "bg-violet-50" },
    { href: "/admin/analytics", icon: <Zap className="w-4 h-4 text-amber-600" />, label: "Analytics bekijken", desc: "Groei & statistieken", color: "bg-amber-50" },
    { href: "/admin/beheer", icon: <Wrench className="w-4 h-4 text-red-500" />, label: "Site beheer", desc: maintenanceMode ? "Onderhoudsmodus actief" : "Site is online", color: "bg-red-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          {new Date().toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Site status alert */}
      {maintenanceMode && (
        <Link
          href="/admin/beheer"
          className="flex items-start gap-3 px-4 py-4 rounded-xl border bg-red-50 border-red-200 hover:border-red-300 transition-all hover:shadow-sm"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-red-100">
            <Wrench className="w-4 h-4 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-red-800">Onderhoudsmodus is actief</p>
            <p className="text-xs mt-0.5 text-red-600">
              Niet-ingelogde bezoekers zien de onderhoudspagina. Klik om te beheren.
            </p>
          </div>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-1 text-red-400" />
        </Link>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Snelle acties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          {quickActions.map((a) => <QuickAction key={a.href} {...a} />)}
        </div>
      </div>

      {/* Recent data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent waitlist */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="font-semibold text-slate-800 text-sm">Recente wachtlijst aanmeldingen</h2>
            <Link href="/admin/wachtlijst" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
              Alles <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {(recentWaitlistRes.data ?? []).length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">Nog geen aanmeldingen.</p>
            ) : (recentWaitlistRes.data ?? []).map((entry) => (
              <div key={entry.email} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">{entry.email[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-slate-700 truncate">{entry.email}</span>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                  {new Date(entry.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent blog posts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h2 className="font-semibold text-slate-800 text-sm">Recente blog posts</h2>
            <Link href="/admin/blog" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5 font-medium">
              Beheer <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {(recentPostsRes.data ?? []).length === 0 ? (
              <p className="px-5 py-8 text-sm text-slate-400 text-center">Nog geen blog posts.</p>
            ) : (recentPostsRes.data ?? []).map((post) => (
              <Link key={post.id} href={`/admin/blog/${post.id}/edit`} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/60 transition-colors group">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-700 transition-colors">{post.title}</p>
                  <p className="text-xs text-slate-400">{post.category}</p>
                </div>
                <span className={`flex-shrink-0 ml-3 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  post.published ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                }`}>
                  {post.published ? "Live" : "Concept"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
