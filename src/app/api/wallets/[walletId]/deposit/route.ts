// src/app/api/wallets/[walletId]/deposit/route.ts
import { NextRequest, NextResponse } from "next/server";

const SPRING_WALLET_URL =
  process.env.SPRING_WALLET_URL || "http://localhost:8080/api/wallets";

// Type for request body
interface DepositRequest {
  amount?: string | number;
}

// Type for response from Spring
interface SpringResponse {
  [key: string]: unknown;
}

// Type for route params
interface Params {
  walletId: string;
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const { walletId } = params;

    // Parse request body safely
    const body: DepositRequest = (await req.json().catch(() => ({}))) as DepositRequest;

    // Get amount from body or query string
    const amount = body.amount ?? new URL(req.url).searchParams.get("amount");

    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Call Spring Wallet API
    const res = await fetch(
      `${SPRING_WALLET_URL}/${walletId}/deposit?amount=${encodeURIComponent(
        String(numericAmount)
      )}`,
      { method: "POST" }
    );

    const text = await res.text();

    try {
      const json: SpringResponse = JSON.parse(text);
      return NextResponse.json(json, { status: res.status });
    } catch {
      // fallback for plain text response
      return NextResponse.json({ result: text }, { status: res.status });
    }
  } catch (err) {
    console.error("Wallet deposit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}