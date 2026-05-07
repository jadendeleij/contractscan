import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Gebruik in Server Components, Server Actions en Route Handlers
// cookies() is async in Next.js 15+
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll kan falen in Server Components (read-only context) —
            // de middleware zorgt in dat geval voor cookie-refresh.
          }
        },
      },
    }
  );
}
