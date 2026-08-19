import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/webhooks/midtrans
// Webhook endpoint for Midtrans payment status notifications
export async function POST(request) {
  try {
    const notification = await request.json();
    
    const { order_id, transaction_status, fraud_status } = notification;

    if (!order_id) {
      return NextResponse.json(
        { success: false, error: "Missing order_id" },
        { status: 400 }
      );
    }

    let newStatus = "pending";

    if (transaction_status === "capture") {
      if (fraud_status === "challenge") {
        newStatus = "pending";
      } else if (fraud_status === "accept") {
        newStatus = "paid";
      }
    } else if (transaction_status === "settlement") {
      newStatus = "paid";
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      newStatus = "cancelled";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    }

    // Update order in database
    await prisma.order.update({
      where: { id: order_id },
      data: { status: newStatus }
    });

    return NextResponse.json({
      success: true,
      message: `Order ${order_id} status updated to ${newStatus}`
    });
  } catch (error) {
    console.error("Error processing Midtrans webhook:", error);
    return NextResponse.json(
      { success: false, error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
