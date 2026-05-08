import { createAdminClient } from "@/lib/supabase/admin";
import {
  Wrench, Code2, ShieldCheck, CheckCircle, AlertTriangle,
  Clock, Globe, Eye,
} from "lucide-react";
import MaintenanceControls from "@/app/components/admin/MaintenanceControls";

async function getSettings(): Promise<Record<string, string>> {
  try {
    const db = createAdminClient();
    const { data } = await db.from("site_settings").select("key, value");
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export default async function BeheerPage() {
  const settings = await getSettings();
  const maintenanceMode = settings.maintenance_mode === "true";
  const devMode = settings.dev_mode === "true";
  const message = settings.maintenance_message || "We zijn even bezig met onderhoud. We zijn zo terug.";
  const endTime = settings.maintenance_end || "";
  const bypassSecret = process.env.BYPASS_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contractscan-beta.vercel.app";

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Site Beheer</h1>
        <p className="text-slate-400 text-sm mt-1">
          Beheer de toegankelijkheid van de website voor externe bezoekers.
        </p>
      </div>

      {/* Active alert */}
      {(maintenanceMode || devMode) && (
        <div className={`flex items-start gap-3 px-4 py-4 rounded-xl border ${
          maintenanceMode
            ? "bg-red-50 border-red-200 text-red-800"
            : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">
              {maintenanceMode ? "Onderhoudsmodus is actief" : "Ontwikkelmodus is actief"}
            </p>
            <p className="text-sm opacity-80 mt-0.5">
              {maintenanceMode
                ? "Externe bezoekers zien de onderhoudspagina. Admins kunnen de site nog bereiken via /admin."
                : "Externe bezoekers zonder bypass-cookie zien de onderhoudspagina."}
            </p>
          </div>
        </div>
      )}

      {/* Site status overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${maintenanceMode ? "bg-red-50" : "bg-green-50"}`}>
            <Globe className={`w-4 h-4 ${maintenanceMode ? "text-red-500" : "text-green-600"}`} />
          </div>
          <div className={`text-sm font-bold ${maintenanceMode ? "text-red-700" : "text-green-700"}`}>
            {maintenanceMode ? "Offline" : "Online"}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Publieke site</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${devMode ? "bg-amber-50" : "bg-green-50"}`}>
            <Code2 className={`w-4 h-4 ${devMode ? "text-amber-600" : "text-green-600"}`} />
          </div>
          <div className={`text-sm font-bold ${devMode ? "text-amber-700" : "text-green-700"}`}>
            {devMode ? "Actief" : "Uit"}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Ontwikkelmodus</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 bg-blue-50">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-blue-700">Altijd aan</div>
          <div className="text-xs text-slate-400 mt-0.5">Admin panel</div>
        </div>
      </div>

      {/* Client-side controls */}
      <MaintenanceControls
        maintenanceMode={maintenanceMode}
        devMode={devMode}
        message={message}
        endTime={endTime}
      />

      {/* Developer bypass */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Eye className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-800">Ontwikkelaar bypass</h2>
        </div>
        <p className="text-sm text-slate-500">
          Met de bypass-URL kunnen developers de echte site bekijken terwijl onderhoud- of ontwikkelmodus actief is.
          De bypass geldt 24 uur via een cookie.
        </p>

        {bypassSecret ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-green-700 font-medium">BYPASS_SECRET is ingesteld in omgevingsvariabelen</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bypass URL</p>
              <code className="text-xs text-slate-800 break-all">
                {siteUrl}/api/bypass?secret={bypassSecret}
              </code>
              <p className="text-xs text-slate-400">
                Bezoek deze URL in de browser om 24 uur toegang te krijgen tot de site tijdens onderhoud.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700">BYPASS_SECRET niet ingesteld</p>
              <p className="text-xs text-slate-500 mt-1">
                Voeg <code className="bg-white px-1 rounded border border-slate-200">BYPASS_SECRET=jouwgeheimecode</code> toe
                aan je Vercel omgevingsvariabelen om de bypass-URL te activeren.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
