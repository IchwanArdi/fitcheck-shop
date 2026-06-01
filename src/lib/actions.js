'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import midtransClient from 'midtrans-client';

// Setup Midtrans Client
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export async function createProduct(formData) {
  const id = formData.get('id');
  const name = formData.get('name');
  const price = parseInt(formData.get('price'));
  const category = formData.get('category');
  const description = formData.get('description');
  const images = formData.get('images').split(',').map(img => img.trim()).filter(img => img !== '');

  await prisma.product.create({
    data: { id, name, price, category, description, images }
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function deleteProduct(id) {
  await prisma.product.delete({
    where: { id }
  });
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function updateProduct(id, formData) {
  const name = formData.get('name');
  const price = parseInt(formData.get('price'));
  const category = formData.get('category');
  const description = formData.get('description');
  const images = formData.get('images').split(',').map(img => img.trim()).filter(img => img !== '');

  await prisma.product.update({
    where: { id },
    data: { name, price, category, description, images }
  });

  revalidatePath('/admin/products');
  revalidatePath(`/product/${id}`);
}

export async function createOrder(customerData, items, total) {
  try {
    // 1. Simpan ke Database (Order & Order Items)
    const order = await prisma.order.create({
      data: {
        total,
        customer: customerData,
        items: {
          create: items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        }
      }
    });

    // Hitung subtotal untuk mengecek apakah ada biaya tambahan (misal: ongkir)
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingCost = total - subtotal;

    let itemDetails = items.map(item => ({
      "id": item.id,
      "name": item.name.substring(0, 50), // Midtrans membatasi nama item maksimal 50 karakter
      "price": item.price,
      "quantity": item.quantity
    }));

    if (shippingCost > 0) {
      itemDetails.push({
        "id": "shipping-fee",
        "name": "Biaya Pengiriman",
        "price": shippingCost,
        "quantity": 1
      });
    }

    // 2.Siapkan Parameter Transaksi untuk Midtrans
    let parameter = {
      "transaction_details": {
        "order_id": order.id,
        "gross_amount": total // Total harga (wajib number)
      },
      "customer_details": {
        "first_name": customerData.name || "Customer",
        "email": customerData.email || "test@example.com",
        "phone": customerData.phone || "08123456789"
      },
      "item_details": itemDetails
    };

    // 3. Minta Token Pembayaran ke Midtrans (Snap API)
    const response = await snap.createTransaction(parameter);
    const snapToken = response.token;

    revalidatePath('/admin/orders');

    // 4. Kembalikan URL Pembayaran
    return { success: true, orderId: order.id, snapToken };
  } catch (error) {
    console.error('Order creation error:', error);
    return { success: false, error: 'Database failed' };
  }
}
