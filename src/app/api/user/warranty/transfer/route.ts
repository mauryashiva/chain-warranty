import { NextResponse } from "next/server";
import { transferWarranty } from "@/server/user/controllers/transfer.controller";

export async function POST(req: Request) {
  try {
    const response = await transferWarranty(req);
    return response;
  } catch (error) {
    console.error("Transfer Warranty Error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to transfer warranty" },
      { status: 500 },
    );
  }
}
