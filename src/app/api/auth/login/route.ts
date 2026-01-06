import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "users.json");
const SPRING_VERIFY_URL =
  process.env.SPRING_VERIFY_URL || "http://localhost:8080/auth/login";

// Define a proper User type
interface User {
  id?: number;
  userName: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any; // fallback for extra fields from API
}

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

      // Use proper User type
      const user: User | null = await res.json().catch(() => null);

      // persist locally (optional)
      try {
        let users: User[] = [];
        try {
          const text = await fs.readFile(dataFile, "utf8");
          users = JSON.parse(text || "[]") as User[];
        } catch {
          await fs.mkdir(path.dirname(dataFile), { recursive: true });
          await fs.writeFile(dataFile, "[]");
          users = [];
        }

        if (user) {
          users = users.filter(u => u.userName !== user.userName).concat(user);
        }

        await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
      } catch (e) {
        console.error("Failed to persist locally", e);
      }

      const nextRes = NextResponse.json(user, { status: 200 });

      if (user?.userName) {
        nextRes.cookies.set("currentUser", String(user.userName), {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
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