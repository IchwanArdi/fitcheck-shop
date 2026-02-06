'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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
