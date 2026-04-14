import { prisma } from "@/server/db/prisma";
import { AdminRole, AdminStatus } from "@prisma/client";

export const AdminController = {
  /**
   * 🛡️ VERIFY ADMIN ACCESS
   */
  async verifyAdminAccess(walletAddress: string) {
    try {
      const admin = await prisma.admin.findUnique({
        where: {
          walletAddress: walletAddress.toLowerCase(),
          isDeleted: false,
        },
      });

      if (!admin) {
        throw new Error(
          "Access Denied: Wallet not registered in Admin Registry.",
        );
      }

      if (admin.status === "REVOKED" || admin.status === "INACTIVE") {
        throw new Error(
          "Access Revoked: This administrator account is no longer active.",
        );
      }

      return admin;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  /**
   * ➕ INVITE / CREATE NEW ADMIN
   */
  async inviteAdmin({
    name,
    email,
    walletAddress,
    role,
    invitedBy,
  }: {
    name: string;
    email: string;
    walletAddress: string;
    role: AdminRole;
    invitedBy: string;
  }) {
    const existing = await prisma.admin.findFirst({
      where: {
        OR: [
          { walletAddress: walletAddress.toLowerCase() },
          { email: email.toLowerCase() },
        ],
      },
    });

    if (existing)
      throw new Error(
        "Administrator with this wallet or email already exists.",
      );

    const permissions = this.getPermissionsForRole(role);

    return await prisma.admin.create({
      data: {
        name,
        email: email.toLowerCase(),
        walletAddress: walletAddress.toLowerCase(),
        role,
        createdBy: invitedBy,
        ...permissions,
      },
    });
  },

  /**
   * 📝 UPDATE ADMIN (For Edit Button)
   * This updates the profile and re-syncs permissions if the role changes.
   */
  async updateAdmin(
    adminId: string,
    data: Partial<{
      name: string;
      email: string;
      role: AdminRole;
      status: AdminStatus;
    }>,
  ) {
    try {
      // 1. If role is being changed, calculate new permission set
      let permissionUpdates = {};
      if (data.role) {
        permissionUpdates = this.getPermissionsForRole(data.role);
      }

      return await prisma.admin.update({
        where: { id: adminId },
        data: {
          ...data,
          ...(data.email && { email: data.email.toLowerCase() }),
          ...permissionUpdates,
        },
      });
    } catch (error: any) {
      throw new Error("Failed to update administrator profile.");
    }
  },

  /**
   * 🚫 REVOKE ACCESS (For Red Button)
   */
  async revokeAccess(adminId: string) {
    return await prisma.admin.update({
      where: { id: adminId },
      data: {
        status: "REVOKED",
      },
    });
  },

  /**
   * ⚙️ ROLE PERMISSION MAPPING
   */
  getPermissionsForRole(role: AdminRole) {
    const defaultPerms = {
      canManageBrands: false,
      canManageProducts: false,
      canUploadSerials: false,
      canManageRetailers: false,
      canReviewClaims: false,
      canResolveOnChain: false,
      canManageAdmins: false,
      canViewAuditLog: true,
    };

    switch (role) {
      case "SUPER_ADMIN":
        return {
          canManageBrands: true,
          canManageProducts: true,
          canUploadSerials: true,
          canManageRetailers: true,
          canReviewClaims: true,
          canResolveOnChain: true,
          canManageAdmins: true,
          canViewAuditLog: true,
        };
      case "BRAND_MANAGER":
        return {
          ...defaultPerms,
          canManageBrands: true,
          canManageProducts: true,
          canUploadSerials: true,
        };
      case "CLAIMS_AGENT":
        return {
          ...defaultPerms,
          canReviewClaims: true,
          canResolveOnChain: true,
        };
      case "RETAILER_MANAGER":
        return { ...defaultPerms, canManageRetailers: true };
      default:
        return defaultPerms;
    }
  },

  /**
   * 📜 FETCH ADMIN LIST
   */
  async getAllAdmins() {
    return await prisma.admin.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
  },
};
