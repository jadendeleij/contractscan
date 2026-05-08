"use server";

import { createAdminClient } from "@/lib/supabase/admin";

type WaitlistResult =
  | { success: true }
  | { success: false; error: string };

export async function joinWaitlist(email: string): Promise<WaitlistResult> {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { success: false, error: "Voer een geldig e-mailadres in." };
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("waitlist")
    .insert({ email: trimmed });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Dit e-mailadres staat al op de wachtlijst." };
    }
    return { success: false, error: "Er ging iets mis. Probeer het opnieuw." };
  }

  return { success: true };
}
