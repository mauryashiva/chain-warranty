import { prisma } from "@/server/db/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tokenId = searchParams.get("tokenId");

    // ✅ Validate input
    if (!tokenId) {
      return NextResponse.json(
        { valid: false, message: "No tokenId provided" },
        { status: 400 },
      );
    }

    // 🔍 Fetch warranty
    const warranty = await prisma.warranty.findUnique({
      where: { tokenId },
    });

    // ❌ Not found
    if (!warranty) {
      return NextResponse.json(
        { valid: false, message: "Warranty not found" },
        { status: 404 },
      );
    }

    // ⏳ Expiry check
    const isExpired =
      warranty.expiryDate && new Date(warranty.expiryDate) < new Date();

    return NextResponse.json({
      valid: !isExpired,
      expired: isExpired,
      warranty,
    });
  } catch (error) {
    console.error("Verify Warranty Error:", error);

    return NextResponse.json(
      { valid: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
