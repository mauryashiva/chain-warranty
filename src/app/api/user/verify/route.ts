import { prisma } from "@/server/db/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tokenId = searchParams.get("tokenId");
    const serialQuery = searchParams.get("serial");

    if (serialQuery) {
      const serialNumber = serialQuery.trim().toUpperCase();
      const serial = await prisma.serial.findUnique({
        where: { serialNumber },
        include: {
          product: {
            include: { brand: true },
          },
        },
      });

      if (!serial) {
        return NextResponse.json(
          { success: false, message: "Serial not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          id: serial.product.id,
          brandId: serial.product.brandId,
          brand: serial.product.brand.name,
          productName: serial.product.name,
          modelNumber: serial.product.modelNumber,
          identificationType: serial.product.identificationType,
          serialNumber: serial.serialNumber,
          imei: serial.imei,
        },
      });
    }

    if (!tokenId) {
      return NextResponse.json(
        { valid: false, message: "No tokenId provided" },
        { status: 400 },
      );
    }

    const warranty = await prisma.warranty.findUnique({
      where: { tokenId },
    });

    if (!warranty) {
      return NextResponse.json(
        { valid: false, message: "Warranty not found" },
        { status: 404 },
      );
    }

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
