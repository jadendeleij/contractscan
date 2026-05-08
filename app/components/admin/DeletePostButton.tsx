"use client";

import { Trash2 } from "lucide-react";
import { deletePost } from "@/app/actions/blog";

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <form action={deletePost.bind(null, id)}>
      <button
        type="submit"
        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Verwijderen"
        onClick={(e) => {
          if (!confirm(`"${title}" definitief verwijderen?`)) e.preventDefault();
        }}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
