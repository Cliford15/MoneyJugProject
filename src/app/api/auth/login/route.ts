import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { UserInfo } from "@/types/UserInfo";

const dataFile = path.join(process.cwd(), "data", "users.json");
const SPRING_VERIFY_URL =
  process.env.SPRING_VERIFY_URL || "http://localhost:8080/auth/login";

export async function POST(req: NextRequest) {
  try {
    const body: { username?: string; password?: string } = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    try {
      const res = await fetch(SPRING_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 401) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      if (!res.ok) {
        const t = await res.text();
        console.error("Upstream verify error", res.status, t);
        return NextResponse.json({ error: "Upstream error", details: t }, { status: 502 });
      }

      // Use UserInfo (partial) instead of any
      let user: Partial<UserInfo> | null = null;
      try {
        const data = await res.json();
        if (data && typeof data === "object" && "userName" in data) {
          user = data as Partial<UserInfo>; // Partial because not all fields may be returned
        }
      } catch {
        user = null;
      }

      // persist locally
      try {
        let users: Partial<UserInfo>[] = [];
        try {
          const text = await fs.readFile(dataFile, "utf8");
          users = JSON.parse(text || "[]") as Partial<UserInfo>[];
        } catch {
          await fs.mkdir(path.dirname(dataFile), { recursive: true });
          await fs.writeFile(dataFile, "[]");
          users = [];
        }

        if (user) {
          users = users.filter(u => u.userName !== user?.userName).concat(user);
        }

        await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
      } catch (e: unknown) {
        console.error("Failed to persist locally", e);
      }

      const nextRes = NextResponse.json(user, { status: 200 });

      if (user?.userName) {
        nextRes.cookies.set("currentUser", String(user.userName), {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return nextRes;
    } catch (err: unknown) {
      console.error("Error contacting Spring verify endpoint", err);
      return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
    }
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}