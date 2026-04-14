import { NextResponse } from "next/server";
import { AdminController } from "@/server/admin/controller/admin.controller";
import { prisma } from "@/server/db/prisma";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json(
        { message: "Wallet address is required" },
        { status: 400 },
      );
    }

    // 1. Verify access via your AdminController logic
    const admin = await AdminController.verifyAdminAccess(walletAddress);

    // 2. Update session metadata (Login Count & Last Login)
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLogin: new Date(),
        loginCount: { increment: 1 },
      },
    });

    // Return the admin profile + permissions
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        role: admin.role,
        permissions: AdminController.getPermissionsForRole(admin.role),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 403 }, // Forbidden
    );
  }
}
