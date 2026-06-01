'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const purgeCache = async (productId = null) => {
  // No-op: Redis caching has been completely removed
};

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

  await purgeCache();
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function deleteProduct(id) {
  await prisma.product.delete({
    where: { id }
  });

  await purgeCache(id);
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

  await purgeCache(id);
  revalidatePath('/admin/products');
  revalidatePath(`/product/${id}`);
}

export async function createOrder(customerData, items, total) {
  try {
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

    revalidatePath('/admin/orders');
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Order creation error:', error);
    return { success: false, error: 'Database failed' };
  }
}
