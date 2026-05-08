import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/scan", "/account", "/admin"];
const AUTH_PATHS = ["/login", "/register"];
// These paths always pass through even during maintenance
const BYPASS_PATHS = ["/onderhoud", "/api/bypass", "/api/", "/_next/", "/favicon.ico", "/login", "/register"];

/* ── Module-level cache (helps when Edge instance stays warm) ── */
let _modeCache: { maintenance: boolean; ts: number } | null = null;

function supabaseHeaders() {
  return {
    apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

async function getSiteMode(): Promise<{ maintenance: boolean }> {
  const now = Date.now();
  if (_modeCache && now - _modeCache.ts < 30_000) return _modeCache;

  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const authHeaders = {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    };

    const res = await fetch(`${base}/rest/v1/site_settings?select=key,value`, {
      headers: authHeaders,
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) throw new Error("fetch failed");
    const rows: { key: string; value: string }[] = await res.json();

    const maintenanceOn = rows.find((r) => r.key === "maintenance_mode")?.value === "true";
    const scheduledAt = rows.find((r) => r.key === "maintenance_scheduled_at")?.value;
    const scheduledActive = scheduledAt
      ? (() => { const d = new Date(scheduledAt); return !isNaN(d.getTime()) && d <= new Date(); })()
      : false;

    // Scheduled time just passed: synchronously persist so the page that renders
    // right after this call already sees maintenance_mode=true in the DB.
    if (scheduledActive && !maintenanceOn) {
      try {
        await fetch(`${base}/rest/v1/site_settings?key=eq.maintenance_mode`, {
          method: "PATCH",
          headers: { ...authHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ value: "true" }),
          signal: AbortSignal.timeout(2000),
        });
      } catch {}
    }

    _modeCache = { maintenance: maintenanceOn || scheduledActive, ts: now };
  } catch {
    // Fail open — never block the site due to a settings fetch error
    _modeCache = { maintenance: false, ts: now };
  }
  return _modeCache;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Always refresh the session — do not remove this call
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Maintenance check ────────────────────────────────────────
  const isAlwaysAllowed = BYPASS_PATHS.some((p) => pathname.startsWith(p));
  const isAdminPath = pathname.startsWith("/admin");

  if (!isAlwaysAllowed) {
    // Always call getSiteMode — even for admin paths — so that scheduled
    // activation is synchronously persisted to the DB before the page renders.
    const mode = await getSiteMode();
    const bypassCookie = request.cookies.get("_bypass");
    const canPass = !!user || !!bypassCookie;

    if (mode.maintenance && !canPass && !isAdminPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/onderhoud";
      return NextResponse.redirect(url);
    }
  }

  // ── Auth checks ─────────────────────────────────────────────
  if (!user && PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
