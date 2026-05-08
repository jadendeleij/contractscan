import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Tijdelijke route om je user ID op te zoeken — mag later verwijderd worden
export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  return NextResponse.json({ id: data.user.id, email: data.user.email });
}
