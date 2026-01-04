import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  try {
    res.cookies.set("currentUser", "", { path: "/", maxAge: 0 });
  } catch (e) {
    // ignore
  }
  return res;
}
