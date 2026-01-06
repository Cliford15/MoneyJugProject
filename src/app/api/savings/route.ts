import { NextRequest, NextResponse } from "next/server";

const SPRING_SAVINGS_URL =
  process.env.SPRING_SAVINGS_URL || "http://localhost:8080/api/savings";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(SPRING_SAVINGS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    try {
      return NextResponse.json(JSON.parse(text), {
        status: res.status,
      });
    } catch {
      return NextResponse.json(
        { result: text },
        { status: res.status }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const walletId = url.searchParams.get("walletId");

    const target = walletId
      ? `${SPRING_SAVINGS_URL}/wallet/${encodeURIComponent(walletId)}`
      : SPRING_SAVINGS_URL;

    const res = await fetch(target);
    const text = await res.text();

    try {
      return NextResponse.json(JSON.parse(text), {
        status: res.status,
      });
    } catch {
      return NextResponse.json(
        { result: text },
        { status: res.status }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}