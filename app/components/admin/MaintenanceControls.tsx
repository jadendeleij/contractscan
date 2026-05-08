"use client";

import { useTransition, useState } from "react";
import { Wrench, Globe, Loader2, Save, CheckCircle, X } from "lucide-react";
import { toggleMaintenanceMode, savePlannedMaintenance, saveScheduledMaintenance } from "@/app/actions/site";

type Props = {
  maintenanceMode: boolean;
  message: string;
  endTime: string;
  scheduledAt: string;
};

export default function MaintenanceControls({ maintenanceMode, message, endTime, scheduledAt }: Props) {
  const [modePending, startModeTransition] = useTransition();
  const [savePending, startSaveTransition] = useTransition();

  const [localMsg, setLocalMsg] = useState(message);
  const [localEnd, setLocalEnd] = useState(endTime);
  const [localScheduled, setLocalScheduled] = useState(scheduledAt);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Mirrors what's actually committed to the DB so status banner updates immediately
  // after save/cancel without waiting for a server re-render.
  const [committedSchedule, setCommittedSchedule] = useState(scheduledAt);

  const hasSchedule = !!committedSchedule;
  const scheduledDate = hasSchedule ? new Date(committedSchedule) : null;
  const scheduledValid = scheduledDate && !isNaN(scheduledDate.getTime());
  const scheduledInFuture = scheduledValid && scheduledDate > new Date();

  function setMode(on: boolean) {
    if (on === maintenanceMode || modePending) return;
    startModeTransition(() => toggleMaintenanceMode(on));
  }

  function handleSave() {
    setSaveError(null);
    startSaveTransition(async () => {
      try {
        await savePlannedMaintenance(localScheduled, localMsg, localEnd);
        setCommittedSchedule(localScheduled);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Opslaan mislukt");
      }
    });
  }

  function handleCancelSchedule() {
    setSaveError(null);
    startSaveTransition(async () => {
      try {
        await saveScheduledMaintenance("");
        setCommittedSchedule("");
        setLocalScheduled("");
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Annuleren mislukt");
      }
    });
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

  return (
    <div className="space-y-6">

      {/* ── Mode selector ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-0.5">Site modus</h2>
        <p className="text-xs text-slate-400 mb-5">
          In onderhoudsmodus zien niet-ingelogde bezoekers de onderhoudspagina.
          Ingelogde gebruikers kunnen de site gewoon bereiken.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode(false)}
            disabled={modePending}
            className={`p-4 rounded-xl border-2 text-left transition-all disabled:cursor-wait ${
              !maintenanceMode ? "border-green-500 bg-green-50/40" : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center mb-3">
              {modePending && maintenanceMode
                ? <Loader2 className="w-3.5 h-3.5 text-green-600 animate-spin" />
                : <Globe className="w-3.5 h-3.5 text-green-600" />}
            </div>
            <p className="text-sm font-bold text-slate-800">Online</p>
            <p className="text-xs text-slate-400 mt-1">Site bereikbaar voor iedereen.</p>
          </button>

          <button
            onClick={() => setMode(true)}
            disabled={modePending}
            className={`p-4 rounded-xl border-2 text-left transition-all disabled:cursor-wait ${
              maintenanceMode ? "border-red-400 bg-red-50/40" : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center mb-3">
              {modePending && !maintenanceMode
                ? <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin" />
                : <Wrench className="w-3.5 h-3.5 text-red-500" />}
            </div>
            <p className="text-sm font-bold text-slate-800">Onderhoud</p>
            <p className="text-xs text-slate-400 mt-1">Niet-ingelogde bezoekers zien de onderhoudspagina.</p>
          </button>
        </div>
      </section>

      {/* ── Configuration: schedule + message ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-0.5">Onderhoud configureren</h2>
        <p className="text-xs text-slate-400 mb-5">
          Plan een toekomstig onderhoud en stel het bericht in dat bezoekers te zien krijgen.
        </p>

        {/* Scheduled status banner — always shown when a schedule exists in DB */}
        {hasSchedule && (
          <div className={`flex items-start justify-between gap-4 mb-5 p-3.5 rounded-xl border ${
            scheduledInFuture ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"
          }`}>
            <div className="min-w-0">
              <p className={`text-xs font-bold uppercase tracking-wide mb-0.5 ${scheduledInFuture ? "text-blue-500" : "text-amber-500"}`}>
                {scheduledInFuture ? "Gepland onderhoud" : "Tijd verstreken"}
              </p>
              <p className={`text-sm font-semibold ${scheduledInFuture ? "text-blue-800" : "text-amber-800"}`}>
                {scheduledValid && scheduledDate
                  ? `${scheduledDate.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })} om ${scheduledDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}`
                  : scheduledAt}
              </p>
              {!scheduledInFuture && (
                <p className="text-xs text-amber-700 mt-1">
                  Zet de site handmatig op Online als het onderhoud klaar is.
                </p>
              )}
            </div>
            {/* Cancel is always reachable when schedule exists */}
            <button
              onClick={handleCancelSchedule}
              disabled={savePending}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                scheduledInFuture
                  ? "border-blue-300 text-blue-700 hover:bg-blue-100"
                  : "border-amber-300 text-amber-700 hover:bg-amber-100"
              }`}
            >
              {savePending ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
              Annuleer planning
            </button>
          </div>
        )}

        <div className="space-y-4">
          {/* Schedule datetime — always visible so you can always set/change it */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Inplannen op <span className="text-slate-400 font-normal">(optioneel)</span>
            </label>
            <input
              type="datetime-local"
              value={localScheduled}
              onChange={(e) => setLocalScheduled(e.target.value)}
              className={inputCls}
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Bezoekers zien een aankondiging. Op dit tijdstip gaat de site automatisch in onderhoudsmodus.
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Bericht voor bezoekers
            </label>
            <textarea
              rows={3}
              value={localMsg}
              onChange={(e) => setLocalMsg(e.target.value)}
              placeholder="We zijn even bezig met onderhoud. We zijn zo terug."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* End time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Verwachte eindtijd <span className="text-slate-400 font-normal">(optioneel)</span>
            </label>
            <input
              type="datetime-local"
              value={localEnd}
              onChange={(e) => setLocalEnd(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap pt-1">
            <button
              onClick={handleSave}
              disabled={savePending}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              {savePending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Opslaan
            </button>
            {/* Secondary cancel in the button row — always visible when a schedule exists */}
            {hasSchedule && (
              <button
                onClick={handleCancelSchedule}
                disabled={savePending}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Annuleer planning
              </button>
            )}
            {saved && !savePending && (
              <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                Opgeslagen
              </span>
            )}
            {saveError && !savePending && (
              <span className="text-red-600 text-sm font-medium">{saveError}</span>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
