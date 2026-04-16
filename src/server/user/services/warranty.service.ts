import { prisma } from "@/server/db/prisma";
import { blockchainService } from "@/server/blockchain/mint.service";

// 🔥 Industry-Level Type Definition
type CreateWarrantyInput = {
  // Identifiers
  productId: string;
  userId: string;
  walletAddress: string;

  // Product Details
  productName: string;
  brand: string;
  serialNumber: string;
  imei?: string | null;
  category?: string | null;
  color?: string | null;
  productCondition?: string | null;

  // Purchase Details
  purchaseDate: Date;
  expiryDate: Date;
  warrantyPeriod: string;
  price: string;
  retailer?: string | null; // This comes from frontend
  invoiceNumber?: string | null;
  country?: string | null;

  // Owner Snapshot
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerPhone?: string | null;

  // Supabase/Cloudinary URLs
  frontPhotoUrl?: string | null;
  backPhotoUrl?: string | null;
  invoiceDocUrl?: string | null;
  warrantyCardUrl?: string | null;
};

export const warrantyService = {
  async create(data: CreateWarrantyInput) {
    // 🛡️ STEP 0 — PRE-FLIGHT CHECK
    const productExists = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!productExists) {
      throw new Error(
        `Product ID ${data.productId} not found. Please verify product catalog.`,
      );
    }

    // 🛡️ STEP 1 — BLOCKCHAIN MINTING
    // We do this OUTSIDE the DB transaction because blockchain operations are slow.
    const blockchain = await blockchainService.mintWarranty(data.walletAddress);

    if (!blockchain.tokenId) {
      throw new Error("Blockchain Minting failed: No TokenID returned.");
    }

    // 🛡️ STEP 2 — ATOMIC DATABASE TRANSACTION
    return await prisma.$transaction(async (tx) => {
      // A. Create the Warranty Record
      const warranty = await tx.warranty.create({
        data: {
          tokenId: blockchain.tokenId.toString(),
          contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          productId: data.productId,

          // Product Specs Snapshot
          productName: data.productName,
          brand: data.brand,
          serialNumber: data.serialNumber,
          imei: data.imei,
          category: data.category,
          color: data.color,
          productCondition: data.productCondition,

          // Purchase & Financials
          purchaseDate: data.purchaseDate,
          expiryDate: data.expiryDate,
          warrantyPeriod: data.warrantyPeriod,
          price: data.price,

          // 🛠️ FIX: If your schema doesn't have 'retailer',
          // we only pass retailerId if we have one.
          // If you want to store the text "Amazon", use invoiceNumber
          // or add 'retailerName' to your Prisma schema.
          invoiceNumber: data.invoiceNumber,
          country: data.country,

          // Owner Snapshot
          ownerName: data.ownerName,
          ownerEmail: data.ownerEmail,
          ownerPhone: data.ownerPhone,

          // Cloud Storage URLs
          frontPhotoUrl: data.frontPhotoUrl,
          backPhotoUrl: data.backPhotoUrl,
          invoiceDocUrl: data.invoiceDocUrl,
          warrantyCardUrl: data.warrantyCardUrl,

          status: "ACTIVE",
          txHash: blockchain.txHash, // Storing hash for history
        },
      });

      // B. Create Ownership Record
      await tx.warrantyOwnership.create({
        data: {
          warrantyId: warranty.id,
          userId: data.userId,
          isActive: true,
        },
      });

      // C. Log the System Event
      await tx.warrantyEvent.create({
        data: {
          warrantyId: warranty.id,
          type: "CREATED",
          txHash: blockchain.txHash,
          metadata: {
            mintedTo: data.walletAddress,
            blockchainAction: "INITIAL_MINT",
            timestamp: new Date().toISOString(),
          },
        },
      });

      return {
        warranty,
        txHash: blockchain.txHash,
        tokenId: blockchain.tokenId,
      };
    });
  },

  async getAll() {
    return prisma.warranty.findMany({
      where: { isDeleted: false },
      include: {
        product: true,
        ownerships: {
          where: { isActive: true },
          include: { user: true },
        },
        claims: true,
        events: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.warranty.findUnique({
      where: { id, isDeleted: false },
      include: {
        product: true,
        ownerships: {
          where: { isActive: true },
          include: { user: true },
        },
        claims: {
          orderBy: { createdAt: "desc" },
        },
        events: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },
};
