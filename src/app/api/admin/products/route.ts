import { NextRequest, NextResponse } from "next/server";
import { ProductController } from "@/server/admin/controller/product.controller";

/**
 * 📥 GET: Fetch all products for the Admin Catalog
 */
export async function GET() {
  try {
    const products = await ProductController.getAllProducts();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error("[API_PRODUCTS_GET]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while fetching catalog",
      },
      { status: 500 },
    );
  }
}

/**
 * 📤 POST: Register a new Product Model
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Mandatory Field Validation
    const requiredFields = [
      "name",
      "brandId",
      "sku",
      "category",
      "modelNumber",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required technical fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // 2. Execute Controller Logic
    const newProduct = await ProductController.createProduct(body);

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: "Product successfully registered in the global catalog.",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("[API_PRODUCTS_POST]:", error);
    const statusCode = error.message.includes("exists") ? 409 : 500;
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to initialize product registration.",
      },
      { status: statusCode },
    );
  }
}

/**
 * 🔄 PATCH: Update an existing Product specification
 */
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Asset ID is required for update." },
        { status: 400 },
      );
    }

    const updatedProduct = await ProductController.updateProduct(id, body);

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: "Product specifications updated successfully.",
    });
  } catch (error: any) {
    console.error("[API_PRODUCTS_PATCH]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to synchronize asset updates.",
      },
      { status: 500 },
    );
  }
}

/**
 * 🗑️ DELETE: Soft delete a product
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Asset ID is required for termination." },
        { status: 400 },
      );
    }

    await ProductController.deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: "Product status updated to DELETED.",
    });
  } catch (error: any) {
    console.error("[API_PRODUCTS_DELETE]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Could not remove asset from active catalog.",
      },
      { status: 500 },
    );
  }
}
