/**
 * 🛠️ Global API Endpoint Registry
 * Separated by User and Admin ecosystems to match the backend controller structure.
 */
export const endpoints = {
  // 👤 User-Facing Endpoints (/api/user/...)
  user: {
    warranty: "/warranty",
    claims: "/claims",
    verify: "/verify",
    transfer: "/warranty/transfer",
    auth: {
      nonce: "/auth/nonce",
      verify: "/auth/verify",
      wallet: "/auth/wallet",
    },
  },

  // 👑 Admin-Facing Endpoints (/api/admin/...)
  admin: {
    brands: "/brands", // ✅ Added for Brand Management
    products: "/products", // ✅ Added for Product Catalog
    serials: "/serials", // ✅ Added for Serial Number Validation
    retailers: "/retailers", // ✅ Added for Retailer Management
    audit: "/audit", // ✅ Added for System Audit Logs
    claims: "/claims", // ✅ Added for Admin Claim Review
    users: "/users", // ✅ Added for Admin Role Management
  },
};
