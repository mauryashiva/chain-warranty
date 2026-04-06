import { NextResponse } from "next/server";
import {
  createWarranty,
  getAllWarranties,
} from "@/server/user/controllers/warranty.controller";

/**
 * POST: Create / Mint / Register warranty
 */
export async function POST(req: Request) {
  try {
    const response = await createWarranty(req);
    return response;
  } catch (error) {
    console.error("POST Warranty Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to create warranty" },
      { status: 500 },
    );
  }
}

/**
 * GET: Fetch all warranties
 */
export async function GET() {
  try {
    const response = await getAllWarranties();
    return response;
  } catch (error) {
    console.error("GET Warranties Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch warranties" },
      { status: 500 },
    );
  }
}
