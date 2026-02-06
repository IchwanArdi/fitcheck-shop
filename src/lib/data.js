import prisma from './prisma';
import redis from './redis';

const CACHE_TTL = {
  PRODUCT: 86400, // 24 hours
  LIST: 3600,     // 1 hour
  CATEGORIES: 86400 // 24 hours
};

const getCachedData = async (key, fetchFn, ttl) => {
  if (!redis) return await fetchFn();

  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const freshData = await fetchFn();
    if (freshData) {
      await redis.set(key, JSON.stringify(freshData), 'EX', ttl);
    }
    return freshData;
  } catch (error) {
    console.error(`Redis error for key ${key}:`, error);
    return await fetchFn();
  }
};

export const getProductById = async (id) => {
  return await getCachedData(
    `product:${id}`,
    () => prisma.product.findUnique({ where: { id } }),
    CACHE_TTL.PRODUCT
  );
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
  return await getCachedData(
    `products:${sort}`,
    () => prisma.product.findMany({ orderBy: getSortOrder(sort) }),
    CACHE_TTL.LIST
  );
};

export const getProductsByCategory = async (category, sort = 'latest') => {
  if (category === 'All') {
    return await getProducts(sort);
  }
  return await getCachedData(
    `products:cat:${category}:${sort}`,
    () => prisma.product.findMany({
      where: { category },
      orderBy: getSortOrder(sort)
    }),
    CACHE_TTL.LIST
  );
};

export const getCategories = async () => {
  return await getCachedData(
    `categories`,
    async () => {
      const products = await prisma.product.findMany({
        select: { category: true },
        distinct: ['category'],
      });
      return products.map(p => p.category);
    },
    CACHE_TTL.CATEGORIES
  );
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
  return await getCachedData(
    `products:similar:${id}`,
    () => prisma.product.findMany({
      where: { NOT: { id } },
      take: 3,
      orderBy: { createdAt: 'desc' }
    }),
    CACHE_TTL.LIST
  );
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
