import { createClient } from "@/lib/supabase/server";

export default async function WachtlijstPage() {
  const supabase = await createClient();
  const { data: entries, count } = await supabase
    .from("waitlist")
    .select("email, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Wachtlijst</h1>
        <p className="text-slate-500 text-sm mt-1">{count ?? 0} aanmeldingen totaal</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {!entries?.length ? (
          <p className="px-6 py-12 text-center text-slate-400 text-sm">Nog geen aanmeldingen.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-3.5 font-semibold text-slate-600">#</th>
                <th className="text-left px-4 py-3.5 font-semibold text-slate-600">E-mailadres</th>
                <th className="text-right px-6 py-3.5 font-semibold text-slate-600">Aangemeld op</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {entries.map((entry, i) => (
                <tr key={entry.email} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5 text-slate-400">{(entries.length - i).toString().padStart(2, "0")}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">{entry.email}</td>
                  <td className="px-6 py-3.5 text-right text-slate-400">
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
