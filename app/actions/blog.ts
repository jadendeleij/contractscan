"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function createPost(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();

  const tagsRaw = formData.get("tags") as string;
  const metaDesc = (formData.get("meta_description") as string).trim() || null;

  const { error } = await db.from("blog_posts").insert({
    title:            formData.get("title")    as string,
    slug:             formData.get("slug")     as string,
    excerpt:          formData.get("excerpt")  as string,
    content:          formData.get("content")  as string,
    category:         formData.get("category") as string,
    author:           (formData.get("author")  as string) || "Redactie",
    tags:             tagsRaw ? JSON.parse(tagsRaw) : [],
    meta_description: metaDesc,
    published:        formData.get("published") === "on",
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

  const tagsRaw = formData.get("tags") as string;
  const metaDesc = (formData.get("meta_description") as string).trim() || null;

  const { error } = await db.from("blog_posts").update({
    title:            formData.get("title")    as string,
    slug:             formData.get("slug")     as string,
    excerpt:          formData.get("excerpt")  as string,
    content:          formData.get("content")  as string,
    category:         formData.get("category") as string,
    author:           (formData.get("author")  as string) || "Redactie",
    tags:             tagsRaw ? JSON.parse(tagsRaw) : [],
    meta_description: metaDesc,
    published:        formData.get("published") === "on",
    updated_at:       new Date().toISOString(),
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

export async function uploadBlogImage(formData: FormData): Promise<string> {
  await requireAdmin();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("Geen bestand geselecteerd.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Bestand is groter dan 5MB.");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const bytes = await file.arrayBuffer();

  const db = createAdminClient();
  const { error } = await db.storage
    .from("blog-images")
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = db.storage.from("blog-images").getPublicUrl(path);
  return data.publicUrl;
}
