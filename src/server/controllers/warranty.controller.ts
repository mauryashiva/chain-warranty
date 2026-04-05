// src/server/controllers/warranty.controller.ts

import { warrantyService } from "@/server/services/warranty.service";
import { walletService } from "@/server/services/wallet.service";

/**
 * Create warranty:
 * - Find/create user via wallet
 * - Validate all product & purchase fields
 * - Mint NFT on blockchain (handled in service)
 * - Store full warranty details in DB with high precision
 */
export async function createWarranty(req: Request) {
  try {
    const body = await req.json();

    // 🛡️ 1. DEFENSIVE VALIDATION
    // Ensure the core data required for a legal warranty exists
    const requiredFields = [
      "walletAddress",
      "productId",
      "productName",
      "brand",
      "serialNumber",
      "purchaseDate",
      "warrantyPeriod",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // 🛡️ 2. DATE TRANSFORMATION & EXPIRY LOGIC
    const purchaseDate = new Date(body.purchaseDate);
    let expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;

    // Fallback: If expiry is not provided, calculate based on period (e.g., "2 years")
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
      // Identifiers
      userId: user.id,
      walletAddress: body.walletAddress,
      productId: body.productId,

      // Product Information
      productName: body.productName,
      brand: body.brand,
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

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Controller Error [createWarranty]:", error);
    return Response.json(
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

    return Response.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Controller Error [getAllWarranties]:", error);
    return Response.json(
      {
        success: false,
        message: error.message || "Failed to fetch warranties",
      },
      { status: 500 },
    );
  }
}
