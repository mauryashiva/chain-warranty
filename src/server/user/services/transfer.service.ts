import { prisma } from "@/server/db/prisma";
import { blockchainService } from "@/server/blockchain/mint.service";
import { ownershipService } from "./ownership.service";
import { walletService } from "./wallet.service";
import { sendEvent } from "@/server/events/sse"; // ✅ ADD THIS

type TransferInput = {
  warrantyId: string;
  fromWallet: string;
  toWallet: string;
};

export const transferService = {
  async transfer({ warrantyId, fromWallet, toWallet }: TransferInput) {
    // 🔥 Step 1 — Find users
    const fromUser = await walletService.findOrCreateUserByWallet(fromWallet);
    const toUser = await walletService.findOrCreateUserByWallet(toWallet);

    // 🔥 Step 2 — Get warranty
    const warranty = await prisma.warranty.findUnique({
      where: { id: warrantyId },
    });

    if (!warranty) {
      throw new Error("Warranty not found");
    }

    // 🔥 Step 3 — Blockchain transfer
    const blockchain = await blockchainService.transferWarranty(
      fromWallet,
      toWallet,
      warranty.tokenId,
    );

    // 🔥 Step 4 — Update DB ownership
    await ownershipService.transferOwnership(
      warrantyId,
      fromUser.id,
      toUser.id,
      blockchain.txHash,
    );

    // 🔥 Step 5 — SSE EVENT (FIXED ✅)
    sendEvent({
      type: "WARRANTY_TRANSFERRED",
      data: {
        warrantyId,
        fromUserId: fromUser.id,
        toUserId: toUser.id,
        txHash: blockchain.txHash,
      },
    });

    return {
      success: true,
      txHash: blockchain.txHash,
    };
  },
};
