"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  if (!data.user || !admins.includes(data.user.email ?? "")) {
    throw new Error("Unauthorized");
  }
  return data.user;
}

export async function createPost(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db.from("blog_posts").insert({
    title:     formData.get("title")     as string,
    slug:      formData.get("slug")      as string,
    excerpt:   formData.get("excerpt")   as string,
    content:   formData.get("content")   as string,
    category:  formData.get("category")  as string,
    published: formData.get("published") === "on",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const id = formData.get("id") as string;

  const { error } = await db.from("blog_posts").update({
    title:      formData.get("title")     as string,
    slug:       formData.get("slug")      as string,
    excerpt:    formData.get("excerpt")   as string,
    content:    formData.get("content")   as string,
    category:   formData.get("category")  as string,
    published:  formData.get("published") === "on",
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("blog_posts").delete().eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function togglePublished(id: string, published: boolean) {
  await requireAdmin();
  const db = createAdminClient();
  await db.from("blog_posts").update({ published, updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
