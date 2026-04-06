import { prisma } from "@/server/db/prisma";

export const adminProductController = {
  // 🔥 Fetch all products with their parent Brand data
  async getAllProducts() {
    return await prisma.product.findMany({
      include: {
        brand: true,
        _count: { select: { warranties: true } }, // Count how many NFTs minted for this product
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // 🔥 Create a new Product SKU in the catalog
  async createProduct(req: Request) {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        brandId: body.brandId, // Linked to the Brand table
        sku: body.sku, // e.g. "SONY-WH1XM5"
        priceMin: parseFloat(body.priceMin),
        priceMax: parseFloat(body.priceMax),
      },
    });

    return product;
  },
};
