import { createAdminClient } from "@/lib/supabase/admin";
import { Users, Globe, Mail, UserCheck, Clock } from "lucide-react";
import DeleteUserButton from "@/app/components/admin/DeleteUserButton";

type AuthUser = {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
  app_metadata?: { provider?: string };
  user_metadata?: { full_name?: string; name?: string; avatar_url?: string };
};

function ProviderBadge({ provider }: { provider?: string }) {
  if (provider === "google") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
        <Globe className="w-3 h-3" /> Google
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
      <Mail className="w-3 h-3" /> E-mail
    </span>
  );
}

export default async function GebruikersPage() {
  const db = createAdminClient();
  const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
  const users: AuthUser[] = (data?.users ?? []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

  const stats = [
    { label: "Totaal", value: users.length, icon: <Users className="w-4 h-4 text-blue-600" />, color: "bg-blue-50" },
    { label: "Via Google", value: users.filter((u) => u.app_metadata?.provider === "google").length, icon: <Globe className="w-4 h-4 text-red-500" />, color: "bg-red-50" },
    { label: "Via e-mail", value: users.filter((u) => u.app_metadata?.provider !== "google").length, icon: <Mail className="w-4 h-4 text-indigo-600" />, color: "bg-indigo-50" },
    { label: "Deze week", value: users.filter((u) => new Date(u.created_at).getTime() > weekAgo).length, icon: <UserCheck className="w-4 h-4 text-green-600" />, color: "bg-green-50" },
    { label: "Deze maand", value: users.filter((u) => new Date(u.created_at).getTime() > monthAgo).length, icon: <Clock className="w-4 h-4 text-amber-600" />, color: "bg-amber-50" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gebruikers</h1>
        <p className="text-slate-400 text-sm mt-1">{users.length} geregistreerde gebruikers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>{s.icon}</div>
            <div className="text-xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <p className="py-16 text-center text-slate-400 text-sm">Nog geen gebruikers.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Gebruiker</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden sm:table-cell">Provider</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Geregistreerd</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Laatste inlog</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user, i) => {
                  const name = user.user_metadata?.full_name ?? user.user_metadata?.name;
                  const initial = (user.email ?? "?")[0].toUpperCase();
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-slate-400 text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{initial}</span>
                          </div>
                          <div className="min-w-0">
                            {name && <p className="text-xs font-medium text-slate-600 truncate">{name}</p>}
                            <p className="text-sm text-slate-800 truncate max-w-[160px] md:max-w-xs">{user.email ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <ProviderBadge provider={user.app_metadata?.provider} />
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs hidden lg:table-cell">
                        {user.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <DeleteUserButton userId={user.id} email={user.email ?? user.id} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
