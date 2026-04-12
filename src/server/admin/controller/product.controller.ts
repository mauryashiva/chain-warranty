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
        sku: normalizedSku,
        category: data.category,
        subCategory: data.subCategory,
        brandId: data.brandId,
        description: data.description,
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
        launchDate: data.launchDate ? new Date(data.launchDate) : null,
        manufactureCountry: data.manufactureCountry,
        hsnCode: data.hsnCode,
        variants: data.variants,
        serialRegex: data.serialRegex,
        termsUrl: data.termsUrl,
        // Force status to UPPERCASE for Enum safety
        status: data.status ? data.status.toUpperCase() : "ACTIVE",
        isDeleted: false,
      },
      include: {
        brand: true,
      },
    });
  },

  /**
   * 🔄 Update existing product specification
   */
  async updateProduct(id: string, data: any) {
    // 1. Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error("Registry Error: Product not found.");
    }

    // 2. Data Transformation (Parsing similar to Create logic)
    return await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        subCategory: data.subCategory,
        description: data.description,
        warrantyPeriod: data.warrantyPeriod?.toString(),
        priceMin:
          data.priceMin !== undefined
            ? data.priceMin && data.priceMin !== ""
              ? parseFloat(data.priceMin)
              : null
            : undefined,
        priceMax:
          data.priceMax !== undefined
            ? data.priceMax && data.priceMax !== ""
              ? parseFloat(data.priceMax)
              : null
            : undefined,
        currency: data.currency,
        launchDate: data.launchDate ? new Date(data.launchDate) : null,
        manufactureCountry: data.manufactureCountry,
        hsnCode: data.hsnCode,
        variants: data.variants,
        serialRegex: data.serialRegex,
        termsUrl: data.termsUrl,
        // Ensure status matches Enum (ACTIVE, INACTIVE, DISCONTINUED)
        status: data.status ? data.status.toUpperCase() : undefined,
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
