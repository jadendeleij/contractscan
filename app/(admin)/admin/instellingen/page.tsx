import { ShieldCheck, Globe, Key, Database, Zap, ExternalLink, CheckCircle, Clock } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50">
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Row({ label, value, status }: { label: string; value: string; status?: "ok" | "pending" | "none" }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        {status === "ok" && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
        {status === "pending" && <Clock className="w-3.5 h-3.5 text-amber-400" />}
        <span className="text-sm font-medium text-slate-800 text-right max-w-[200px] truncate">{value}</span>
      </div>
    </div>
  );
}

function Toggle({ label, desc, enabled }: { label: string; desc: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <div className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${enabled ? "bg-blue-500" : "bg-slate-200"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${enabled ? "left-5" : "left-0.5"}`} />
      </div>
    </div>
  );
}

export default function InstellingenPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "—";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const projectId = supabaseUrl.match(/https:\/\/(.+)\.supabase\.co/)?.[1] ?? "—";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Instellingen</h1>
        <p className="text-slate-400 text-sm mt-1">Overzicht van projectconfiguratie en systeemstatus.</p>
      </div>

      {/* Site info */}
      <Section title="Site informatie">
        <Row label="Project naam" value="ContractScan AI" status="ok" />
        <Row label="Site URL" value={siteUrl} status="ok" />
        <Row label="Supabase Project ID" value={projectId} status="ok" />
        <Row label="Omgeving" value={process.env.NODE_ENV ?? "development"} />
      </Section>

      {/* Feature flags */}
      <Section title="Functies">
        <Toggle label="Gebruikersregistratie" desc="Nieuwe gebruikers kunnen zich aanmelden" enabled={true} />
        <Toggle label="Google OAuth" desc="Inloggen via Google account" enabled={true} />
        <Toggle label="Wachtlijst" desc="/mailing-list pagina is actief" enabled={true} />
        <Toggle label="Scan-functie" desc="Contract uploaden & analyseren" enabled={false} />
        <Toggle label="Betalingen" desc="Stripe of Mollie koppeling" enabled={false} />
        <Toggle label="Onderhoudsmodus" desc="Site tijdelijk offline voor bezoekers" enabled={false} />
      </Section>

      {/* Auth providers */}
      <Section title="Authenticatie providers">
        <div className="flex flex-col gap-3">
          {[
            { name: "E-mail / Wachtwoord", status: "ok" as const, badge: "Actief" },
            { name: "Google OAuth", status: "ok" as const, badge: "Actief" },
            { name: "GitHub", status: "none" as const, badge: "Niet ingesteld" },
            { name: "Magic Link", status: "none" as const, badge: "Niet ingesteld" },
          ].map(({ name, status, badge }) => (
            <div key={name} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <span className="text-sm text-slate-600">{name}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                status === "ok" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-400"
              }`}>
                {badge}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Environment keys status */}
      <Section title="Omgevingsvariabelen">
        <div className="flex flex-col gap-3">
          {[
            { key: "NEXT_PUBLIC_SUPABASE_URL", set: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
            { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
            { key: "SUPABASE_SERVICE_ROLE_KEY", set: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
            { key: "NEXT_PUBLIC_SITE_URL", set: !!process.env.NEXT_PUBLIC_SITE_URL },
            { key: "ADMIN_EMAILS", set: !!process.env.ADMIN_EMAILS },
          ].map(({ key, set }) => (
            <div key={key} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
              <span className="text-xs font-mono text-slate-600">{key}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                set ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
              }`}>
                {set ? "✓ Ingesteld" : "✗ Ontbreekt"}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Quick links */}
      <Section title="Externe beheer links">
        <div className="flex flex-col gap-3">
          {[
            { label: "Supabase Dashboard", desc: "Database, Auth, Logs", href: `https://supabase.com/dashboard/project/${projectId}`, icon: <Database className="w-4 h-4 text-green-600" />, color: "bg-green-50" },
            { label: "Vercel Dashboard", desc: "Deployments, Env vars, Logs", href: "https://vercel.com/jadendeleijs-projects/contractscan", icon: <Zap className="w-4 h-4 text-slate-700" />, color: "bg-slate-100" },
            { label: "GitHub Repository", desc: "Broncode & commits", href: "https://github.com/jadendeleij/contractscan", icon: <Key className="w-4 h-4 text-slate-700" />, color: "bg-slate-100" },
            { label: "Google Console", desc: "OAuth 2.0 credentials", href: "https://console.cloud.google.com", icon: <Globe className="w-4 h-4 text-blue-600" />, color: "bg-blue-50" },
          ].map(({ label, desc, href, icon, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 flex-shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section title="Beveiliging">
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
          <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">Admin toegang beveiligd</p>
            <p className="text-xs text-green-600 mt-0.5">
              Admin panel is beschermd via database-check (<code className="font-mono">profiles.is_admin</code>). Alleen gebruikers met is_admin = true hebben toegang.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
