import { getProducts, getCategories } from '@/lib/data';

export default async function sitemap() {
  const baseUrl = 'https://fitcheck-store.vercel.app'; // Replace with real production URL if known

  // Fetch all products and categories
  const products = await getProducts();
  const categories = await getCategories();

  // Create product entries
  const productEntries = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.createdAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Create category entries
  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  return [...staticPages, ...productEntries, ...categoryEntries];
}
