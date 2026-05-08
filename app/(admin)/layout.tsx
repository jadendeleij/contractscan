import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

async function getAdminUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
  if (!data.user || !admins.includes(data.user.email ?? "")) return null;
  return data.user;
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar userEmail={user.email!} />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <span className="text-white font-bold text-sm">ContractScan Admin</span>
          <a href="/" className="text-slate-400 text-xs hover:text-white transition-colors">← Site</a>
        </div>
        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
