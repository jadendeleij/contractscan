import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/scan", "/account", "/admin"];
const AUTH_PATHS = ["/login", "/register"];
// These paths always pass through even during maintenance / dev mode
const BYPASS_PATHS = ["/onderhoud", "/api/bypass", "/api/", "/_next/", "/favicon.ico", "/login", "/register"];

/* ── Module-level cache (helps when Edge instance stays warm) ── */
let _modeCache: { maintenance: boolean; dev: boolean; ts: number } | null = null;

async function getSiteMode(): Promise<{ maintenance: boolean; dev: boolean }> {
  const now = Date.now();
  if (_modeCache && now - _modeCache.ts < 30_000) return _modeCache;

  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_settings?select=key,value`;
    const res = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) throw new Error("fetch failed");
    const rows: { key: string; value: string }[] = await res.json();
    const get = (k: string) => rows.find((r) => r.key === k)?.value === "true";
    _modeCache = { maintenance: get("maintenance_mode"), dev: get("dev_mode"), ts: now };
  } catch {
    // Fail open — never block the site due to a settings fetch error
    _modeCache = { maintenance: false, dev: false, ts: now };
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

  // ── Site mode checks (maintenance / dev) ────────────────────────
  const isAlwaysAllowed = BYPASS_PATHS.some((p) => pathname.startsWith(p));
  const isAdminPath = pathname.startsWith("/admin");

  if (!isAlwaysAllowed && !isAdminPath) {
    const mode = await getSiteMode();
    const bypassCookie = request.cookies.get("_bypass");
    // Logged-in users and bypass-cookie holders always pass through
    const canPass = !!user || !!bypassCookie;

    if (mode.maintenance && !canPass) {
      const url = request.nextUrl.clone();
      url.pathname = "/onderhoud";
      url.searchParams.set("mode", "maintenance");
      return NextResponse.redirect(url);
    }

    if (mode.dev && !canPass) {
      const url = request.nextUrl.clone();
      url.pathname = "/onderhoud";
      url.searchParams.set("mode", "dev");
      return NextResponse.redirect(url);
    }
  }

  // ── Auth checks ─────────────────────────────────────────────────
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
