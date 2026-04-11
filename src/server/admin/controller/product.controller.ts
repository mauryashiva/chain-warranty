import { prisma } from "@/server/db/prisma";

export const ProductController = {
  /**
   * 📜 Get all products with Brand details
   */
  async getAllProducts() {
    return await prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        brand: {
          select: { name: true, slug: true },
        },
        _count: {
          select: { serials: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * 🏗️ Create a new product with all 16+ fields mapped from UI
   */
  async createProduct(data: any) {
    // 1. Basic Validation
    if (!data.name || !data.sku || !data.brandId || !data.category) {
      throw new Error(
        "Missing required fields: Name, SKU, Brand, or Category.",
      );
    }

    // 2. Check for SKU uniqueness (Case-insensitive check)
    if (data.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku.toUpperCase() },
      });
      if (existingSku) {
        throw new Error(
          `SKU ${data.sku.toUpperCase()} already exists in the catalog.`,
        );
      }
    }

    // 3. Data Transformation & Database Insertion
    return await prisma.product.create({
      data: {
        name: data.name,
        modelNumber: data.modelNumber,
        sku: data.sku.toUpperCase(), // Standardize storage
        category: data.category,
        subCategory: data.subCategory,

        // Relational Link (Company removed as per new architecture)
        brandId: data.brandId,

        description: data.description,

        // Data Type Parsing
        warrantyPeriod: data.warrantyPeriod?.toString(),
        priceMin: data.priceMin ? parseFloat(data.priceMin) : null,
        priceMax: data.priceMax ? parseFloat(data.priceMax) : null,
        currency: data.currency || "USD",

        // Date Handling
        launchDate: data.launchDate ? new Date(data.launchDate) : null,

        // Specification Metadata
        manufactureCountry: data.manufactureCountry,
        hsnCode: data.hsnCode,
        variants: data.variants,
        serialRegex: data.serialRegex,
        termsUrl: data.termsUrl,

        status: "Active",
        isDeleted: false,
      },
      include: {
        brand: true,
      },
    });
  },

  /**
   * 🗑️ Soft Delete Product
   */
  async deleteProduct(id: string) {
    return await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};
