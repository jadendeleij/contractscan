export const dynamic = "force-dynamic";

import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Wrench, Clock, ArrowRight, CheckCircle } from "lucide-react";

async function getSettings(): Promise<Record<string, string>> {
  try {
    const db = createAdminClient();
    const { data } = await db.from("site_settings").select("key, value");
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

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

const Branding = () => (
  <div className="flex items-center gap-2 mb-6">
    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    </div>
    <span className="text-white font-bold">ContractScan <span className="text-blue-400">AI</span></span>
  </div>
);

export default async function OnderhoudPage() {
  const settings = await getSettings();

  const maintenanceOn = settings.maintenance_mode === "true";
  const scheduledDate = parseStoredDate(settings.maintenance_scheduled_at || "");
  const scheduledPassed = !!scheduledDate && scheduledDate <= new Date();
  const scheduledUpcoming = !!scheduledDate && scheduledDate > new Date();
  const inMaintenance = maintenanceOn || scheduledPassed;

  const wrapper = "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6 text-center";

  // ── Site is online ───────────────────────────────────────────
  if (!inMaintenance) {
    return (
      <div className={wrapper}>
        <div className="w-20 h-20 rounded-2xl bg-green-600/20 border border-green-500/30 flex items-center justify-center mb-8">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <Branding />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Alles werkt normaal</h1>
        <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-6">
          Er is op dit moment geen onderhoud actief.
        </p>
        {scheduledUpcoming && scheduledDate && (
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm px-4 py-2 rounded-full mb-8">
            <Clock className="w-4 h-4 text-amber-400" />
            Gepland onderhoud:{" "}
            {scheduledDate.toLocaleDateString("nl-NL", { day: "numeric", month: "long", timeZone: "Europe/Amsterdam" })}{" "}
            om {scheduledDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" })}
          </div>
        )}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors mb-10"
        >
          Terug naar de site
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          Admin toegang
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    );
  }

  // ── Maintenance active ───────────────────────────────────────
  const message = settings.maintenance_message || "We zijn even bezig met onderhoud. We zijn zo terug.";
  const parsedEnd = parseStoredDate(settings.maintenance_end || "");

  return (
    <div className={wrapper}>
      <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-8">
        <Wrench className="w-10 h-10 text-blue-400" />
      </div>
      <Branding />
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Even geduld</h1>
      <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-6">{message}</p>
      {parsedEnd && (
        <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm px-4 py-2 rounded-full mb-8">
          <Clock className="w-4 h-4 text-blue-400" />
          Onderhoud eindigt verwacht:{" "}
          {parsedEnd.toLocaleDateString("nl-NL", { day: "numeric", month: "long", timeZone: "Europe/Amsterdam" })}
          {" "}om{" "}
          {parsedEnd.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" })}
        </div>
      )}
      <div className="flex gap-2 mb-10">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
      >
        Admin toegang
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
