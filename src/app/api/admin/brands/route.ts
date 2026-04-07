import { NextRequest, NextResponse } from "next/server";
import { BrandController } from "@/server/admin/controller/brand.controller";

/**
 * 📥 GET: Fetch all brands from the catalog
 * Database logic and relations are handled by the Controller
 */
export async function GET() {
  try {
    const data = await BrandController.getAllBrands();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[API_BRANDS_GET]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch brand catalog",
      },
      { status: 500 },
    );
  }
}

/**
 * 📤 POST: Create a new brand
 * Validation, slug generation, and DB insertion are handled by the Controller
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await BrandController.createBrand(body);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error("[API_BRANDS_POST]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error initializing brand registration",
      },
      { status: 400 },
    );
  }
}

/**
 * 🗑️ DELETE: Remove a brand from the catalog
 * Integrity checks (e.g., checking for active products) are handled by the Controller
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Brand ID is required for deletion" },
        { status: 400 },
      );
    }

    // Pass the ID to the controller to handle relation checks and deletion
    await BrandController.deleteBrand(id);

    return NextResponse.json({
      success: true,
      message: "Brand removed successfully",
    });
  } catch (error: any) {
    console.error("[API_BRANDS_DELETE]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error during deletion",
      },
      { status: 400 }, // Using 400 as the controller will likely throw validation/integrity errors
    );
  }
}
