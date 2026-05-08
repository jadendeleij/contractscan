import WaitlistForm from "@/app/components/WaitlistForm";
import { ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blijf op de hoogte | ContractScan AI",
  description: "Meld je aan en ontvang een bericht zodra ContractScan AI beschikbaar is.",
};

export default function MailingListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col items-center justify-center px-6 py-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <span className="text-lg font-bold text-slate-900">
          ContractScan <span className="text-blue-600">AI</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-lg p-10 text-center">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Bell className="w-7 h-7 text-blue-600" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
          Blijf op de hoogte
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          ContractScan AI is in ontwikkeling. Laat je e-mailadres achter en we sturen
          je een bericht zodra je kunt beginnen, als een van de eersten.
        </p>

        <WaitlistForm />
      </div>

      {/* Back */}
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar de homepage
      </Link>
    </div>
  );
}
