"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Users, Home, LogOut,
  ScanText, BarChart2, Settings, Bell, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const sections = [
  {
    label: "Overzicht",
    items: [
      { href: "/admin",           label: "Dashboard",   icon: LayoutDashboard, exact: true },
      { href: "/admin/analytics", label: "Analytics",   icon: BarChart2,       exact: false },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog",      label: "Blog Beheer", icon: FileText,        exact: false },
    ],
  },
  {
    label: "Gebruikers",
    items: [
      { href: "/admin/gebruikers",  label: "Gebruikers", icon: Users, exact: false },
      { href: "/admin/wachtlijst",  label: "Wachtlijst", icon: Bell,  exact: false },
    ],
  },
  {
    label: "Systeem",
    items: [
      { href: "/admin/instellingen", label: "Instellingen", icon: Settings, exact: false },
    ],
  },
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
    <aside className="hidden md:flex w-56 min-h-screen bg-slate-900 flex-col flex-shrink-0 border-r border-slate-800">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ScanText className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-white text-sm font-bold truncate">ContractScan</div>
            <div className="text-blue-400 text-[11px] font-semibold">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-4 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
              {section.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {section.items.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                    {active && <ChevronRight className="w-3 h-3 opacity-60" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-slate-800">
        <div className="px-3 py-2 mb-1">
          <p className="text-[10px] text-slate-600 font-medium truncate">{userEmail}</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <Home className="w-4 h-4" />
          Naar site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
