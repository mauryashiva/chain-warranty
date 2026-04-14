import { prisma } from "@/server/db/prisma";

export const DashboardController = {
  async getSummaryStats() {
    const [brands, products, warranties, claims] = await Promise.all([
      // Brands count with status breakdown
      prisma.brand.groupBy({
        by: ["status"],
        _count: true,
      }),
      // Products count with status breakdown
      prisma.product.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.warranty.count(),
      prisma.claim.count({ where: { status: "PENDING" } }),
    ]);

    // Format the grouped data for the frontend
    const brandStats = {
      total: brands.reduce((acc, curr) => acc + curr._count, 0),
      active:
        brands.find((b) => b.status.toUpperCase() === "ACTIVE")?._count || 0,
    };

    const productStats = {
      total: products.reduce((acc, curr) => acc + curr._count, 0),
      active:
        products.find((p) => p.status.toUpperCase() === "ACTIVE")?._count || 0,
    };

    return {
      brands: brandStats,
      products: productStats,
      warranties,
      claims,
    };
  },
};
