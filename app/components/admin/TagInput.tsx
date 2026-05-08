"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";

export default function TagInput({ defaultTags = [] }: { defaultTags?: string[] }) {
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(raw: string) {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (tag && !tags.includes(tag) && tags.length < 8) {
      setTags((prev) => [...prev, tag]);
    }
    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "") {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  return (
    <div>
      <input type="hidden" name="tags" value={JSON.stringify(tags)} />
      <div
        className="flex flex-wrap gap-2 min-h-[44px] w-full rounded-xl border border-slate-200 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full"
          >
            #{tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setTags((prev) => prev.filter((t) => t !== tag)); }}
              className="hover:text-blue-900 leading-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input); }}
          placeholder={tags.length === 0 ? "Typ een tag en druk Enter of komma…" : ""}
          className="flex-1 min-w-[140px] text-sm text-slate-900 placeholder-slate-400 bg-transparent outline-none py-0.5"
        />
      </div>
      <p className="text-xs text-slate-400 mt-1.5">Druk Enter of komma om een tag te bevestigen · max. 8 tags · Backspace verwijdert de laatste</p>
    </div>
  );
}
