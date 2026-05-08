"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Users, Home, LogOut, ScanText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin",           label: "Overzicht",   icon: LayoutDashboard, exact: true },
  { href: "/admin/blog",      label: "Blog Beheer", icon: FileText,        exact: false },
  { href: "/admin/wachtlijst",label: "Wachtlijst",  icon: Users,           exact: false },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside className="hidden md:flex w-56 min-h-screen bg-slate-900 flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ScanText className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-white text-sm font-bold">ContractScan</div>
            <div className="text-blue-400 text-xs font-semibold">Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Menu</p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-800 flex flex-col gap-0.5">
        <p className="px-3 mb-1 text-[10px] text-slate-600 truncate">{userEmail}</p>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <Home className="w-4 h-4" />
          Naar site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-all w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
