import { NextResponse } from "next/server";
import {
  createWarranty,
  getAllWarranties,
  transferWarranty, // 🔥 Import the new controller function
} from "@/server/controllers/warranty.controller";

/**
 * POST: Handles creating a warranty and assigning ownership.
 */
export async function POST(req: Request) {
  try {
    return await createWarranty(req);
  } catch (error) {
    console.error("POST Warranty Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create warranty" },
      { status: 500 },
    );
  }
}

/**
 * GET: Retrieves all warranties.
 */
export async function GET() {
  try {
    return await getAllWarranties();
  } catch (error) {
    console.error("GET Warranties Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch warranties" },
      { status: 500 },
    );
  }
}

/**
 * 🔥 NEW: PATCH: Handles transferring warranty ownership.
 * We use PATCH here because we are updating an existing warranty's state.
 */
export async function PATCH(req: Request) {
  try {
    return await transferWarranty(req);
  } catch (error) {
    console.error("PATCH Warranty Transfer Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to transfer warranty" },
      { status: 500 },
    );
  }
}
