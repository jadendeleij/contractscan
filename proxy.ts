import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/scan", "/account", "/admin"];
const AUTH_PATHS = ["/login", "/register"];
// These paths always pass through even during maintenance
const BYPASS_PATHS = ["/onderhoud", "/api/bypass", "/api/", "/_next/", "/favicon.ico", "/login", "/register"];

/* ── Module-level caches ── */
let _modeCache: { maintenance: boolean; ts: number } | null = null;
const _adminCache = new Map<string, { isAdmin: boolean; ts: number }>();

async function checkIsAdmin(userId: string): Promise<boolean> {
  const cached = _adminCache.get(userId);
  if (cached && Date.now() - cached.ts < 300_000) return cached.isAdmin; // 5 min TTL
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=is_admin`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
        signal: AbortSignal.timeout(1000),
      }
    );
    if (!res.ok) return cached?.isAdmin ?? false;
    const [row] = await res.json();
    const isAdmin = row?.is_admin === true;
    _adminCache.set(userId, { isAdmin, ts: Date.now() });
    return isAdmin;
  } catch {
    return cached?.isAdmin ?? false; // use stale cache on error, deny if no cache
  }
}

// Returns Amsterdam's UTC offset in ms for a given UTC Date (handles DST).
function amsOffsetMs(utcDate: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Amsterdam",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const p = Object.fromEntries(fmt.formatToParts(utcDate).map(({ type, value }) => [type, Number(value)]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - utcDate.getTime();
}

// Parses a stored date string — handles both UTC ISO ("...Z") and legacy
// Amsterdam-local format ("2026-05-09T10:00" without timezone suffix).
function parseStoredDate(stored: string): Date | null {
  if (!stored) return null;
  if (stored.includes("Z") || /[+-]\d{2}:?\d{2}$/.test(stored)) {
    const d = new Date(stored);
    return isNaN(d.getTime()) ? null : d;
  }
  // Old format: no tz suffix → was entered as Amsterdam local time.
  // Parse as UTC first (approximation), then subtract the Amsterdam offset.
  const approx = new Date(stored + "Z");
  if (isNaN(approx.getTime())) return null;
  return new Date(approx.getTime() - amsOffsetMs(approx));
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
    const scheduledAt = rows.find((r) => r.key === "maintenance_scheduled_at")?.value ?? "";
    const scheduled = parseStoredDate(scheduledAt);
    const scheduledActive = !!scheduled && scheduled <= new Date();

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
    const isAdminUser = user ? await checkIsAdmin(user.id) : false;
    const canPass = isAdminUser || !!bypassCookie;

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
