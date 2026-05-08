import { createAdminClient } from "@/lib/supabase/admin";
import { TrendingUp, Users, Bell, FileText, Globe, Mail } from "lucide-react";

type AuthUser = {
  id: string;
  created_at: string;
  app_metadata?: { provider?: string };
};

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-6 text-right tabular-nums">{value}</span>
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default async function AnalyticsPage() {
  const db = createAdminClient();

  const [usersRes, waitlistRes, postsRes] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from("waitlist").select("email, created_at").order("created_at", { ascending: false }),
    db.from("blog_posts").select("id, title, category, published, created_at"),
  ]);

  const users: AuthUser[] = usersRes.data?.users ?? [];
  const waitlist = waitlistRes.data ?? [];
  const posts = postsRes.data ?? [];

  const now = new Date();
  const msPerDay = 86_400_000;

  // Build last 14 days labels + counts
  const days14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now.getTime() - (13 - i) * msPerDay);
    const label = d.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + msPerDay;
    const uCount = users.filter((u) => {
      const t = new Date(u.created_at).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;
    const wCount = waitlist.filter((w) => {
      const t = new Date(w.created_at).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;
    return { label, uCount, wCount };
  });

  const maxUsers = Math.max(...days14.map((d) => d.uCount), 1);
  const maxWaitlist = Math.max(...days14.map((d) => d.wCount), 1);

  // Totals
  const weekAgo = now.getTime() - 7 * msPerDay;
  const monthAgo = now.getTime() - 30 * msPerDay;
  const usersThisWeek = users.filter((u) => new Date(u.created_at).getTime() > weekAgo).length;
  const usersThisMonth = users.filter((u) => new Date(u.created_at).getTime() > monthAgo).length;
  const waitlistThisWeek = waitlist.filter((w) => new Date(w.created_at).getTime() > weekAgo).length;

  // Provider breakdown
  const googleCount = users.filter((u) => u.app_metadata?.provider === "google").length;
  const emailCount = users.length - googleCount;

  // Blog by category
  const categories = [...new Set(posts.map((p) => p.category))];
  const categoryStats = categories.map((cat) => ({
    cat,
    total: posts.filter((p) => p.category === cat).length,
    published: posts.filter((p) => p.category === cat && p.published).length,
  })).sort((a, b) => b.total - a.total);
  const maxCat = Math.max(...categoryStats.map((c) => c.total), 1);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Groei & statistieken op één plek.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Gebruikers totaal", value: users.length, sub: `+${usersThisWeek} deze week`, icon: <Users className="w-4 h-4 text-blue-600" />, color: "bg-blue-50" },
          { label: "Nieuwe (maand)", value: usersThisMonth, sub: "afgelopen 30 dagen", icon: <TrendingUp className="w-4 h-4 text-green-600" />, color: "bg-green-50" },
          { label: "Wachtlijst", value: waitlist.length, sub: `+${waitlistThisWeek} deze week`, icon: <Bell className="w-4 h-4 text-amber-600" />, color: "bg-amber-50" },
          { label: "Blog posts", value: posts.filter((p) => p.published).length, sub: `van ${posts.length} totaal`, icon: <FileText className="w-4 h-4 text-violet-600" />, color: "bg-violet-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">{s.label}</div>
            <div className="text-xs text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User registrations per day */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="Nieuwe gebruikers (14 dagen)" sub="Registraties per dag" />
          <div className="flex flex-col gap-2">
            {days14.map((d) => (
              <div key={d.label} className="grid grid-cols-[72px_1fr] gap-3 items-center">
                <span className="text-xs text-slate-400 text-right">{d.label}</span>
                <Bar value={d.uCount} max={maxUsers} color="bg-blue-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Waitlist signups per day */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="Wachtlijst aanmeldingen (14 dagen)" sub="Signups per dag" />
          <div className="flex flex-col gap-2">
            {days14.map((d) => (
              <div key={d.label} className="grid grid-cols-[72px_1fr] gap-3 items-center">
                <span className="text-xs text-slate-400 text-right">{d.label}</span>
                <Bar value={d.wCount} max={maxWaitlist} color="bg-amber-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Provider breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="Registratie methode" sub="Hoe gebruikers zich aanmelden" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-700">Google OAuth</span>
                  <span className="text-sm font-bold text-slate-900">{googleCount}</span>
                </div>
                <Bar value={googleCount} max={users.length || 1} color="bg-red-400" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold text-slate-700">E-mail & wachtwoord</span>
                  <span className="text-sm font-bold text-slate-900">{emailCount}</span>
                </div>
                <Bar value={emailCount} max={users.length || 1} color="bg-blue-500" />
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-50">
              {users.length > 0
                ? `${Math.round((googleCount / users.length) * 100)}% kiest voor Google inloggen`
                : "Nog geen gebruikers"}
            </p>
          </div>
        </div>

        {/* Blog category breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader title="Blog per categorie" sub="Aantal posts per categorie" />
          {categoryStats.length === 0 ? (
            <p className="text-sm text-slate-400 py-4 text-center">Nog geen blog posts.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {categoryStats.map(({ cat, total, published }) => (
                <div key={cat}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-semibold text-slate-700">{cat}</span>
                    <span className="text-xs text-slate-400">{published} gepubl. / {total} totaal</span>
                  </div>
                  <Bar value={total} max={maxCat} color="bg-violet-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue placeholder */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold">Omzet & Abonnementen</h2>
            <p className="text-slate-400 text-xs">Beschikbaar zodra betalingen live gaan</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[["MRR", "€0"], ["ARR", "€0"], ["Actieve subs", "0"]].map(([label, val]) => (
            <div key={label} className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-extrabold">{val}</div>
              <div className="text-xs text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
