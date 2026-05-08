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

async function upsertSettings(rows: { key: string; value: string }[]) {
  const db = createAdminClient();
  const { error } = await db.from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
}

function revalidateAll() {
  revalidatePath("/admin/beheer");
  revalidatePath("/admin");
  revalidatePath("/onderhoud");
  revalidatePath("/");
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const db = createAdminClient();
  const { data } = await db.from("site_settings").select("key, value");
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
}

export async function setSiteSetting(key: string, value: string) {
  await requireAdmin();
  await upsertSettings([{ key, value }]);
  revalidateAll();
}

export async function toggleMaintenanceMode(enabled: boolean) {
  await requireAdmin();
  const rows = [
    { key: "maintenance_mode", value: String(enabled) },
    ...(enabled ? [{ key: "dev_mode", value: "false" }] : []),
  ];
  await upsertSettings(rows);
  revalidateAll();
}

export async function toggleDevMode(enabled: boolean) {
  await requireAdmin();
  const rows = [
    { key: "dev_mode", value: String(enabled) },
    ...(enabled ? [{ key: "maintenance_mode", value: "false" }] : []),
  ];
  await upsertSettings(rows);
  revalidateAll();
}

export async function savePlannedMaintenance(scheduledAt: string, message: string, endTime: string) {
  await requireAdmin();
  await upsertSettings([
    { key: "maintenance_scheduled_at", value: scheduledAt },
    { key: "maintenance_message",      value: message },
    { key: "maintenance_end",          value: endTime },
  ]);
  revalidateAll();
}

export async function saveScheduledMaintenance(scheduledAt: string) {
  await requireAdmin();
  await upsertSettings([{ key: "maintenance_scheduled_at", value: scheduledAt }]);
  revalidateAll();
}

export async function saveMaintenanceMessage(message: string, endTime: string) {
  await requireAdmin();
  await upsertSettings([
    { key: "maintenance_message", value: message },
    { key: "maintenance_end",     value: endTime },
  ]);
  revalidateAll();
}
