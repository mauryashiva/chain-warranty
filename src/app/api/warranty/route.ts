import { NextResponse } from "next/server";
import {
  createWarranty,
  getAllWarranties,
} from "@/server/controllers/warranty.controller";

/**
 * POST: Handles creating a warranty and assigning ownership.
 * Internally calls the controller which manages the wallet/user logic.
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
 * The controller handles the Prisma findMany logic with includes.
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
