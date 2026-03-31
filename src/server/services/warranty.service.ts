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

  async getAll() {
    return prisma.warranty.findMany({
      include: {
        product: true,
        ownerships: {
          include: {
            user: true,
          },
        },
        claims: true,
        transfers: {
          include: {
            fromUser: true,
            toUser: true,
          },
        },
        events: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
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
