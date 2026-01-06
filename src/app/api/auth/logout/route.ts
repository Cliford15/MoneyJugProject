import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  try {
    res.cookies.set("currentUser", "", {
      path: "/",
      maxAge: 0,
    });
  } catch {
    // ignore cookie errors
  }

  return res;
}