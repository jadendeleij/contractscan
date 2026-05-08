import { createAdminClient } from "@/lib/supabase/admin";
import {
  Shield, Users, Bell, FileText, Trash2, Download,
  CheckCircle, AlertCircle, Clock,
} from "lucide-react";
import DeleteUserButton from "@/app/components/admin/DeleteUserButton";
import DeleteWaitlistButton from "@/app/components/admin/DeleteWaitlistButton";

type AuthUser = {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
  app_metadata?: { provider?: string };
};

export default async function PrivacyPage() {
  const db = createAdminClient();

  const [{ data: authData }, { data: waitlist, count: waitlistCount }] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from("waitlist").select("email, created_at", { count: "exact" }).order("created_at", { ascending: false }),
  ]);

  const users: AuthUser[] = authData?.users ?? [];
  const entries = waitlist ?? [];

  const policies = [
    {
      title: "Recht op inzage (Art. 15 AVG)",
      description: "Gebruikers kunnen een kopie opvragen van alle persoonsgegevens die wij bewaren.",
      status: "manual",
      action: "Exporteer gebruikersdata via de gebruikerspagina of neem contact op per e-mail.",
    },
    {
      title: "Recht op verwijdering (Art. 17 AVG)",
      description: "Gebruikers kunnen verzoeken hun account en alle data te verwijderen.",
      status: "done",
      action: "Gebruik de verwijderknop in de gebruikerstabel hieronder.",
    },
    {
      title: "Recht op rectificatie (Art. 16 AVG)",
      description: "Gebruikers kunnen onjuiste persoonsgegevens laten corrigeren.",
      status: "manual",
      action: "Pas e-mail aan via Supabase Dashboard → Authentication → Users.",
    },
    {
      title: "Recht op dataportabiliteit (Art. 20 AVG)",
      description: "Gebruikers kunnen hun data in machineleesbaar formaat opvragen.",
      status: "manual",
      action: "Exporteer via Supabase Dashboard of de API (JSON/CSV).",
    },
    {
      title: "Bewaarplicht & retentiebeleid",
      description: "Persoonsgegevens worden niet langer bewaard dan noodzakelijk.",
      status: "info",
      action: "Inactieve accounts ouder dan 2 jaar handmatig verwijderen. Wachtlijst na launch opruimen.",
    },
    {
      title: "Verwerkersregister (Art. 30 AVG)",
      description: "Documentatie van alle verwerkingsactiviteiten met persoonsgegevens.",
      status: "info",
      action: "Zie gegevensregister hieronder.",
    },
  ];

  const register = [
    { category: "Gebruikersaccounts", data: "E-mail, wachtwoord (hash), OAuth-token", purpose: "Authenticatie & accountbeheer", basis: "Overeenkomst", retention: "Tot verwijdering", processor: "Supabase" },
    { category: "Wachtlijst", data: "E-mailadres, aanmelddatum", purpose: "Pre-launch communicatie", basis: "Toestemming", retention: "Tot lancering + 6 maanden", processor: "Supabase" },
    { category: "Blog analytics", data: "Geen persoonsgegevens", purpose: "Content inzicht", basis: "N.v.t.", retention: "N.v.t.", processor: "Intern" },
    { category: "Contractscans", data: "Contractinhoud (tijdelijk)", purpose: "AI-analyse", basis: "Overeenkomst", retention: "Sessie / max. 24u", processor: "Anthropic" },
  ];

  const statusIcon = (s: string) => {
    if (s === "done") return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (s === "manual") return <AlertCircle className="w-4 h-4 text-amber-500" />;
    return <Clock className="w-4 h-4 text-blue-500" />;
  };

  const statusLabel = (s: string) => {
    if (s === "done") return <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Geautomatiseerd</span>;
    if (s === "manual") return <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Handmatig</span>;
    return <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Info</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Privacy & AVG</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Beheer persoonsgegevens conform de Algemene Verordening Gegevensbescherming (AVG / GDPR).
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Geregistreerde gebruikers", value: users.length, icon: <Users className="w-4 h-4 text-blue-600" />, color: "bg-blue-50" },
          { label: "Wachtlijst aanmeldingen", value: waitlistCount ?? 0, icon: <Bell className="w-4 h-4 text-amber-600" />, color: "bg-amber-50" },
          { label: "Verwerkingen gedocumenteerd", value: register.length, icon: <FileText className="w-4 h-4 text-violet-600" />, color: "bg-violet-50" },
          { label: "Rechten geautomatiseerd", value: policies.filter((p) => p.status === "done").length, icon: <CheckCircle className="w-4 h-4 text-green-600" />, color: "bg-green-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* AVG Rights Checklist */}
      <section>
        <h2 className="text-base font-bold text-slate-800 mb-3">Betrokkenenrechten</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
          {policies.map((p) => (
            <div key={p.title} className="px-5 py-4 flex gap-4">
              <div className="flex-shrink-0 mt-0.5">{statusIcon(p.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-slate-800">{p.title}</span>
                  {statusLabel(p.status)}
                </div>
                <p className="text-xs text-slate-500 mb-1">{p.description}</p>
                <p className="text-xs text-slate-400 italic">{p.action}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Register */}
      <section>
        <h2 className="text-base font-bold text-slate-800 mb-3">Verwerkingsregister (Art. 30 AVG)</h2>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Categorie", "Gegevens", "Doel", "Rechtsgrond", "Bewaartermijn", "Verwerker"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {register.map((r) => (
                  <tr key={r.category} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{r.category}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs max-w-[160px]">{r.data}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{r.purpose}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{r.basis}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{r.retention}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{r.processor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Users — right to erasure */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-800">Gebruikers — recht op verwijdering</h2>
          <span className="text-xs text-slate-400">{users.length} accounts</span>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {users.length === 0 ? (
            <p className="py-12 text-center text-slate-400 text-sm">Geen gebruikers.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Gebruiker</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden sm:table-cell">Provider</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Geregistreerd</th>
                    <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Verwijderen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{(user.email ?? "?")[0].toUpperCase()}</span>
                          </div>
                          <span className="text-sm text-slate-800 truncate max-w-[200px]">{user.email ?? user.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          user.app_metadata?.provider === "google"
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-50 text-blue-600"
                        }`}>
                          {user.app_metadata?.provider === "google" ? "Google" : "E-mail"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <DeleteUserButton userId={user.id} email={user.email ?? user.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Waitlist — right to erasure */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-800">Wachtlijst — recht op verwijdering</h2>
          <a
            href={`data:text/csv;charset=utf-8,E-mail,Datum%0A${entries.map((e) => `${e.email},${new Date(e.created_at).toLocaleDateString("nl-NL")}`).join("%0A")}`}
            download="wachtlijst.csv"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            CSV export
          </a>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {entries.length === 0 ? (
            <p className="py-12 text-center text-slate-400 text-sm">Geen wachtlijst aanmeldingen.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">E-mailadres</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden sm:table-cell">Aangemeld op</th>
                    <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Verwijderen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {entries.map((entry) => (
                    <tr key={entry.email} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-amber-700">{entry.email[0].toUpperCase()}</span>
                          </div>
                          <span className="font-medium text-slate-800">{entry.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs hidden sm:table-cell">
                        {new Date(entry.created_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <DeleteWaitlistButton email={entry.email} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Footer note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex gap-3">
        <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900 mb-0.5">AVG-contact</p>
          <p className="text-xs text-blue-700">
            Verzoeken van betrokkenen binnengekomen via e-mail? Verwerk ze binnen 30 dagen.
            Bij twijfel raadpleeg een juridisch adviseur of de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).
          </p>
        </div>
      </div>
    </div>
  );
}
