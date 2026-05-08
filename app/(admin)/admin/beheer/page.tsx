export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import { Wrench, ShieldCheck, CheckCircle, AlertTriangle, Clock, Globe, Eye, Calendar } from "lucide-react";
import MaintenanceControls from "@/app/components/admin/MaintenanceControls";

function amsOffsetMs(utcDate: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Amsterdam",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const p = Object.fromEntries(fmt.formatToParts(utcDate).map(({ type, value }) => [type, Number(value)]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - utcDate.getTime();
}

function parseStoredDate(stored: string): Date | null {
  if (!stored) return null;
  if (stored.includes("Z") || /[+-]\d{2}:?\d{2}$/.test(stored)) {
    const d = new Date(stored); return isNaN(d.getTime()) ? null : d;
  }
  const approx = new Date(stored + "Z");
  if (isNaN(approx.getTime())) return null;
  return new Date(approx.getTime() - amsOffsetMs(approx));
}

async function getSettings(): Promise<Record<string, string>> {
  try {
    const db = createAdminClient();
    const { data } = await db.from("site_settings").select("key, value");
    const settings = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));

    // Migrate legacy format (no tz suffix) → UTC ISO so proxy comparison is correct.
    const raw = settings.maintenance_scheduled_at;
    if (raw && !raw.includes("Z") && !/[+-]\d{2}:?\d{2}$/.test(raw)) {
      const parsed = parseStoredDate(raw);
      if (parsed) {
        const utcIso = parsed.toISOString();
        await db.from("site_settings").upsert({ key: "maintenance_scheduled_at", value: utcIso }, { onConflict: "key" });
        settings.maintenance_scheduled_at = utcIso;
      }
    }

    // Auto-activate: if the scheduled time has passed, flip maintenance_mode now
    // so the page renders the correct state without needing the proxy to fire first.
    const scheduledAt = settings.maintenance_scheduled_at;
    if (scheduledAt && settings.maintenance_mode !== "true") {
      const d = parseStoredDate(scheduledAt);
      if (d && d <= new Date()) {
        await db.from("site_settings").upsert(
          [{ key: "maintenance_mode", value: "true" }, { key: "maintenance_scheduled_at", value: "" }],
          { onConflict: "key" }
        );
        settings.maintenance_mode = "true";
        settings.maintenance_scheduled_at = "";
      }
    }

    return settings;
  } catch {
    return {};
  }
}

export default async function BeheerPage() {
  const settings = await getSettings();
  const maintenanceMode = settings.maintenance_mode === "true";
  const message = settings.maintenance_message || "We zijn even bezig met onderhoud. We zijn zo terug.";
  const endTime = settings.maintenance_end || "";
  const scheduledAt = settings.maintenance_scheduled_at || "";
  const bypassSecret = process.env.BYPASS_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contractscan-beta.vercel.app";

  const scheduledDate = parseStoredDate(scheduledAt);
  const scheduledInFuture = !!scheduledDate && scheduledDate > new Date();

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
      {maintenanceMode && (
        <div className="flex items-start gap-3 px-4 py-4 rounded-xl border bg-red-50 border-red-200 text-red-800">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Onderhoudsmodus is actief</p>
            <p className="text-sm opacity-80 mt-0.5">
              Niet-ingelogde bezoekers zien de onderhoudspagina. Ingelogde gebruikers kunnen de site nog bereiken.
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
            {maintenanceMode ? "Onderhoud" : "Online"}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Publieke site</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${scheduledInFuture ? "bg-blue-50" : "bg-slate-50"}`}>
            <Calendar className={`w-4 h-4 ${scheduledInFuture ? "text-blue-600" : "text-slate-400"}`} />
          </div>
          <div className={`text-sm font-bold ${scheduledInFuture ? "text-blue-700" : "text-slate-400"}`}>
            {scheduledInFuture && scheduledDate
              ? scheduledDate.toLocaleDateString("nl-NL", { day: "numeric", month: "short", timeZone: "Europe/Amsterdam" })
              : "Niet gepland"
            }
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Gepland onderhoud</div>
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
        message={message}
        endTime={endTime}
        scheduledAt={scheduledAt}
      />

      {/* DB debug — shows what's actually stored right now */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">DB-waarden (live)</p>
        <div className="space-y-1 font-mono text-xs text-slate-700">
          {Object.entries(settings).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-slate-400 shrink-0">{k}:</span>
              <span className="break-all">{v || <span className="text-slate-300">(leeg)</span>}</span>
            </div>
          ))}
          {Object.keys(settings).length === 0 && (
            <p className="text-red-500">⚠ site_settings tabel is leeg of niet bereikbaar</p>
          )}
        </div>
      </section>

      {/* Developer info */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Eye className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-800">Toegang tijdens onderhoud</h2>
        </div>
        <p className="text-sm text-slate-500">
          Als je bent ingelogd op ContractScan AI kun je de site altijd bereiken, ook tijdens onderhoud.
          Het admin panel is altijd toegankelijk via <code className="bg-slate-100 px-1 rounded text-xs">/admin</code>.
        </p>
        <div className="flex items-center gap-2 text-sm bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-green-800">
            Jij ziet de site altijd, omdat je bent ingelogd als admin.
          </span>
        </div>

        {bypassSecret ? (
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bypass URL (voor niet-ingelogde developers)</p>
            <code className="text-xs text-slate-800 break-all block">
              {siteUrl}/api/bypass?secret={bypassSecret}
            </code>
            <p className="text-xs text-slate-400">
              Bezoek deze URL om een bypass-cookie voor 24 uur te activeren.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700">BYPASS_SECRET niet ingesteld</p>
              <p className="text-xs text-slate-500 mt-1">
                Voeg <code className="bg-white px-1 rounded border border-slate-200">BYPASS_SECRET=jouwgeheimecode</code> toe
                aan je Vercel omgevingsvariabelen voor een bypass-URL voor niet-ingelogde developers.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
