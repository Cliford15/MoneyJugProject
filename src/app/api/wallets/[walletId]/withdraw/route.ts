import { NextRequest, NextResponse } from "next/server";

const SPRING_WALLET_URL =
  process.env.SPRING_WALLET_URL || "http://localhost:8080/api/wallets";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    const { walletId } = await params;

    const body = await req.json().catch(() => ({} as any));
    const amount =
      body.amount ??
      new URL(req.url).searchParams.get("amount");

    if (!amount) {
      return NextResponse.json(
        { error: "Missing amount" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${SPRING_WALLET_URL}/${walletId}/withdraw?amount=${encodeURIComponent(
        amount
      )}`,
      { method: "POST" }
    );

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