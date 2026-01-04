import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "users.json");
const SPRING_API_URL = process.env.SPRING_API_URL || "http://localhost:8080/api/users";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userName, firstName, middleName, lastName, email, password } = body;
    if (!userName || !firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = Date.now();
    const newUser = { id, userName, firstName, middleName, lastName, email, password };
    // Try forwarding to Spring Boot backend so it can persist to its database.
    // If the upstream is unavailable, fall back to local persistence and
    // still return a successful creation response.
    let createdUser: any = newUser;
    let upstreamError: any = null;

    try {
      const springRes = await fetch(SPRING_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, firstName, middleName, lastName, email, password }),
      });

      if (!springRes.ok) {
        const errText = await springRes.text();
        console.error("Spring API error:", springRes.status, errText);
        upstreamError = { status: springRes.status, details: errText };
      } else {
        createdUser = await springRes.json().catch(() => createdUser);
      }
    } catch (err) {
      console.error("Error contacting Spring API:", err);
      upstreamError = err;
    }

    // Persist locally as a fallback/copy
    let users: any[] = [];
    try {
      const text = await fs.readFile(dataFile, "utf8");
      users = JSON.parse(text || "[]");
    } catch (err) {
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      await fs.writeFile(dataFile, "[]");
      users = [];
    }

    users.push(createdUser);
    await fs.writeFile(dataFile, JSON.stringify(users, null, 2));

    const status = 201;
    const responseBody = upstreamError ? { ...createdUser, upstreamWarning: "Upstream unavailable; saved locally" } : createdUser;
    return NextResponse.json(responseBody, { status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
