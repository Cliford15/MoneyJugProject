import { NextRequest, NextResponse } from "next/server";

const SPRING_WALLET_URL =
  process.env.SPRING_WALLET_URL || "http://localhost:8080/api/wallets";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    const { walletId } = await params;

    const res = await fetch(`${SPRING_WALLET_URL}/${walletId}`);
    const text = await res.text();

    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json({ result: text }, { status: res.status });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}