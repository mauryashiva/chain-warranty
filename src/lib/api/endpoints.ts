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
    // 📊 System Overview
    dashboard: {
      stats: "/dashboard/stats", // ✅ Added to solve Property 'dashboard' error
    },

    brands: "/brands",
    products: "/products",
    serials: "/serials",
    retailers: "/retailers",
    warrantyRules: "/warranty-rules",
    audit: "/audit",
    claims: "/claims",
    users: "/users",
  },
};
