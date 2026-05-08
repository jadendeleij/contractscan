"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Unauthorized");

  const db = createAdminClient();
  const { data: profile } = await db
    .from("profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Unauthorized");
  return data.user;
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  const db = createAdminClient();
  // Delete profile data first, then auth user
  await db.from("profiles").delete().eq("id", userId);
  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gebruikers");
  revalidatePath("/admin/privacy");
}

export async function deleteWaitlistEntry(email: string) {
  await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("waitlist").delete().eq("email", email);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/wachtlijst");
  revalidatePath("/admin/privacy");
}

export async function exportUserData(userId: string): Promise<object> {
  await requireAdmin();
  const db = createAdminClient();

  const { data: authUser } = await db.auth.admin.getUserById(userId);
  const { data: profile } = await db.from("profiles").select("*").eq("id", userId).single();

  return {
    auth: {
      id: authUser.user?.id,
      email: authUser.user?.email,
      created_at: authUser.user?.created_at,
      last_sign_in_at: authUser.user?.last_sign_in_at,
      provider: authUser.user?.app_metadata?.provider,
    },
    profile,
    exported_at: new Date().toISOString(),
  };
}
