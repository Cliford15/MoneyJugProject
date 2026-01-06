import { NextRequest, NextResponse } from "next/server";

const SPRING_WALLET_URL =
  process.env.SPRING_WALLET_URL || "http://localhost:8080/api/wallets";

// Type for request body
interface WithdrawRequest {
  amount?: string | number;
}

// Type for response from Spring
interface SpringResponse {
  [key: string]: unknown;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    const { walletId } = await params;

    // Parse request body safely
    const body: WithdrawRequest = await req.json().catch(() => ({}));
    const amount = body.amount ?? new URL(req.url).searchParams.get("amount");

    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    // Call Spring Wallet API for withdraw
    const res = await fetch(
      `${SPRING_WALLET_URL}/${walletId}/withdraw?amount=${encodeURIComponent(
        amount.toString()
      )}`,
      { method: "POST" }
    );

    const text = await res.text();

    try {
      const json: SpringResponse = JSON.parse(text);
      return NextResponse.json(json, { status: res.status });
    } catch {
      return NextResponse.json({ result: text }, { status: res.status });
    }
  } catch (err) {
    console.error("Wallet withdraw error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}