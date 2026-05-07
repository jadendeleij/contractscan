"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 8) return "weak";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 12) return "strong";
    return "medium";
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }
    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message === "User already registered"
        ? "Dit e-mailadres is al in gebruik."
        : error.message
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Bevestig je e-mail</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          We hebben een bevestigingslink gestuurd naar{" "}
          <strong className="text-slate-700">{email}</strong>. Klik op de link om je account te activeren.
        </p>
        <a
          href="/login"
          className="inline-block mt-6 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Terug naar inloggen
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Maak een account aan</h1>
      <p className="text-slate-500 text-sm mb-7">
        Al een account?{" "}
        <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
          Inloggen
        </a>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* E-mail */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            E-mailadres
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jij@bedrijf.nl"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {/* Wachtwoord */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Wachtwoord
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimaal 8 tekens"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Sterkte-indicator */}
          {passwordStrength && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-1 flex-1">
                {(["weak", "medium", "strong"] as const).map((level, i) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      ["weak", "medium", "strong"].indexOf(passwordStrength) >= i
                        ? passwordStrength === "weak" ? "bg-red-400"
                          : passwordStrength === "medium" ? "bg-amber-400"
                          : "bg-green-500"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-medium ${
                passwordStrength === "weak" ? "text-red-500"
                : passwordStrength === "medium" ? "text-amber-600"
                : "text-green-600"
              }`}>
                {passwordStrength === "weak" ? "Zwak" : passwordStrength === "medium" ? "Redelijk" : "Sterk"}
              </span>
            </div>
          )}
        </div>

        {/* Bevestig wachtwoord */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
            Bevestig wachtwoord
          </label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Herhaal je wachtwoord"
            className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              confirmPassword && confirmPassword !== password
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Akkoord */}
        <p className="text-xs text-slate-400 leading-relaxed">
          Door te registreren ga je akkoord met onze{" "}
          <a href="#" className="underline hover:text-slate-600 transition-colors">Gebruiksvoorwaarden</a>{" "}
          en{" "}
          <a href="#" className="underline hover:text-slate-600 transition-colors">Privacybeleid</a>.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all active:scale-95"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Account aanmaken
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
