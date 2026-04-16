import { NextResponse } from "next/server";
import {
  createWarranty,
  getAllWarranties,
} from "@/server/user/controllers/warranty.controller";

/**
 * 🛰️ POST: Register / Mint Warranty
 * This endpoint handles:
 * 1. Data enrichment (finding Brand/Product names by IDs)
 * 2. Wallet-user association
 * 3. Final on-chain metadata preparation
 */
export async function POST(req: Request) {
  try {
    // We pass the 'req' directly to the controller.
    // The controller now handles the lookup of Brand/Product names
    // to prevent the "Missing field: productName" 400 error.
    const response = await createWarranty(req);
    return response;
  } catch (error: any) {
    console.error("Critical Protocol Error [POST /api/user/warranty]:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Protocol failed to register the warranty identity.",
      },
      { status: 500 },
    );
  }
}

/**
 * 📜 GET: Fetch all warranties
 * Used for the User Dashboard "My Warranties" table.
 */
export async function GET() {
  try {
    const response = await getAllWarranties();
    return response;
  } catch (error: any) {
    console.error("Registry Error [GET /api/user/warranty]:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve the warranty registry.",
      },
      { status: 500 },
    );
  }
}
