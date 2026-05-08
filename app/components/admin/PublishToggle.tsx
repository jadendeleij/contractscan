"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Eye, EyeOff, Check, Loader2, ChevronDown, Globe } from "lucide-react";
import { togglePublished } from "@/app/actions/blog";

export default function PublishToggle({ id, published }: { id: string; published: boolean }) {
  const [open, setOpen] = useState(false);
  const [confirmLive, setConfirmLive] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const [isPending, startTransition] = useTransition();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirmLive(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleToggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 6, left: r.left + r.width / 2 });
    }
    if (open) setConfirmLive(false);
    setOpen((v) => !v);
  }

  function select(newPublished: boolean) {
    if (newPublished && !published) {
      setConfirmLive(true);
      return;
    }
    setOpen(false);
    if (newPublished === published) return;
    startTransition(() => togglePublished(id, newPublished));
  }

  function confirmPublish() {
    setOpen(false);
    setConfirmLive(false);
    startTransition(() => togglePublished(id, true));
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
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
        <div
          style={{
            position: "fixed",
            top: dropPos.top,
            left: dropPos.left,
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
          className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
        >
          {confirmLive ? (
            <div className="p-4 w-56">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-3.5 h-3.5 text-green-600" />
                </div>
                <p className="text-xs font-bold text-slate-800">Post publiek maken?</p>
              </div>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                De post wordt direct zichtbaar voor alle bezoekers van de website.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmLive(false)}
                  className="flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Annuleer
                </button>
                <button
                  onClick={confirmPublish}
                  className="flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Publiceer
                </button>
              </div>
            </div>
          ) : (
            <div className="min-w-[140px]">
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
      )}
    </>
  );
}
