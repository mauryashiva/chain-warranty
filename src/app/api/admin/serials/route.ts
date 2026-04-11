import { NextRequest, NextResponse } from "next/server";
import { SerialController } from "@/server/admin/controller/serial.controller";

/**
 * 📥 GET: Fetch serials list or system stats
 * Supports a ?type=stats query to get dashboard card data
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const query = searchParams.get("query");

    // 1. Handle Validation Search
    if (query) {
      const serial = await SerialController.validateSerialNumber(query);
      return NextResponse.json({ success: true, data: serial });
    }

    // 2. Handle Stats Request for Dashboard Cards
    if (type === "stats") {
      const stats = await SerialController.getSerialStats();
      return NextResponse.json({ success: true, data: stats });
    }

    // 3. Default: Fetch All Serials
    const serials = await SerialController.getAllSerials();
    return NextResponse.json({ success: true, data: serials });
  } catch (error: any) {
    console.error("[API_SERIALS_GET]:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch records" },
      { status: error.message.includes("not found") ? 404 : 500 },
    );
  }
}

/**
 * 📤 POST: Bulk Upload / Single Serial Registration
 * Receives the CSV-parsed array or single entry from the form
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Mandatory Validation
    if (!body.serials || !body.productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing serial list or product association.",
        },
        { status: 400 },
      );
    }

    // Execute Bulk Controller Logic
    const results = await SerialController.createSerials(body);

    return NextResponse.json(
      {
        success: true,
        data: results,
        message: `Batch processed: ${results.success} uploaded, ${results.failed} failed.`,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[API_SERIALS_POST]:", error);
    return NextResponse.json(
      { success: false, message: "System error during batch processing." },
      { status: 500 },
    );
  }
}
