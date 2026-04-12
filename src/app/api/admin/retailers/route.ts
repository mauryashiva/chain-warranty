import { NextRequest, NextResponse } from "next/server";
import { RetailerController } from "@/server/admin/controller/retailer.controller";

/**
 * 📥 GET: Fetch all authorized retailers
 */
export async function GET() {
  try {
    const retailers = await RetailerController.getAllRetailers();
    return NextResponse.json({ success: true, data: retailers });
  } catch (error: any) {
    console.error("[API_RETAILERS_GET]:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch retailer list" },
      { status: 500 },
    );
  }
}

/**
 * 📤 POST: Register a new retailer with brand authorizations
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Mandatory Validation
    if (!body.name || !body.gstNumber || !body.city || !body.contactEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: Name, GST, Email, or City",
        },
        { status: 400 },
      );
    }

    // 2. Ensure at least one brand is authorized
    if (
      !body.brandIds ||
      !Array.isArray(body.brandIds) ||
      body.brandIds.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Retailer must be authorized for at least one brand.",
        },
        { status: 400 },
      );
    }

    const retailer = await RetailerController.createRetailer(body);
    return NextResponse.json(
      { success: true, data: retailer },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[API_RETAILERS_POST]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to register retailer",
      },
      { status: 400 },
    );
  }
}

/**
 * 🔄 PATCH: Update an existing retailer's profile and authorizations
 * URL Format: /api/admin/retailers?id={uuid}
 */
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Retailer ID is required for update." },
        { status: 400 },
      );
    }

    // 1. Validation: Ensure authorizations are not wiped out
    if (
      body.brandIds &&
      (!Array.isArray(body.brandIds) || body.brandIds.length === 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Retailer must maintain at least one brand authorization.",
        },
        { status: 400 },
      );
    }

    const updatedRetailer = await RetailerController.updateRetailer(id, body);

    return NextResponse.json({
      success: true,
      data: updatedRetailer,
      message: "Retailer profile synchronized successfully.",
    });
  } catch (error: any) {
    console.error("[API_RETAILERS_PATCH]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update retailer profile.",
      },
      { status: 500 },
    );
  }
}

/**
 * 🗑️ DELETE: Soft delete a retailer
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Retailer ID is required for deletion." },
        { status: 400 },
      );
    }

    await RetailerController.deleteRetailer(id);
    return NextResponse.json({
      success: true,
      message: "Retailer successfully decommissioned from registry.",
    });
  } catch (error: any) {
    console.error("[API_RETAILERS_DELETE]:", error);
    return NextResponse.json(
      { success: false, message: "System error during retailer deletion." },
      { status: 500 },
    );
  }
}
