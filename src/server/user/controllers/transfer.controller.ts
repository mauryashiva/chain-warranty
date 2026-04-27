import { NextResponse } from "next/server";
import { transferService } from "@/server/user/services/transfer.service";
import { prisma } from "@/server/db/prisma";
import { walletService } from "@/server/user/services/wallet.service";

export async function transferWarranty(req: Request) {
  try {
    const body = await req.json();
    
    const { warrantyId, fromWallet, toWallet, reason } = body;

    if (!warrantyId || !fromWallet || !toWallet) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethAddressRegex.test(fromWallet) || !ethAddressRegex.test(toWallet)) {
      return NextResponse.json(
        { success: false, message: "Invalid wallet address format. Must be a valid 42-character Ethereum address starting with 0x." },
        { status: 400 }
      );
    }

    // 🛡️ DEFENSIVE VALIDATION: Check if the sender actually owns the warranty
    const sender = await walletService.findOrCreateUserByWallet(fromWallet);
    const warranty = await prisma.warranty.findUnique({
      where: { id: warrantyId },
      include: {
        ownerships: {
          where: { isActive: true },
        },
      },
    });

    if (!warranty) {
      return NextResponse.json(
        { success: false, message: "Warranty not found" },
        { status: 404 }
      );
    }

    const currentOwnership = warranty.ownerships[0];
    if (!currentOwnership || currentOwnership.userId !== sender.id) {
      return NextResponse.json(
        { success: false, message: "Sender does not own this warranty" },
        { status: 403 }
      );
    }

    if (warranty.status !== "ACTIVE" && warranty.status !== "TRANSFERRED") {
      return NextResponse.json(
        { success: false, message: "Warranty is not transferable" },
        { status: 400 }
      );
    }

    // Pass to service layer
    const result = await transferService.executeTransfer({
      warrantyId,
      fromWallet,
      toWallet,
      reason,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Transfer Controller Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred during transfer",
      },
      { status: 400 },
    );
  }
}
