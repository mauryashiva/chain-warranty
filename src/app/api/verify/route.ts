import { prisma } from "@/server/db/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tokenId = searchParams.get("tokenId");

  if (!tokenId) {
    return NextResponse.json({ valid: false, message: "No tokenId" });
  }

  const warranty = await prisma.warranty.findUnique({
    where: { tokenId },
  });

  if (!warranty) {
    return NextResponse.json({ valid: false, message: "Not found" });
  }

  const isExpired = new Date(warranty.expiryDate) < new Date();

  return NextResponse.json({
    valid: !isExpired,
    expired: isExpired,
    warranty,
  });
}
