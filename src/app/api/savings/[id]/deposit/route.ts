import { NextRequest, NextResponse } from "next/server";

const SPRING_SAVINGS_URL =
  process.env.SPRING_SAVINGS_URL || "http://localhost:8080/api/savings";

// Define a type for the request body
interface DepositBody {
  amount?: string | number;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } } // No need for Promise here
) {
  try {
    const { id } = params;

    // Safely parse the request JSON
    const body: DepositBody = (await req.json().catch(() => ({}))) as DepositBody;

    // Get amount from body or query string
    const amount = body.amount ?? new URL(req.url).searchParams.get("amount");

    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    // Call the Spring Boot deposit endpoint
    const res = await fetch(
      `${SPRING_SAVINGS_URL}/${id}/deposit?amount=${encodeURIComponent(String(amount))}`,
      { method: "POST" }
    );

    const text = await res.text();

    try {
      return NextResponse.json(JSON.parse(text), { status: res.status });
    } catch {
      return NextResponse.json({ result: text }, { status: res.status });
    }
  } catch (err) {
    console.error("Error in savings deposit POST:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}