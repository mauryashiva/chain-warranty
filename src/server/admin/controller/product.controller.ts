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
    const normalizedSku = data.sku.trim().toUpperCase();

    const existingSku = await prisma.product.findUnique({
      where: { sku: normalizedSku },
    });

    if (existingSku) {
      throw new Error(`SKU ${normalizedSku} already exists in the catalog.`);
    }

    // 3. Data Transformation & Database Insertion
    return await prisma.product.create({
      data: {
        name: data.name,
        modelNumber: data.modelNumber,
        sku: normalizedSku, // Standardize storage
        category: data.category,
        subCategory: data.subCategory,

        // Relational Link
        brandId: data.brandId,

        description: data.description,

        // Data Type Parsing with safety checks
        warrantyPeriod: data.warrantyPeriod?.toString(),
        priceMin:
          data.priceMin && data.priceMin !== ""
            ? parseFloat(data.priceMin)
            : null,
        priceMax:
          data.priceMax && data.priceMax !== ""
            ? parseFloat(data.priceMax)
            : null,
        currency: data.currency || "USD",

        // Date Handling
        launchDate: data.launchDate ? new Date(data.launchDate) : null,

        // Specification Metadata
        manufactureCountry: data.manufactureCountry,
        hsnCode: data.hsnCode,
        variants: data.variants,
        serialRegex: data.serialRegex,
        termsUrl: data.termsUrl,

        // ✅ FIXED: Force status to UPPERCASE to match Prisma Enum (ACTIVE, INACTIVE, etc.)
        // If data.status is "Active" or "active", it becomes "ACTIVE"
        status: data.status ? data.status.toUpperCase() : "ACTIVE",

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
