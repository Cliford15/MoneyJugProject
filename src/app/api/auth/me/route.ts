import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "users.json");

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map(p => p.trim());
  for (const p of parts) {
    if (p.startsWith(name + "=")) return decodeURIComponent(p.substring(name.length + 1));
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const current = getCookieValue(cookieHeader, "currentUser");
    if (!current) return NextResponse.json({ user: null }, { status: 200 });

    try {
      const text = await fs.readFile(dataFile, "utf8");
      const users = JSON.parse(text || "[]");
      const user = users.find((u: any) => String(u.userName) === String(current));
      if (!user) return NextResponse.json({ user: null }, { status: 200 });
      return NextResponse.json(user, { status: 200 });
    } catch (e) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (e) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
