"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteUser } from "@/app/actions/privacy";

export default function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Gebruiker "${email}" permanent verwijderen? Dit kan niet ongedaan worden gemaakt.`)) return;
    startTransition(() => deleteUser(userId));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title="Verwijder gebruiker"
      className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
    </button>
  );
}
