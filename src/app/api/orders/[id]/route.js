import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { snap } from "@/lib/midtrans";

// GET /api/orders/[id]
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    let order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Jika status di database masih 'pending', sinkronisasi langsung ke server Midtrans!
    if (order.status === 'pending') {
      try {
        const midtransRes = await snap.transaction.status(id);
        const tStatus = midtransRes.transaction_status;
        const fStatus = midtransRes.fraud_status;

        let newStatus = 'pending';
        if (tStatus === 'settlement' || (tStatus === 'capture' && fStatus === 'accept')) {
          newStatus = 'paid';
        } else if (tStatus === 'cancel' || tStatus === 'deny' || tStatus === 'expire') {
          newStatus = 'cancelled';
        }

        if (newStatus !== 'pending') {
          order = await prisma.order.update({
            where: { id },
            data: { status: newStatus },
            include: { items: true }
          });
        }
      } catch (midtransErr) {
        // Abaikan jika transaksi belum tercatat di Midtrans
      }
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id]
// Body: { status?: string, courier?: string, trackingNumber?: string }
export async function PATCH(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { status, courier, trackingNumber } = body;

    const validStatuses = ["pending", "paid", "processing", "shipped", "completed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Merge courier and trackingNumber into customer JSON
    const currentCustomer = (typeof existingOrder.customer === 'object' && existingOrder.customer !== null)
      ? existingOrder.customer
      : {};

    const updatedCustomer = {
      ...currentCustomer,
      ...(courier !== undefined && { courier }),
      ...(trackingNumber !== undefined && { trackingNumber })
    };

    const updateData = {
      customer: updatedCustomer
    };

    if (status) {
      updateData.status = status;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true }
    });

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
