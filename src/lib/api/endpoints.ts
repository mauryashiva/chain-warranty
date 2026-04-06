export const endpoints = {
  user: {
    warranty: "/warranty",
    claims: "/claims",
    verify: "/verify",
    transfer: "/warranty/transfer",
  },

  admin: {
    audit: "/audit", // ✅ Added Admin Endpoint
    // You can add others here later like: brands: "/brands", users: "/users"
  },
};
