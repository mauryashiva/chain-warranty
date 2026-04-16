import { NextResponse } from "next/server";
import { warrantyService } from "@/server/user/services/warranty.service";
import { walletService } from "@/server/user/services/wallet.service";
import { prisma } from "@/server/db/prisma";

/**
 * Create warranty:
 * - Find/create user via wallet
 * - Enrich missing Brand/Product names via IDs
 * - Mint NFT on blockchain (handled in service)
 * - Store full warranty details in DB
 */
export async function createWarranty(req: Request) {
  try {
    const body = await req.json();

    // 🛡️ 1. DATA ENRICHMENT (New Logic)
    // If frontend sends IDs instead of names, we fetch names from DB
    let enrichedBrand = body.brand;
    let enrichedProductName = body.productName;
    let brandId = body.brandId;
    let modelNumber = body.modelNumber;

    if (!enrichedProductName || !enrichedBrand || !brandId || !modelNumber) {
      const productData = await prisma.product.findUnique({
        where: { id: body.productId },
        include: { brand: true },
      });

      if (productData) {
        enrichedProductName = productData.name;
        enrichedBrand = productData.brand.name;
        brandId = productData.brand.id;
        modelNumber = productData.modelNumber;
      }
    }

    // 🛡️ 2. DEFENSIVE VALIDATION (Updated to check enriched values)
    const requiredFields = [
      "walletAddress",
      "productId",
      "serialNumber",
      "purchaseDate",
      "warrantyPeriod",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Explicit check for the names we just tried to enrich
    if (!enrichedBrand || !enrichedProductName) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required field: brand or productName",
        },
        { status: 400 },
      );
    }

    // 🛡️ 3. DATE TRANSFORMATION & EXPIRY LOGIC
    const purchaseDate = new Date(body.purchaseDate);
    let expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;

    if (!expiryDate) {
      const yearsMatch = body.warrantyPeriod.match(/\d+/);
      const years = yearsMatch ? parseInt(yearsMatch[0]) : 1;
      expiryDate = new Date(purchaseDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + years);
    }

    // 🔥 STEP 1 — Find or create user via wallet service
    const user = await walletService.findOrCreateUserByWallet(
      body.walletAddress,
    );

    // 🔥 STEP 2 — Create warranty (Blockchain + DB Mapping)
    const result = await warrantyService.create({
      brandId: brandId,
      userId: user.id,
      walletAddress: body.walletAddress,
      productId: body.productId,

      // Product Information (Using enriched names)
      productName: enrichedProductName,
      brand: enrichedBrand,
      modelNumber: modelNumber,
      serialNumber: body.serialNumber,
      imei: body.imei || null,
      category: body.category || null,
      color: body.color || null,
      productCondition: body.condition || "New",

      // Purchase & Financial Details
      purchaseDate: purchaseDate,
      expiryDate: expiryDate,
      warrantyPeriod: body.warrantyPeriod,

      // 💎 PRECISION FIX: Pass as String to prevent Decimal rounding errors
      price: body.price ? body.price.toString() : "0.00",

      retailer: body.retailer || null,
      invoiceNumber: body.invoiceNumber || null,
      country: body.country || null,

      // Registrant Snapshot
      ownerName: body.ownerName || null,
      ownerEmail: body.email || null,
      ownerPhone: body.phone || null,

      // Metadata / Cloud Storage URLs
      frontPhotoUrl: body.metadata?.frontUrl || null,
      backPhotoUrl: body.metadata?.backUrl || null,
      invoiceDocUrl: body.metadata?.invoiceUrl || null,
      warrantyCardUrl: body.metadata?.cardUrl || null,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Controller Error [createWarranty]:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "An unexpected error occurred during registration",
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

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Controller Error [getAllWarranties]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch warranties",
      },
      { status: 500 },
    );
  }
}
