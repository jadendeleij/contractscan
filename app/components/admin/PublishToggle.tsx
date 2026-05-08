"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Eye, EyeOff, Check, Loader2, ChevronDown } from "lucide-react";
import { togglePublished } from "@/app/actions/blog";

export default function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function select(newPublished: boolean) {
    setOpen(false);
    if (newPublished === published) return;
    startTransition(() => togglePublished(id, newPublished));
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-60 ${
          published
            ? "bg-green-50 text-green-700 hover:bg-green-100"
            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
        }`}
      >
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : published ? (
          <Eye className="w-3 h-3" />
        ) : (
          <EyeOff className="w-3 h-3" />
        )}
        {published ? "Live" : "Concept"}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 top-full mt-1.5 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden min-w-[140px]">
          <button
            onClick={() => select(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-green-700 hover:bg-green-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Live</span>
            {published && <Check className="w-3 h-3" />}
          </button>
          <div className="border-t border-slate-100" />
          <button
            onClick={() => select(false)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Concept</span>
            {!published && <Check className="w-3 h-3" />}
          </button>
        </div>
      )}
    </div>
  );
}
