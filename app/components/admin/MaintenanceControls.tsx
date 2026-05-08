"use client";

import { useTransition, useState } from "react";
import { Wrench, Code2, Loader2, Save, CheckCircle, Globe } from "lucide-react";
import { toggleMaintenanceMode, toggleDevMode, saveMaintenanceMessage } from "@/app/actions/site";

type Props = {
  maintenanceMode: boolean;
  devMode: boolean;
  message: string;
  endTime: string;
};

const MODES = [
  {
    id: "off" as const,
    label: "Online",
    desc: "Site is normaal bereikbaar voor alle bezoekers.",
    Icon: Globe,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    activeBorder: "border-green-500 bg-green-50/40",
  },
  {
    id: "maintenance" as const,
    label: "Onderhoud",
    desc: "Niet-ingelogde bezoekers zien de onderhoudspagina. Gebruik dit bij gepland onderhoud of storingen.",
    Icon: Wrench,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
    activeBorder: "border-red-400 bg-red-50/40",
  },
  {
    id: "dev" as const,
    label: "Ontwikkeling",
    desc: "Zelfde als onderhoud, maar met een andere boodschap. Gebruik dit terwijl je actief aan de site werkt.",
    Icon: Code2,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    activeBorder: "border-amber-400 bg-amber-50/40",
  },
] as const;

export default function MaintenanceControls({ maintenanceMode, devMode, message, endTime }: Props) {
  const [isPending, startTransition] = useTransition();
  const [msgPending, startMsgTransition] = useTransition();
  const [localMsg, setLocalMsg] = useState(message);
  const [localEnd, setLocalEnd] = useState(endTime);
  const [saved, setSaved] = useState(false);

  const currentMode = maintenanceMode ? "maintenance" : devMode ? "dev" : "off";

  function setMode(mode: "off" | "maintenance" | "dev") {
    if (mode === currentMode || isPending) return;
    startTransition(async () => {
      if (mode === "maintenance") await toggleMaintenanceMode(true);
      else if (mode === "dev") await toggleDevMode(true);
      else if (currentMode === "maintenance") await toggleMaintenanceMode(false);
      else await toggleDevMode(false);
    });
  }

  function saveMsg() {
    startMsgTransition(async () => {
      await saveMaintenanceMessage(localMsg, localEnd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  const inputCls =
    "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-0.5">Site modus</h2>
        <p className="text-xs text-slate-400 mb-5">Alleen één modus kan tegelijk actief zijn.</p>

        <div className="grid grid-cols-3 gap-3">
          {MODES.map(({ id, label, desc, Icon, iconColor, iconBg, activeBorder }) => {
            const active = currentMode === id;
            const loading = isPending && active;
            return (
              <button
                key={id}
                onClick={() => setMode(id)}
                disabled={isPending}
                className={`p-4 rounded-xl border-2 text-left transition-all disabled:cursor-wait ${
                  active ? activeBorder : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center mb-3`}>
                  {loading
                    ? <Loader2 className={`w-3.5 h-3.5 ${iconColor} animate-spin`} />
                    : <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  }
                </div>
                <p className="text-sm font-bold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Message & end time */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-800 mb-0.5">Bericht voor bezoekers</h2>
        <p className="text-xs text-slate-400 mb-5">
          Wordt getoond aan bezoekers die de onderhoudspagina zien, ongeacht welke modus actief is.
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
              {msgPending
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Save className="w-3.5 h-3.5" />
              }
              Bericht opslaan
            </button>
            {saved && !msgPending && (
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
