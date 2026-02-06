const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const url = process.env.DATABASE_URL;

if (!url) {
  console.error("DATABASE_URL is not defined in .env");
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: url,
    },
  },
});

const products = [
  {
    id: 'fitcheck-shirt-001',
    name: 'Fitcheck Circles T-Shirt',
    price: 200000,
    description: 'Premium heavyweight cotton t-shirt featuring our signature Fitcheck circles design. Relaxed fit for maximum comfort.',
    images: ['https://placehold.co/600x600/1e1e2e/FFF?text=Fitcheck+Circles'],
    category: 'Shirts',
  },
  {
    id: 'fitcheck-bag-001',
    name: 'Fitcheck Drawstring Bag',
    price: 120000,
    description: 'Durable canvas drawstring bag perfect for daily essentials. Minimalist branding with reinforced stitching.',
    images: ['https://placehold.co/400x400/1e1e2e/FFF?text=Drawstring+Bag'],
    category: 'Objects',
  },
  {
    id: 'fitcheck-cup-001',
    name: 'Fitcheck Cup',
    price: 150000,
    description: 'Matte black ceramic cup. Keeps your coffee warm and your aesthetic cool.',
    images: ['https://placehold.co/400x400/1e1e2e/FFF?text=Cup'],
    category: 'Objects',
  },
  {
    id: 'fitcheck-hoodie-001',
    name: 'Fitcheck Hoodie',
    price: 350000,
    description: 'Ultra-soft fleece hoodie. The coziest thing you will own. Guaranteed.',
    images: ['https://placehold.co/400x400/1e1e2e/FFF?text=Hoodie'],
    category: 'Shirts',
  },
  {
    id: 'fitcheck-hat-001',
    name: 'Fitcheck Dad Hat',
    price: 95000,
    description: 'Classic dad hat with embroidered Fitcheck logo. Adjustable strap for perfect fit.',
    images: ['https://placehold.co/400x400/1e1e2e/FFF?text=Hat'],
    category: 'Objects',
  }
];

async function main() {
  console.log('Start seeding...');
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
    console.log(`Created/Updated product with id: ${product.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
