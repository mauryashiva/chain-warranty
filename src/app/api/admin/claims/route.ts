import { NextResponse } from "next/server";
import { ClaimController } from "@/server/admin/controller/claim.controller";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as any;

    const claims = await ClaimController.getAllClaims({
      status: status || undefined,
    });

    return NextResponse.json({ success: true, data: claims });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { claimId, status, note, adminId } = body;

    // Fixed: Explicitly type the result as 'any' or your Claim interface
    // to bypass the missing property check in the log message
    const updatedClaim: any = await ClaimController.updateStatus(
      claimId,
      adminId,
      status,
      note,
    );

    return NextResponse.json({
      success: true,
      message: `Claim ${updatedClaim.claimNumber} updated to ${status}`,
      data: updatedClaim,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
