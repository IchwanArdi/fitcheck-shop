import prisma from "@/lib/prisma";
import { getProducts, getProductsByCategory } from "@/lib/data";
import { NextResponse } from "next/server";

// GET /api/products
// Optional query params: category, sort
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "latest";

    let products;
    if (category) {
      products = await getProductsByCategory(category, sort);
    } else {
      products = await getProducts(sort);
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products
// Body: { id, name, price, description, images, category }
export async function POST(request) {
  try {
    const body = await request.json();
    const { id, name, price, description, images, category } = body;

    if (!id || !name || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, name, price, category" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        id,
        name,
        price: parseInt(price),
        description: description || "",
        images: Array.isArray(images) ? images : (images ? images.split(',').map(s => s.trim()) : []),
        category
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: product
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: "Product with this ID already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
