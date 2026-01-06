import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { UserInfo } from "@/types/UserInfo"; // import your type

const dataFile = path.join(process.cwd(), "data", "users.json");

// Utility to read a cookie
function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;

  const parts = cookieHeader.split(";").map(p => p.trim());
  for (const p of parts) {
    if (p.startsWith(name + "=")) {
      return decodeURIComponent(p.substring(name.length + 1));
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const current = getCookieValue(cookieHeader, "currentUser");

    if (!current) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const text = await fs.readFile(dataFile, "utf8");
      const users: UserInfo[] = JSON.parse(text || "[]");

      const user = users.find(u => String(u.userName) === current) ?? null;

      return NextResponse.json({ user }, { status: 200 });
    } catch (err) {
      console.error("Error reading local users:", err);
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (err) {
    console.error("Unexpected error in GET /api/auth:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}