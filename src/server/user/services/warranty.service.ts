import { prisma } from "@/server/db/prisma";
import { blockchainService } from "@/server/blockchain/mint.service";

// 🔥 Industry-Level Type Definition
type CreateWarrantyInput = {
  // Identifiers
  brandId: string;
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
  modelNumber?: string | null;

  // Purchase Details
  purchaseDate: Date;
  expiryDate?: Date;
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
  // 🛡️ VALIDATION METHODS
  async validateBrand(brandId: string) {
    const brand = await prisma.brand.findUnique({
      where: { id: brandId, status: "ACTIVE" },
    });
    if (!brand) {
      throw new Error("BRAND_NOT_FOUND_OR_INACTIVE");
    }
    return brand;
  },

  async validateProduct(productId: string, brandId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId, brandId, status: "ACTIVE" },
    });
    if (!product) {
      throw new Error("PRODUCT_NOT_FOUND_OR_INACTIVE");
    }
    return product;
  },

  async validateSerial(serialNumber: string, productId: string) {
    const serial = await prisma.serial.findUnique({
      where: { serialNumber },
    });
    if (!serial) {
      throw new Error("SERIAL_NOT_FOUND");
    }
    if (serial.productId !== productId) {
      throw new Error("SERIAL_DOES_NOT_BELONG_TO_PRODUCT");
    }
    if (serial.status === "REGISTERED") {
      throw new Error("SERIAL_ALREADY_REGISTERED");
    }
    if (serial.status === "FLAGGED" || serial.status === "BLOCKED") {
      throw new Error("SERIAL_FLAGGED_OR_BLOCKED");
    }
    return serial;
  },

  async validateModelNumber(
    modelNumber: string | null,
    productModelNumber: string,
  ) {
    if (modelNumber && modelNumber !== productModelNumber) {
      throw new Error("MODEL_NUMBER_MISMATCH");
    }
  },

  async validateIMEI(imei: string | null, serialRegex: string | null) {
    if (imei) {
      // IMEI should be exactly 15 digits
      const imeiRegex = /^\d{15}$/;
      if (!imeiRegex.test(imei)) {
        throw new Error("IMEI_INVALID_FORMAT");
      }
    }
  },

  async validatePurchaseDate(purchaseDate: Date) {
    const now = new Date();
    if (purchaseDate > now) {
      throw new Error("PURCHASE_DATE_FUTURE");
    }
    const globalConfig = await prisma.globalConfig.findUnique({
      where: { singleton: "global" },
    });
    const maxDays = globalConfig?.maxDaysToRegister || 30;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - maxDays);
    if (purchaseDate < maxDate) {
      throw new Error("PURCHASE_DATE_TOO_OLD");
    }
  },

  async calculateExpiryDate(
    purchaseDate: Date,
    productId: string,
  ): Promise<Date> {
    const warrantyRule = await prisma.warrantyRule.findUnique({
      where: { productId },
    });
    const months = warrantyRule?.defaultPeriod || 12;
    const expiry = new Date(purchaseDate);
    expiry.setMonth(expiry.getMonth() + months);
    const now = new Date();
    if (expiry < now) {
      throw new Error("WARRANTY_ALREADY_EXPIRED");
    }
    return expiry;
  },

  async createMetadata(data: CreateWarrantyInput, tokenId: string) {
    // Create metadata JSON for IPFS
    const metadata = {
      name: `Warranty NFT #${tokenId}`,
      description: `Blockchain-verified warranty for ${data.productName}`,
      image: data.frontPhotoUrl || "", // Use front photo as image
      attributes: [
        { trait_type: "Product", value: data.productName },
        { trait_type: "Brand", value: data.brand },
        { trait_type: "Serial Number", value: data.serialNumber },
        { trait_type: "Purchase Date", value: data.purchaseDate.toISOString() },
        { trait_type: "Expiry Date", value: data.expiryDate?.toISOString() },
        { trait_type: "Warranty Period", value: data.warrantyPeriod },
      ],
    };
    // TODO: Pin to IPFS and return URL
    // For now, return placeholder
    return "ipfs://placeholder";
  },

  async create(data: CreateWarrantyInput) {
    // 🛡️ STEP 1 — Validate Brand
    const brand = await this.validateBrand(data.brandId || "");

    // 🛡️ STEP 2 — Validate Product
    const product = await this.validateProduct(data.productId, brand.id);

    // 🛡️ STEP 3 — Validate Serial
    const serial = await this.validateSerial(data.serialNumber, product.id);

    // 🛡️ STEP 4 — Validate Model Number
    await this.validateModelNumber(
      data.modelNumber || null,
      product.modelNumber,
    );

    // 🛡️ STEP 5 — Validate IMEI
    await this.validateIMEI(data.imei || null, product.serialRegex);

    // 🛡️ STEP 6 — Validate Purchase Date
    await this.validatePurchaseDate(data.purchaseDate);

    // 🛡️ STEP 7 — Calculate Expiry Date
    const expiryDate = await this.calculateExpiryDate(
      data.purchaseDate,
      product.id,
    );

    // 🛡️ STEP 8 — BLOCKCHAIN MINTING
    const blockchain = await blockchainService.mintWarranty(data.walletAddress);

    if (!blockchain.tokenId) {
      throw new Error("Blockchain Minting failed: No TokenID returned.");
    }

    // 🛡️ STEP 9 — Create Metadata and Pin to IPFS
    const ipfsUrl = await this.createMetadata(
      data,
      blockchain.tokenId.toString(),
    );

    // 🛡️ STEP 10 — ATOMIC DATABASE TRANSACTION
    return await prisma.$transaction(async (tx) => {
      // A. Update Serial Status
      await tx.serial.update({
        where: { id: serial.id },
        data: { status: "REGISTERED" },
      });

      // B. Create the Warranty Record
      const warranty = await tx.warranty.create({
        data: {
          tokenId: blockchain.tokenId.toString(),
          contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
          productId: data.productId,
          serialId: serial.id,
          ipfsMetadataUrl: ipfsUrl,
          ownerWallet: data.walletAddress,

          // Product Specs Snapshot
          productName: data.productName,
          brand: data.brand,
          modelNumber: product.modelNumber,
          serialNumber: data.serialNumber,
          imei: data.imei || null,
          category: data.category,
          color: data.color,
          productCondition: data.productCondition,

          // Purchase & Financials
          purchaseDate: data.purchaseDate,
          expiryDate: expiryDate,
          warrantyPeriod: data.warrantyPeriod,
          price: data.price ? parseFloat(data.price) : 0,
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
          txHash: blockchain.txHash,
        },
      });

      // C. Create Ownership Record
      await tx.warrantyOwnership.create({
        data: {
          warrantyId: warranty.id,
          userId: data.userId,
          isActive: true,
          fromWallet: data.walletAddress,
        },
      });

      // D. Log the System Event
      await tx.warrantyEvent.create({
        data: {
          warrantyId: warranty.id,
          type: "REGISTERED",
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
        expiryDate,
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
