"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteWaitlistEntry } from "@/app/actions/privacy";

export default function DeleteWaitlistButton({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`"${email}" van de wachtlijst verwijderen?`)) return;
    startTransition(() => deleteWaitlistEntry(email));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title="Verwijder van wachtlijst"
      className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
    </button>
  );
}
