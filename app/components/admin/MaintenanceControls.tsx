"use client";

import { useTransition, useState } from "react";
import { Wrench, Code2, Loader2, Save } from "lucide-react";
import { toggleMaintenanceMode, toggleDevMode, saveMaintenanceMessage } from "@/app/actions/site";

type Props = {
  maintenanceMode: boolean;
  devMode: boolean;
  message: string;
  endTime: string;
};

export default function MaintenanceControls({ maintenanceMode, devMode, message, endTime }: Props) {
  const [isPending, startTransition] = useTransition();
  const [msgPending, startMsgTransition] = useTransition();
  const [localMsg, setLocalMsg] = useState(message);
  const [localEnd, setLocalEnd] = useState(endTime);

  function toggle(action: () => Promise<void>) {
    startTransition(action);
  }

  function saveMsg() {
    startMsgTransition(() => saveMaintenanceMessage(localMsg, localEnd));
  }

  const inputCls = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

  return (
    <div className="space-y-6">
      {/* Maintenance mode */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wrench className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Onderhoudsmodus</h2>
              <p className="text-xs text-slate-400 mt-0.5">Alle bezoekers zien de onderhoudspagina</p>
            </div>
          </div>
          <button
            onClick={() => toggle(() => toggleMaintenanceMode(!maintenanceMode))}
            disabled={isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 mt-1 disabled:opacity-50 ${
              maintenanceMode ? "bg-red-500" : "bg-slate-200"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              maintenanceMode ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bericht voor bezoekers</label>
            <textarea
              rows={2}
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
          <button
            onClick={saveMsg}
            disabled={msgPending}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          >
            {msgPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Bericht opslaan
          </button>
        </div>
      </section>

      {/* Dev mode */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Code2 className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Ontwikkelmodus</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Bezoekers zonder bypass-cookie zien de onderhoudspagina.
                Developers met de bypass-URL zien de echte site.
              </p>
            </div>
          </div>
          <button
            onClick={() => toggle(() => toggleDevMode(!devMode))}
            disabled={isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 mt-1 disabled:opacity-50 ${
              devMode ? "bg-amber-500" : "bg-slate-200"
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              devMode ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>
      </section>
    </div>
  );
}
