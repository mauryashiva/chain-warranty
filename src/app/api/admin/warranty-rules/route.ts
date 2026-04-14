import { NextResponse } from "next/server";
import { WarrantyRuleController } from "@/server/admin/controller/warranty-rule.controller";

/**
 * 🛰️ GET: Sync Policy Engine
 * Fetches the Global Baseline and all Product Overrides
 */
export async function GET() {
  try {
    const [globalConfig, products] = await Promise.all([
      WarrantyRuleController.getGlobalConfig(),
      WarrantyRuleController.getProductOverrides(),
    ]);

    return NextResponse.json({
      success: true,
      globalConfig,
      products,
    });
  } catch (error: any) {
    console.error("[API] Policy Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to sync policies" },
      { status: 500 },
    );
  }
}

/**
 * 🛠️ PATCH: Commit Policy Changes
 * Handles both Global Protocol updates and SKU-specific Overrides
 */
export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const body = await req.json();

    if (productId) {
      // 🏗️ Case 1: Update Specific Product Rule
      const updatedRule = await WarrantyRuleController.upsertProductRule(
        productId,
        body,
      );

      return NextResponse.json({
        success: true,
        message: "SKU policy synchronized successfully",
        data: updatedRule,
      });
    } else {
      // 🌏 Case 2: Update Global System Protocols
      // We import Prisma directly here for the Global update as it's a simple flat update
      const { prisma } = await import("@/server/db/prisma");

      const updatedGlobal = await prisma.globalConfig.update({
        where: { id: "system_default" },
        data: body,
      });

      return NextResponse.json({
        success: true,
        message: "Global protocols updated",
        data: updatedGlobal,
      });
    }
  } catch (error: any) {
    console.error("[API] Policy Update Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to commit changes" },
      { status: 500 },
    );
  }
}
