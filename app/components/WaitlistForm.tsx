"use client";

import { useState, useTransition } from "react";
import { joinWaitlist } from "@/app/actions/waitlist";
import { ArrowRight, Loader2, CheckCircle, Mail } from "lucide-react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<
    { success: true } | { success: false; error: string } | null
  >(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await joinWaitlist(email);
      setResult(res);
      if (res.success) setEmail("");
    });
  }

  if (result?.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div className="text-left">
            <p className="font-bold text-green-800 text-sm">Je staat op de wachtlijst!</p>
            <p className="text-green-700 text-xs mt-0.5">
              We laten je weten zodra ContractScan AI beschikbaar is.
            </p>
          </div>
        </div>
        <button
          onClick={() => setResult(null)}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
        >
          Nog een e-mailadres toevoegen
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (result) setResult(null);
            }}
            placeholder="jouw@email.nl"
            required
            disabled={isPending}
            className={`w-full pl-10 pr-4 py-3.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
              result && !result.success
                ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !email}
          className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-5 py-3.5 rounded-xl text-sm transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-blue-200"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Meld je aan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {result && !result.success && (
        <p className="text-red-600 text-xs font-medium animate-in fade-in duration-200">
          {result.error}
        </p>
      )}

      {/* Disclaimer */}
      {!result && (
        <p className="text-xs text-slate-400">
          Geen spam. Je kunt je altijd afmelden.
        </p>
      )}
    </div>
  );
}
