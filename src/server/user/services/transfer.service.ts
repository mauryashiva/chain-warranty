import { prisma } from "@/server/db/prisma";
import { blockchainService } from "@/server/blockchain/mint.service";
import { walletService } from "./wallet.service";
import { sendEvent } from "@/server/events/sse";

type TransferInput = {
  warrantyId: string;
  fromWallet: string;
  toWallet: string;
  reason?: string;
  salePrice?: number;
};

export const transferService = {
  async executeTransfer(data: TransferInput) {
    const { warrantyId, fromWallet, toWallet, reason, salePrice } = data;

    // 1. Fetch Sender and Recipient Users
    const sender = await walletService.findOrCreateUserByWallet(fromWallet);
    const recipient = await walletService.findOrCreateUserByWallet(toWallet);

    if (sender.id === recipient.id) {
      throw new Error("Cannot transfer to the same wallet");
    }

    // 2. Fetch Warranty to get TokenId
    const warranty = await prisma.warranty.findUnique({
      where: { id: warrantyId },
      include: {
        ownerships: {
          where: { isActive: true },
        },
      },
    });

    if (!warranty) {
      throw new Error("WARRANTY_NOT_FOUND");
    }

    // 3. Blockchain Transfer
    const blockchain = await blockchainService.transferWarranty(
      fromWallet,
      toWallet,
      warranty.tokenId
    );

    // 4. Atomic Database Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deactivate current ownership
      await tx.warrantyOwnership.updateMany({
        where: {
          warrantyId: warranty.id,
          userId: sender.id,
          isActive: true,
        },
        data: {
          isActive: false,
          toWallet: toWallet,
        },
      });

      // Create new ownership
      const newOwnership = await tx.warrantyOwnership.create({
        data: {
          warrantyId: warranty.id,
          userId: recipient.id,
          isActive: true,
          fromWallet: fromWallet,
          transferReason: reason || "TRANSFER",
          salePrice: salePrice || null,
        },
      });

      // Create transfer record
      const transferRecord = await tx.transfer.create({
        data: {
          warrantyId: warranty.id,
          fromUserId: sender.id,
          toUserId: recipient.id,
          txHash: blockchain.txHash,
          status: "COMPLETED",
          fromWallet: fromWallet,
          toWallet: toWallet,
          reason: reason || "TRANSFER",
          salePrice: salePrice || null,
          transferDate: new Date(),
        },
      });

      // Log warranty event
      await tx.warrantyEvent.create({
        data: {
          warrantyId: warranty.id,
          type: "TRANSFERRED",
          txHash: blockchain.txHash,
          triggeredBy: sender.id,
          metadata: {
            fromWallet,
            toWallet,
            reason: reason || "TRANSFER",
          },
        },
      });

      // Update warranty core record
      await tx.warranty.update({
        where: { id: warranty.id },
        data: {
          ownerWallet: toWallet,
          status: "TRANSFERRED",
          ownerName: null, 
          ownerEmail: null,
          ownerPhone: null,
        },
      });

      return {
        transferId: transferRecord.id,
        txHash: blockchain.txHash,
        newOwnership,
      };
    });

    // 5. Fire SSE Event
    sendEvent({
      type: "WARRANTY_TRANSFERRED",
      data: {
        warrantyId,
        fromUserId: sender.id,
        toUserId: recipient.id,
        txHash: blockchain.txHash,
      },
    });

    return {
      success: true,
      data: result,
    };
  },
};
