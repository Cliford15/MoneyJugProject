import { NextResponse } from "next/server";

const SPRING_SAVINGS_URL = process.env.SPRING_SAVINGS_URL || "http://localhost:8080/api/savings";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const res = await fetch(`${SPRING_SAVINGS_URL}/${id}/break`, { method: "POST" });
    const text = await res.text();
    try { return NextResponse.json(JSON.parse(text), { status: res.status }); } catch { return NextResponse.json({ result: text }, { status: res.status }); }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
