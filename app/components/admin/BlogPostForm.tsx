"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { createPost, updatePost } from "@/app/actions/blog";

const CATEGORIES = ["Beveiliging", "Privacy", "Juridisch", "Productnieuws"];

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
};

function toSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogPostForm({ post }: { post?: Post }) {
  const isEdit = !!post;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEdit);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(toSlug(value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (isEdit) {
          await updatePost(formData);
        } else {
          await createPost(formData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Er is iets misgegaan.");
      }
    });
  }

  const inputCls = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all";
  const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {isEdit && <input type="hidden" name="id" value={post.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className={labelCls}>Titel</label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Bijv. Wat is TLS 1.3 encryptie?"
            className={inputCls}
          />
        </div>

        {/* Slug */}
        <div>
          <label className={labelCls}>Slug (URL)</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">/blog/</span>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
              placeholder="wat-is-tls-encryptie"
              className={inputCls}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelCls}>Categorie</label>
          <select
            name="category"
            defaultValue={post?.category ?? "Beveiliging"}
            className={inputCls}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2">
          <label className={labelCls}>Samenvatting <span className="text-slate-400 font-normal">(kort, max. 200 tekens)</span></label>
          <textarea
            name="excerpt"
            rows={2}
            maxLength={200}
            defaultValue={post?.excerpt}
            placeholder="Korte beschrijving die op de blogpagina verschijnt..."
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <label className={labelCls}>
            Inhoud <span className="text-slate-400 font-normal">(gebruik lege regels tussen alinea&apos;s)</span>
          </label>
          <textarea
            name="content"
            rows={16}
            required
            defaultValue={post?.content}
            placeholder="Schrijf hier de volledige blogpost..."
            className={`${inputCls} resize-y font-mono text-xs leading-relaxed`}
          />
        </div>

        {/* Published */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published ?? false}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              {post?.published ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              Gepubliceerd (zichtbaar op de blog)
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-all active:scale-95"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Wijzigingen opslaan" : "Post aanmaken"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}
