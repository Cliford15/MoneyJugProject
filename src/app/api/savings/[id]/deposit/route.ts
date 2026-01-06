import { NextRequest, NextResponse } from "next/server";

const SPRING_SAVINGS_URL =
  process.env.SPRING_SAVINGS_URL || "http://localhost:8080/api/savings";

// Request body type
interface DepositBody {
  amount?: string | number;
}

// POST params type for App Router
interface Params {
  id: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> } // <--- use Promise here
) {
  try {
    const { id } = await params; // <--- await the promise

    // Parse request body safely
    const body: DepositBody = (await req.json().catch(() => ({}))) as DepositBody;

    // Get amount from body or query string
    const amount = body.amount ?? new URL(req.url).searchParams.get("amount");

    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Call Spring Boot deposit endpoint
    const res = await fetch(
      `${SPRING_SAVINGS_URL}/${id}/deposit?amount=${encodeURIComponent(
        String(numericAmount)
      )}`,
      { method: "POST" }
    );

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json({ result: text }, { status: res.status });
    }
  } catch (err) {
    console.error("Error in savings deposit POST:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}