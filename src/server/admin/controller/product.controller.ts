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

    // 2. Check for SKU uniqueness
    if (data.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku },
      });
      if (existingSku) {
        throw new Error(`SKU ${data.sku} already exists in the catalog.`);
      }
    }

    // 3. Data Transformation & Database Insertion
    return await prisma.product.create({
      data: {
        name: data.name,
        modelNumber: data.modelNumber,
        sku: data.sku.toUpperCase(), // Ensure SKU is always uppercase in DB
        category: data.category,
        subCategory: data.subCategory,

        companyId: data.companyId || "default-company-id", // Fallback for multi-tenant
        brandId: data.brandId,
        description: data.description,

        // Number and string parsing from UI
        warrantyPeriod: data.warrantyPeriod?.toString(),
        priceMin: data.priceMin ? parseFloat(data.priceMin) : null,
        priceMax: data.priceMax ? parseFloat(data.priceMax) : null,

        // 🔥 THIS IS THE CRUCIAL LINE WE ADDED FOR YOUR UI:
        currency: data.currency || "USD",

        // Dates
        launchDate: data.launchDate ? new Date(data.launchDate) : null,

        // Metadata
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
