import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "users.json");
const SPRING_VERIFY_URL = process.env.SPRING_VERIFY_URL || "http://localhost:8080/auth/login";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

    try {
      const res = await fetch(SPRING_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 401) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      if (!res.ok) {
        const t = await res.text();
        console.error("Upstream verify error", res.status, t);
        return NextResponse.json({ error: "Upstream error", details: t }, { status: 502 });
      }

      const user = await res.json().catch(() => null);

      // persist locally (optional)
      try {
        let users: any[] = [];
        try {
          const text = await fs.readFile(dataFile, "utf8");
          users = JSON.parse(text || "[]");
        } catch (e) {
          await fs.mkdir(path.dirname(dataFile), { recursive: true });
          await fs.writeFile(dataFile, "[]");
          users = [];
        }
        if (user) users = users.filter(u => u.userName !== user.userName).concat(user);
        await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
      } catch (e) {
        console.error("Failed to persist locally", e);
      }

      const nextRes = NextResponse.json(user, { status: 200 });
      try {
        if (user && user.userName) {
          nextRes.cookies.set("currentUser", String(user.userName), {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        }
      } catch (e) {
        // ignore cookie set errors in some environments
      }
      return nextRes;
    } catch (err) {
      console.error("Error contacting Spring verify endpoint", err);
      return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}