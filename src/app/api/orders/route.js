import prisma from "@/lib/prisma";
import { createOrder } from "@/lib/actions";
import { NextResponse } from "next/server";

// GET /api/orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders
// Body: { customer: { name, email, phone, address, city, postalCode }, items: [{ id, name, price, quantity }], total }
export async function POST(request) {
  try {
    const body = await request.json();
    const { customer, items, total } = body;

    if (!customer || !items || !Array.isArray(items) || items.length === 0 || !total) {
      return NextResponse.json(
        { success: false, error: "Invalid payload: customer object, items array, and total are required" },
        { status: 400 }
      );
    }

    const result = await createOrder(customer, items, total);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Order creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        orderId: result.orderId,
        snapToken: result.snapToken,
        redirectUrl: result.snapToken ? `https://app.sandbox.midtrans.com/snap/v2/vtweb/${result.snapToken}` : null
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
