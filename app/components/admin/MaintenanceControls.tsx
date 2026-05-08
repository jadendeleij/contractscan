"use client";

import { useTransition, useState } from "react";
import { Wrench, Globe, Loader2, Save, CheckCircle, X, Calendar } from "lucide-react";
import { toggleMaintenanceMode, saveScheduledMaintenance, saveMaintenanceMessage } from "@/app/actions/site";

type Props = {
  maintenanceMode: boolean;
  message: string;
  endTime: string;
  scheduledAt: string;
};

export default function MaintenanceControls({ maintenanceMode, message, endTime, scheduledAt }: Props) {
  const [modePending, startModeTransition] = useTransition();
  const [schedulePending, startScheduleTransition] = useTransition();
  const [msgPending, startMsgTransition] = useTransition();

  // ── Schedule section ──────────────────────────────────────────
  const [localScheduled, setLocalScheduled] = useState(scheduledAt);
  const [committedSchedule, setCommittedSchedule] = useState(scheduledAt);
  const [scheduleSaved, setScheduleSaved] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const hasSchedule = !!committedSchedule;
  const scheduledDate = hasSchedule ? new Date(committedSchedule) : null;
  const scheduledValid = scheduledDate && !isNaN(scheduledDate.getTime());
  const scheduledInFuture = scheduledValid && scheduledDate > new Date();

  // ── Message section ───────────────────────────────────────────
  const [localMsg, setLocalMsg] = useState(message);
  const [localEnd, setLocalEnd] = useState(endTime);
  const [msgSaved, setMsgSaved] = useState(false);
  const [msgError, setMsgError] = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────
  function setMode(on: boolean) {
    if (on === maintenanceMode || modePending) return;
    startModeTransition(() => toggleMaintenanceMode(on));
  }

  function handleSchedule() {
    setScheduleError(null);
    if (!localScheduled) {
      setScheduleError("Selecteer een datum en tijd om onderhoud in te plannen.");
      return;
    }
    startScheduleTransition(async () => {
      try {
        await saveScheduledMaintenance(localScheduled);
        setCommittedSchedule(localScheduled);
        setScheduleSaved(true);
        setTimeout(() => setScheduleSaved(false), 3000);
      } catch (err) {
        setScheduleError(err instanceof Error ? err.message : "Inplannen mislukt");
      }
    });
  }

  function handleCancelSchedule() {
    setScheduleError(null);
    startScheduleTransition(async () => {
      try {
        await saveScheduledMaintenance("");
        setCommittedSchedule("");
        setLocalScheduled("");
        setScheduleSaved(false);
      } catch (err) {
        setScheduleError(err instanceof Error ? err.message : "Annuleren mislukt");
      }
    });
  }

  function handleSaveMsg() {
    setMsgError(null);
    startMsgTransition(async () => {
      try {
        await saveMaintenanceMessage(localMsg, localEnd);
        setMsgSaved(true);
        setTimeout(() => setMsgSaved(false), 3000);
      } catch (err) {
        setMsgError(err instanceof Error ? err.message : "Opslaan mislukt");
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

      {/* ── Schedule future maintenance ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-0.5">Onderhoud inplannen</h2>
        <p className="text-xs text-slate-400 mb-5">
          Kies een starttijd. Bezoekers zien dan een aankondiging en de site gaat op dat moment automatisch in onderhoudsmodus.
        </p>

        {/* Existing schedule banner */}
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
                  : committedSchedule}
              </p>
              {!scheduledInFuture && (
                <p className="text-xs text-amber-700 mt-1">
                  Zet de site handmatig op Online als het onderhoud klaar is.
                </p>
              )}
            </div>
            <button
              onClick={handleCancelSchedule}
              disabled={schedulePending}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                scheduledInFuture
                  ? "border-blue-300 text-blue-700 hover:bg-blue-100"
                  : "border-amber-300 text-amber-700 hover:bg-amber-100"
              }`}
            >
              {schedulePending ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
              Annuleer planning
            </button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Starttijd onderhoud
            </label>
            <input
              type="datetime-local"
              value={localScheduled}
              onChange={(e) => { setLocalScheduled(e.target.value); setScheduleError(null); }}
              className={inputCls}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSchedule}
              disabled={schedulePending}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              {schedulePending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
              {hasSchedule ? "Planning wijzigen" : "Inplannen"}
            </button>
            {hasSchedule && (
              <button
                onClick={handleCancelSchedule}
                disabled={schedulePending}
                className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Annuleer planning
              </button>
            )}
            {scheduleSaved && !schedulePending && (
              <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                Ingepland
              </span>
            )}
            {scheduleError && !schedulePending && (
              <span className="text-red-600 text-sm font-medium">{scheduleError}</span>
            )}
          </div>
        </div>
      </section>

      {/* ── Maintenance message ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-0.5">Onderhoudsbericht</h2>
        <p className="text-xs text-slate-400 mb-5">
          Dit bericht zien bezoekers wanneer de site in onderhoudsmodus staat.
        </p>

        <div className="space-y-4">
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

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSaveMsg}
              disabled={msgPending}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              {msgPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Opslaan
            </button>
            {msgSaved && !msgPending && (
              <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                Opgeslagen
              </span>
            )}
            {msgError && !msgPending && (
              <span className="text-red-600 text-sm font-medium">{msgError}</span>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
