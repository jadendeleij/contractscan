import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  const expected = process.env.BYPASS_SECRET;

  if (!expected || secret !== expected) {
    return new NextResponse("Toegang geweigerd", { status: 403 });
  }

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("_bypass", "1", {
    maxAge: 60 * 60 * 24, // 24 uur
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res;
}
