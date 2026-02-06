'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import redis from './redis';

const purgeCache = async (productId = null) => {
  if (!redis) return;
  try {
    // Instead of keys('*'), we purge the main lists specifically
    // to avoid performance hits on larger data sets
    const listKeys = ['products:latest', 'products:price-asc', 'products:price-desc', 'categories'];
    await redis.del(...listKeys);
    
    // Also purge common category views (optional, or let them TTL)
    // For simplicity with 30MB limit, purging specific lists is safer
    
    if (productId) {
      await redis.del(`product:${productId}`);
    }
  } catch (err) {
    console.error('Redis purge error:', err);
  }
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
