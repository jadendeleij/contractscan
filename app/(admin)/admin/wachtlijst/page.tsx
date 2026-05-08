import { createAdminClient } from "@/lib/supabase/admin";
import { Bell, Download } from "lucide-react";

export default async function WachtlijstPage() {
  const db = createAdminClient();
  const { data: entries, count } = await db
    .from("waitlist")
    .select("email, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
  const thisWeek = (entries ?? []).filter((e) => new Date(e.created_at).getTime() > weekAgo).length;
  const thisMonth = (entries ?? []).filter((e) => new Date(e.created_at).getTime() > monthAgo).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wachtlijst</h1>
          <p className="text-slate-400 text-sm mt-1">{count ?? 0} pre-launch aanmeldingen</p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,E-mail,Datum%0A${(entries ?? []).map((e) => `${e.email},${new Date(e.created_at).toLocaleDateString("nl-NL")}`).join("%0A")}`}
          download="wachtlijst.csv"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl transition-all"
        >
          <Download className="w-4 h-4" />
          CSV export
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Totaal", value: count ?? 0, color: "bg-amber-50", iconColor: "text-amber-600" },
          { label: "Deze week", value: thisWeek, color: "bg-green-50", iconColor: "text-green-600" },
          { label: "Deze maand", value: thisMonth, color: "bg-blue-50", iconColor: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>
              <Bell className={`w-4 h-4 ${s.iconColor}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {!entries?.length ? (
          <p className="px-6 py-12 text-center text-slate-400 text-sm">Nog geen aanmeldingen.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">E-mailadres</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Aangemeld op</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {entries.map((entry, i) => (
                <tr key={entry.email} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-slate-400 text-xs tabular-nums">
                    {String(entries.length - i).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-700">{entry.email[0].toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-slate-800">{entry.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-400 text-xs">
                    {new Date(entry.created_at).toLocaleDateString("nl-NL", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
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
