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

function revalidateAll() {
  revalidatePath("/admin/beheer");
  revalidatePath("/admin");
  revalidatePath("/onderhoud");
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
  revalidateAll();
}

export async function toggleMaintenanceMode(enabled: boolean) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("site_settings").upsert(
    { key: "maintenance_mode", value: String(enabled), updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
  revalidateAll();
}

export async function toggleDevMode(enabled: boolean) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("site_settings").upsert(
    { key: "dev_mode", value: String(enabled), updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
  revalidateAll();
}

export async function saveMaintenanceMessage(message: string, endTime: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("site_settings").upsert(
    [
      { key: "maintenance_message", value: message, updated_at: new Date().toISOString() },
      { key: "maintenance_end", value: endTime, updated_at: new Date().toISOString() },
    ],
    { onConflict: "key" }
  );
  revalidateAll();
}
