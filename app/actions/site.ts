"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Unauthorized");
  const db = createAdminClient();
  const { data: profile } = await db.from("profiles").select("is_admin").eq("id", data.user.id).single();
  if (!profile?.is_admin) throw new Error("Unauthorized");
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const db = createAdminClient();
  const { data } = await db.from("site_settings").select("key, value");
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
}

export async function setSiteSetting(key: string, value: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  revalidatePath("/admin/beheer");
  revalidatePath("/admin");
}

export async function toggleMaintenanceMode(enabled: boolean) {
  await setSiteSetting("maintenance_mode", String(enabled));
}

export async function toggleDevMode(enabled: boolean) {
  await setSiteSetting("dev_mode", String(enabled));
}

export async function saveMaintenanceMessage(message: string, endTime: string) {
  await requireAdmin();
  await Promise.all([
    setSiteSetting("maintenance_message", message),
    setSiteSetting("maintenance_end", endTime),
  ]);
}
