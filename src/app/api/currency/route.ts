import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    // Open ExchangeRate-API (Free, no API key needed for standard 24h updates)
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await res.json();
    
    return NextResponse.json({
      rates: data.rates,
      lastUpdated: data.time_last_update_utc
    });
  } catch (error) {
    console.error("Currency API Error:", error);
    // Return a fallback or 500 error
    return NextResponse.json({ error: "Failed to fetch currency rates" }, { status: 500 });
  }
}
