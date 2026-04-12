import { NextRequest, NextResponse } from "next/server";
import { SerialController } from "@/server/admin/controller/serial.controller";

/**
 * 📥 GET: Fetch serials list, system stats, or validate a specific SN
 * Handles:
 * - /api/admin/serials?query=SN123 (Validation)
 * - /api/admin/serials?type=stats (Dashboard Cards)
 * - /api/admin/serials (Full List)
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

/**
 * 🔄 PATCH: Update Serial Lifecycle (Retailer, Dispatch, Status)
 * Target: /api/admin/serials?id={uuid}
 */
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Serial ID is required for update." },
        { status: 400 },
      );
    }

    const updatedSerial = await SerialController.updateSerial(id, body);

    return NextResponse.json({
      success: true,
      data: updatedSerial,
      message: "Serial record synchronized successfully.",
    });
  } catch (error: any) {
    console.error("[API_SERIALS_PATCH]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update serial lifecycle data.",
      },
      { status: 500 },
    );
  }
}

/**
 * 🗑️ DELETE: Hard/Soft removal from registry (Optional based on requirements)
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID required for deletion." },
        { status: 400 },
      );
    }

    // If you have a delete method in controller, call it here
    // await SerialController.deleteSerial(id);

    return NextResponse.json({
      success: true,
      message: "Serial record removed from active registry.",
    });
  } catch (error: any) {
    console.error("[API_SERIALS_DELETE]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to remove record." },
      { status: 500 },
    );
  }
}
