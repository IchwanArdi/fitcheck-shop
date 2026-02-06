import { getProductById, getSimilarProducts } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import AddToCart from '@/components/AddToCart';
import ProductGallery from '@/components/ProductGallery';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Fitcheck Store`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
    },
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const similarProducts = await getSimilarProducts(resolvedParams.id);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
      
      <Breadcrumbs items={[
        { label: product.category, href: `/category/${product.category.toLowerCase()}` },
        { label: product.name }
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        
        {/* Product Image Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
          <div className="text-2xl font-medium text-blue-400 mb-8">
             Rp {new Intl.NumberFormat('id-ID').format(product.price)}
          </div>

          <p className="text-gray-400 leading-relaxed mb-8 text-lg">
            {product.description}
          </p>

          <AddToCart product={product} />
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-24">
        <h2 className="text-2xl font-bold mb-8">You might also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProducts.map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className="group block">
                 <div className="bg-[#111] border border-white/5 rounded-xl aspect-square flex items-center justify-center p-6 mb-4 group-hover:border-white/20 transition-colors overflow-hidden relative">
                    <Image 
                      src={item.images?.[0] || 'https://placehold.co/400x400/111/FFF?text=No+Image'} 
                      alt={item.name} 
                      fill
                      className="object-contain p-6 group-hover:scale-110 transition-transform" 
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                 </div>
                <h3 className="font-bold mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</p>
             </Link>
           ))}
        </div>
      </div>

    </div>
  );
}
