// src/server/services/warranty.service.ts

import { prisma } from "@/server/db/prisma";
import { ownershipService } from "./ownership.service";
import { blockchainService } from "@/server/blockchain/mint.service";

type CreateWarrantyInput = {
  productId: string;
  purchaseDate: Date;
  expiryDate: Date;
  userId: string;
  walletAddress: string; // required for mint
};

type TransferWarrantyInput = {
  warrantyId: string;
  fromUserId: string;
  toUserId: string;
};

export const warrantyService = {
  async create(data: CreateWarrantyInput) {
    // 🔥 STEP 0 — CHECK IF PRODUCT EXISTS (NEW)
    const productExists = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!productExists) {
      throw new Error(
        `Product with ID ${data.productId} does not exist. Create the product first!`,
      );
    }

    // 🔥 STEP 1 — Mint NFT
    const blockchain = await blockchainService.mintWarranty(data.walletAddress);

    if (!blockchain.tokenId) {
      throw new Error("Failed to mint NFT or extract tokenId");
    }

    // 🔥 STEP 2 — Save in DB
    const warranty = await prisma.warranty.create({
      data: {
        tokenId: blockchain.tokenId,
        contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        productId: data.productId,
        purchaseDate: data.purchaseDate,
        expiryDate: data.expiryDate,
      },
    });

    // 🔥 STEP 3 — Assign ownership
    await ownershipService.assignOwnership(warranty.id, data.userId);

    return {
      warranty,
      txHash: blockchain.txHash,
    };
  },

  /**
   * 🔥 NEW: Transfer Ownership Orchestration
   */
  async transfer(data: TransferWarrantyInput) {
    // 1. Fetch Warranty and Wallet details
    const warranty = await prisma.warranty.findUnique({
      where: { id: data.warrantyId },
      include: {
        ownerships: {
          where: { userId: data.fromUserId, isActive: true },
        },
      },
    });

    if (!warranty || warranty.ownerships.length === 0) {
      throw new Error("Warranty not found or user is not the current owner");
    }

    // 2. Get Wallet addresses for blockchain call
    const fromWallet = await prisma.wallet.findFirst({
      where: { userId: data.fromUserId },
    });
    const toWallet = await prisma.wallet.findFirst({
      where: { userId: data.toUserId },
    });

    if (!fromWallet || !toWallet) {
      throw new Error("Source or destination wallet not found in database");
    }

    // 3. Perform Blockchain Transfer
    const blockchain = await blockchainService.transferWarranty(
      fromWallet.address,
      toWallet.address,
      warranty.tokenId,
    );

    // 4. Update Database State (Ownership records + Transfer log)
    const updatedOwnership = await ownershipService.transferOwnership(
      data.warrantyId,
      data.fromUserId,
      data.toUserId,
      blockchain.txHash,
    );

    return {
      success: true,
      newOwnership: updatedOwnership,
      txHash: blockchain.txHash,
    };
  },

  async getAll() {
    return prisma.warranty.findMany({
      include: {
        product: true,
        ownerships: true,
        claims: true,
      },
    });
  },

  async getById(id: string) {
    return prisma.warranty.findUnique({
      where: { id },
      include: {
        product: true,
        ownerships: true,
        claims: true,
        events: true,
      },
    });
  },
};
