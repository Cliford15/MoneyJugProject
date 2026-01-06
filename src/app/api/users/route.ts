import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "users.json");
const SPRING_API_URL =
  process.env.SPRING_API_URL || "http://localhost:8080/api/users";

// Type for the request body
interface UserRequest {
  userName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
}

// Type for user data
interface User extends UserRequest {
  id: number;
  upstreamWarning?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<UserRequest> = await req.json();

    const { userName, firstName, middleName, lastName, email, password } = body;

    if (!userName || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = Date.now();
    const newUser: User = {
      id,
      userName,
      firstName,
      middleName,
      lastName,
      email,
      password,
    };

    let createdUser: User = newUser;
    let upstreamError: unknown = null;

    // Try sending to Spring API
    try {
      const springRes = await fetch(SPRING_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!springRes.ok) {
        const errText = await springRes.text();
        console.error("Spring API error:", springRes.status, errText);
        upstreamError = { status: springRes.status, details: errText };
      } else {
        createdUser = (await springRes.json().catch(() => newUser)) as User;
      }
    } catch (err) {
      console.error("Error contacting Spring API:", err);
      upstreamError = err;
    }

    // Persist locally as fallback
    let users: User[] = [];
    try {
      const text = await fs.readFile(dataFile, "utf8");
      users = JSON.parse(text || "[]") as User[];
    } catch {
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      await fs.writeFile(dataFile, "[]");
      users = [];
    }

    users.push(createdUser);
    await fs.writeFile(dataFile, JSON.stringify(users, null, 2));

    const responseBody: User = upstreamError
      ? { ...createdUser, upstreamWarning: "Upstream unavailable; saved locally" }
      : createdUser;

    return NextResponse.json(responseBody, { status: 201 });
  } catch (err) {
    console.error("POST /users error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}