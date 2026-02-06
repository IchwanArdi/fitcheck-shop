export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '../lib/data';
import ProductCarousel from '@/components/ProductCarousel';
import AnimatedPage from '@/components/AnimatedPage';
import AnimatedGridItem from '@/components/AnimatedGridItem';

export default async function Home() {
  const products = await getProducts();
  const mainProducts = products.slice(0, 5);
  const heroProduct = mainProducts[0] || { id: 'empty', name: 'No Products', price: 0, images: [], description: '' };
  const gridProducts = mainProducts.slice(1);
  return (
    <AnimatedPage>
      <div className="mx-auto max-w-7xl p-4 md:p-6 pb-20 pt-8"> 
        
        {/* Vercel-style Grid with Clean Aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[450px]">
          
          {/* Large Hero Item */}
          <AnimatedGridItem className="lg:col-span-2 row-span-1 md:row-span-1">
            <div className="relative h-full w-full group block bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                <Link href={`/product/${heroProduct.id}`} className="absolute inset-0 z-10" />
                
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-8">
                   <Image 
                     src={heroProduct.images?.[0] || 'https://placehold.co/600x600/111/FFF?text=No+Image'} 
                     alt={heroProduct.name}
                     fill
                     className="object-contain p-8 group-hover:scale-105 transition-transform duration-500 ease-in-out"
                     priority
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 66vw"
                   />
                </div>
                
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex items-center gap-4 z-20">
                   <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 md:px-5 md:py-3 rounded-full text-sm md:text-base font-bold flex items-center gap-3">
                     <span>{heroProduct.name}</span>
                     <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        Rp {new Intl.NumberFormat('id-ID').format(heroProduct.price)}
                     </div>
                   </div>
                </div>
            </div>
          </AnimatedGridItem>

          {/* Other Products */}
          {gridProducts.map((product, i) => (
             <AnimatedGridItem key={product.id} delay={0.1 * (i + 1)}>
               <div className="relative h-full w-full group block bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                  <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" />
                  
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-10">
                     <Image 
                       src={product.images?.[0] || 'https://placehold.co/400x400/111/FFF?text=No+Image'} 
                       alt={product.name}
                       fill
                       className="object-contain p-10 group-hover:scale-105 transition-transform duration-500 ease-in-out opacity-90 group-hover:opacity-100"
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     />
                  </div>

                   <div className="absolute bottom-6 left-6 z-20">
                     <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2">
                       <span>{product.name}</span>
                        <div className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                          Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                       </div>
                     </div>
                   </div>
               </div>
             </AnimatedGridItem>
          ))}

        </div>

      {/* Shop All Button */}
      {products.length > 5 && (
        <div className="mt-12 flex justify-center">
          <Link 
            href="/category/all" 
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
          >
            View Full Catalog
          </Link>
        </div>
      )}

      <ProductCarousel products={products} />

      </div>
    </AnimatedPage>
  );
}
