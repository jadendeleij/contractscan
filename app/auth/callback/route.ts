import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Valideer dat de redirect naar een interne route gaat (geen open redirect)
function safeRedirect(next: string | null, origin: string): string {
  if (!next) return `${origin}/dashboard`;
  try {
    const url = new URL(next, origin);
    // Alleen interne routes toestaan
    if (url.origin !== origin) return `${origin}/dashboard`;
    return url.toString();
  } catch {
    return `${origin}/dashboard`;
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(safeRedirect(next, origin));
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
