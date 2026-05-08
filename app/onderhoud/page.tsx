export const dynamic = "force-dynamic";

import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Wrench, Clock, ArrowRight } from "lucide-react";

async function getSettings(): Promise<Record<string, string>> {
  try {
    const db = createAdminClient();
    const { data } = await db.from("site_settings").select("key, value");
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export default async function OnderhoudPage() {
  const settings = await getSettings();
  const message =
    settings.maintenance_message || "We zijn even bezig met onderhoud. We zijn zo terug.";
  const endTimeRaw = settings.maintenance_end;
  const parsedEnd = endTimeRaw ? new Date(endTimeRaw) : null;
  const validEnd = parsedEnd && !isNaN(parsedEnd.getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-8">
        <Wrench className="w-10 h-10 text-blue-400" />
      </div>

      {/* Branding */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <span className="text-white font-bold">ContractScan <span className="text-blue-400">AI</span></span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Even geduld</h1>

      {/* Message */}
      <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-6">{message}</p>

      {/* End time */}
      {validEnd && parsedEnd && (
        <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 text-sm px-4 py-2 rounded-full mb-8">
          <Clock className="w-4 h-4 text-blue-400" />
          Onderhoud eindigt verwacht:{" "}
          {parsedEnd.toLocaleDateString("nl-NL", { day: "numeric", month: "long" })}
          {" "}om{" "}
          {parsedEnd.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
        </div>
      )}

      {/* Status dots */}
      <div className="flex gap-2 mb-10">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>

      {/* Admin link */}
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
