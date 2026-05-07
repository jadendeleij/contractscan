import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut, FileText } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware vangt dit al op, maar dit is een server-side veiligheidsnet
  if (!user) redirect("/login");

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">ContractScan <span className="text-blue-600">AI</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{user.email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Uitloggen
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Welkom, {user.email?.split("@")[0]} 👋
        </h1>
        <p className="text-slate-500">Je bent ingelogd. Hier komt je dashboard.</p>
      </main>
    </div>
  );
}
