import prisma from './prisma';

export const getProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { id }
  });
};

const getSortOrder = (sort) => {
  switch (sort) {
    case 'price-asc': return { price: 'asc' };
    case 'price-desc': return { price: 'desc' };
    case 'latest':
    default: return { createdAt: 'desc' };
  }
};

export const getProducts = async (sort = 'latest') => {
  return await prisma.product.findMany({
    orderBy: getSortOrder(sort)
  });
};

export const getProductsByCategory = async (category, sort = 'latest') => {
  if (category === 'All') {
    return await getProducts(sort);
  }
  return await prisma.product.findMany({
    where: { category },
    orderBy: getSortOrder(sort)
  });
};

export const getCategories = async () => {
  const products = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category'],
  });
  return products.map(p => p.category);
};

export const searchProducts = async (query, sort = 'latest') => {
  if (!query) return [];
  return await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: getSortOrder(sort)
  });
};

export const getSimilarProducts = async (id) => {
  return await prisma.product.findMany({
    where: { NOT: { id } },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });
};

export async function getSearchSuggestions(query) {
  if (!query || query.length < 2) return [];

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      category: true,
    },
    take: 5,
  });

  return products;
}
