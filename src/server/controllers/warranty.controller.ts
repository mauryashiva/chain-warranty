// src/server/controllers/warranty.controller.ts

import { warrantyService } from "@/server/services/warranty.service";
import { walletService } from "@/server/services/wallet.service";

/**
 * Create warranty:
 * - Find/create user via wallet
 * - Mint NFT on blockchain
 * - Store warranty in DB
 * - Assign ownership
 */
export async function createWarranty(req: Request) {
  try {
    const body = await req.json();

    // 🔥 Validate required fields
    if (!body.walletAddress) {
      throw new Error("walletAddress is required");
    }

    if (!body.productId) {
      throw new Error("productId is required");
    }

    if (!body.purchaseDate || !body.expiryDate) {
      throw new Error("purchaseDate and expiryDate are required");
    }

    // 🔥 STEP 1 — Find or create user
    const user = await walletService.findOrCreateUserByWallet(
      body.walletAddress,
    );

    // 🔥 STEP 2 — Create warranty (blockchain + DB)
    const result = await warrantyService.create({
      walletAddress: body.walletAddress,
      productId: body.productId,
      purchaseDate: new Date(body.purchaseDate),
      expiryDate: new Date(body.expiryDate),
      userId: user.id,
    });

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to create warranty",
      },
      { status: 400 },
    );
  }
}

/**
 * 🔥 NEW: Transfer ownership of a warranty
 */
export async function transferWarranty(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    if (!body.warrantyId || !body.fromUserId || !body.toWalletAddress) {
      throw new Error(
        "warrantyId, fromUserId, and toWalletAddress are required",
      );
    }

    // 1. Ensure the recipient exists in our system (create if not)
    const recipient = await walletService.findOrCreateUserByWallet(
      body.toWalletAddress,
    );

    // 2. Execute transfer logic (Blockchain + DB)
    const result = await warrantyService.transfer({
      warrantyId: body.warrantyId,
      fromUserId: body.fromUserId,
      toUserId: recipient.id,
    });

    return Response.json({
      success: true,
      message: "Warranty transferred successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Transfer Controller Error:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to transfer warranty",
      },
      { status: 400 },
    );
  }
}

/**
 * Get all warranties
 */
export async function getAllWarranties() {
  try {
    const data = await warrantyService.getAll();

    return Response.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch warranties",
      },
      { status: 500 },
    );
  }
}
