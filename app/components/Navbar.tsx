"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Loader2, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const navLinks = [
    { href: "/#hoe-het-werkt", label: "Hoe het werkt" },
    { href: "/#voordelen", label: "Voordelen" },
    { href: "/#prijzen", label: "Prijzen" },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            ContractScan <span className="text-blue-600">AI</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className="hover:text-slate-900 transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop auth area */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          ) : user ? (
            <>
              <span className="text-sm text-slate-500 max-w-[160px] truncate">{user.email}</span>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Uitloggen
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Inloggen
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Gratis starten
              </Link>
            </>
          )}
        </div>

        {/* Mobile: hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 border-t border-slate-100" : "max-h-0"
        } bg-white`}
      >
        <nav className="flex flex-col px-6 py-4 gap-1">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 py-2.5 border-b border-slate-50 transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-3 flex flex-col gap-2">
            {loading ? (
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin mx-auto" />
            ) : user ? (
              <>
                <span className="text-xs text-slate-400 truncate">{user.email}</span>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 py-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); handleSignOut(); }}
                  className="flex items-center gap-2 text-sm text-slate-500 py-2"
                >
                  <LogOut className="w-4 h-4" />
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center text-sm font-semibold text-slate-700 border border-slate-200 py-2.5 rounded-xl transition-colors hover:bg-slate-50"
                >
                  Inloggen
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                >
                  Gratis starten
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
