"use client";

import { useTransition, useState } from "react";
import { Wrench, Globe, Loader2, Save, CheckCircle, Calendar, X } from "lucide-react";
import {
  toggleMaintenanceMode,
  saveMaintenanceMessage,
  saveScheduledMaintenance,
} from "@/app/actions/site";

type Props = {
  maintenanceMode: boolean;
  message: string;
  endTime: string;
  scheduledAt: string;
};

export default function MaintenanceControls({ maintenanceMode, message, endTime, scheduledAt }: Props) {
  const [modePending, startModeTransition] = useTransition();
  const [msgPending, startMsgTransition] = useTransition();
  const [schedulePending, startScheduleTransition] = useTransition();

  const [localMsg, setLocalMsg] = useState(message);
  const [localEnd, setLocalEnd] = useState(endTime);
  const [localScheduled, setLocalScheduled] = useState(scheduledAt);
  const [msgSaved, setMsgSaved] = useState(false);
  const [scheduleSaved, setScheduleSaved] = useState(false);

  function setMode(on: boolean) {
    if (on === maintenanceMode || modePending) return;
    startModeTransition(() => toggleMaintenanceMode(on));
  }

  function saveMsg() {
    startMsgTransition(async () => {
      await saveMaintenanceMessage(localMsg, localEnd);
      setMsgSaved(true);
      setTimeout(() => setMsgSaved(false), 3000);
    });
  }

  function planSchedule() {
    if (!localScheduled) return;
    startScheduleTransition(async () => {
      await saveScheduledMaintenance(localScheduled);
      setScheduleSaved(true);
      setTimeout(() => setScheduleSaved(false), 3000);
    });
  }

  function clearSchedule() {
    startScheduleTransition(async () => {
      await saveScheduledMaintenance("");
      setLocalScheduled("");
      setScheduleSaved(true);
      setTimeout(() => setScheduleSaved(false), 3000);
    });
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

  const hasScheduled = !!scheduledAt;
  const scheduledDate = hasScheduled ? new Date(scheduledAt) : null;
  const scheduledValid = scheduledDate && !isNaN(scheduledDate.getTime());
  const scheduledInFuture = scheduledValid && scheduledDate > new Date();

  return (
    <div className="space-y-6">
      {/* ── Mode selector ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-0.5">Site modus</h2>
        <p className="text-xs text-slate-400 mb-5">
          In onderhoudsmodus zien niet-ingelogde bezoekers de onderhoudspagina.
          Ingelogde gebruikers (en jijzelf) kunnen de site gewoon bereiken.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Online */}
          <button
            onClick={() => setMode(false)}
            disabled={modePending}
            className={`p-4 rounded-xl border-2 text-left transition-all disabled:cursor-wait ${
              !maintenanceMode
                ? "border-green-500 bg-green-50/40"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center mb-3">
              {modePending && maintenanceMode
                ? <Loader2 className="w-3.5 h-3.5 text-green-600 animate-spin" />
                : <Globe className="w-3.5 h-3.5 text-green-600" />
              }
            </div>
            <p className="text-sm font-bold text-slate-800">Online</p>
            <p className="text-xs text-slate-400 mt-1">Site bereikbaar voor iedereen.</p>
          </button>

          {/* Onderhoud */}
          <button
            onClick={() => setMode(true)}
            disabled={modePending}
            className={`p-4 rounded-xl border-2 text-left transition-all disabled:cursor-wait ${
              maintenanceMode
                ? "border-red-400 bg-red-50/40"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center mb-3">
              {modePending && !maintenanceMode
                ? <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin" />
                : <Wrench className="w-3.5 h-3.5 text-red-500" />
              }
            </div>
            <p className="text-sm font-bold text-slate-800">Onderhoud</p>
            <p className="text-xs text-slate-400 mt-1">Niet-ingelogde bezoekers zien de onderhoudspagina.</p>
          </button>
        </div>
      </section>

      {/* ── Scheduled maintenance ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-0.5">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-800">Onderhoud inplannen</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Bezoekers zien een melding op de site. Op het geplande tijdstip gaat de site automatisch in onderhoudsmodus.
          Zet de modus daarna handmatig terug op Online als het onderhoud klaar is.
        </p>

        {hasScheduled && scheduledValid ? (
          <div className={`flex items-start justify-between gap-4 p-4 rounded-xl border ${
            scheduledInFuture
              ? "bg-blue-50 border-blue-200"
              : "bg-amber-50 border-amber-200"
          }`}>
            <div>
              <p className={`text-sm font-semibold ${scheduledInFuture ? "text-blue-800" : "text-amber-800"}`}>
                {scheduledInFuture ? "Gepland voor:" : "Gestart (zet modus handmatig op Online als klaar):"}
              </p>
              <p className={`text-sm mt-0.5 ${scheduledInFuture ? "text-blue-700" : "text-amber-700"}`}>
                {scheduledDate.toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" })}
                {" "}om{" "}
                {scheduledDate.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <button
              onClick={clearSchedule}
              disabled={schedulePending}
              className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors disabled:opacity-50"
              title="Annuleer gepland onderhoud"
            >
              {schedulePending ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="datetime-local"
              value={localScheduled}
              onChange={(e) => setLocalScheduled(e.target.value)}
              className={inputCls}
            />
            <button
              onClick={planSchedule}
              disabled={schedulePending || !localScheduled}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              {schedulePending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
              Inplannen
            </button>
          </div>
        )}

        {scheduleSaved && !schedulePending && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold">
            <CheckCircle className="w-4 h-4" />
            Opgeslagen
          </p>
        )}
      </section>

      {/* ── Message for visitors ── */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-0.5">Bericht voor bezoekers</h2>
        <p className="text-xs text-slate-400 mb-5">
          Dit bericht wordt getoond op de onderhoudspagina.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bericht</label>
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
              Verwachte eindtijd{" "}
              <span className="text-slate-400 font-normal">(optioneel)</span>
            </label>
            <input
              type="datetime-local"
              value={localEnd}
              onChange={(e) => setLocalEnd(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={saveMsg}
              disabled={msgPending}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              {msgPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Bericht opslaan
            </button>
            {msgSaved && !msgPending && (
              <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                Opgeslagen
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
