import { NextResponse } from "next/server";
import { AdminController } from "@/server/admin/controller/admin.controller";
import { AuditController } from "@/server/admin/controller/audit.controller";

/**
 * 📜 GET: Fetch all administrators
 * Populates the Admin Governance table.
 */
export async function GET() {
  try {
    const admins = await AdminController.getAllAdmins();
    return NextResponse.json({ success: true, data: admins });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

/**
 * ➕ POST: Invite a new administrator
 * Whitelists a new wallet address to the protocol.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, walletAddress, role, invitedBy } = body;

    const newAdmin = await AdminController.inviteAdmin({
      name,
      email,
      walletAddress,
      role,
      invitedBy,
    });

    await AuditController.log({
      adminId: invitedBy,
      action: "USER_INVITE",
      entity: "USER",
      entityId: newAdmin.id,
      entityName: newAdmin.name,
      details: `New identity whitelisted: ${newAdmin.name} with role ${role}.`,
      newValue: newAdmin,
    });

    return NextResponse.json({ success: true, data: newAdmin });
  } catch (error: any) {
    console.error("[API Admin User POST] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}

/**
 * 📝 PATCH: Update Admin Details (The Blue Button)
 * Handles role changes, name updates, or status toggles.
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { adminId, performerId, ...updates } = body;

    if (!adminId) throw new Error("Admin ID is required for updates.");

    const updatedAdmin = await AdminController.updateAdmin(adminId, updates);

    // 🕵️ Log the change in the Audit Registry
    await AuditController.log({
      adminId: performerId || "SYSTEM",
      action: "USER_INVITE", // You can add USER_UPDATE to your AuditAction enum later
      entity: "USER",
      entityId: updatedAdmin.id,
      entityName: updatedAdmin.name,
      details: `Administrative privileges updated for ${updatedAdmin.name}.`,
      newValue: updatedAdmin,
    });

    return NextResponse.json({ success: true, data: updatedAdmin });
  } catch (error: any) {
    console.error("[API Admin User PATCH] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}

/**
 * 🚫 DELETE/REVOKE: Terminate Admin Access (The Red Button)
 * We use a dedicated revoke method to handle status change.
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");
    const performerId = searchParams.get("performerId");

    if (!adminId) throw new Error("Admin ID required for revocation.");

    const revokedAdmin = await AdminController.revokeAccess(adminId);

    await AuditController.log({
      adminId: performerId || "SYSTEM",
      action: "USER_INVITE",
      entity: "USER",
      entityId: revokedAdmin.id,
      entityName: revokedAdmin.name,
      details: `Access REVOKED for ${revokedAdmin.name}. Identity flagged as inactive.`,
      newValue: revokedAdmin,
    });

    return NextResponse.json({
      success: true,
      message: "Access revoked successfully.",
    });
  } catch (error: any) {
    console.error("[API Admin User DELETE] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 },
    );
  }
}
