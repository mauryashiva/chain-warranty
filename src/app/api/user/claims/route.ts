import { prisma } from "@/server/db/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { warrantyId, userId: walletAddress, type, reason, status } = body;

    // ✅ Validate required fields
    if (!warrantyId || !walletAddress || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // 🔥 Normalize wallet (IMPORTANT)
    const normalizedWallet = walletAddress.toLowerCase();

    // 🔍 Find user by wallet
    const wallet = await prisma.wallet.findUnique({
      where: { address: normalizedWallet },
      include: { user: true },
    });

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const userId = wallet.user.id;

    // 🔍 Fetch warranty to get productId
    const warranty = await prisma.warranty.findUnique({
      where: { id: warrantyId },
      select: { productId: true },
    });

    if (!warranty) {
      return NextResponse.json(
        {
          success: false,
          message: "Warranty not found",
        },
        { status: 404 },
      );
    }

    // 🧾 Create claim
    const claim = await prisma.claim.create({
      data: {
        claimNumber: `CLM-${Date.now()}`,
        warrantyId,
        productId: warranty.productId,
        userId,
        type,
        subject: reason || "",
        description: reason || "",
        status: status || "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      data: claim,
    });
  } catch (error) {
    console.error("Create Claim Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
