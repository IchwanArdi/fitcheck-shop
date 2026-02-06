import { searchProducts } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import AnimatedGridItem from '@/components/AnimatedGridItem';
import SortDropdown from '@/components/SortDropdown';

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const sort = resolvedParams.sort || 'latest';
  const products = await searchProducts(query, sort);

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <Search className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest font-bold">Search Results</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              {query ? `Results for "${query}"` : 'All Products'}
            </h1>
            <p className="text-gray-500 mt-4">We found {products.length} items matching your search.</p>
          </div>
          {products.length > 0 && <SortDropdown />}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <AnimatedGridItem key={product.id} delay={i * 0.05}>
                <Link 
                  href={`/product/${product.id}`} 
                  className="group block bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-square flex items-center justify-center p-8 bg-white/5 relative">
                    <Image 
                      src={product.images?.[0] || 'https://placehold.co/400x400/111/FFF?text=No+Image'} 
                      alt={product.name} 
                      fill
                      className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 border-t border-white/5">
                    <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors truncate">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                       <span className="text-sm text-blue-400 font-medium">Rp {new Intl.NumberFormat('id-ID').format(product.price)}</span>
                       <span className="text-[10px] uppercase tracking-widest text-gray-600">{product.category}</span>
                    </div>
                  </div>
                </Link>
              </AnimatedGridItem>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-[#0a0a0a] rounded-3xl border border-dashed border-white/10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold mb-2">No products found</h2>
              <p className="text-gray-500 max-w-xs mx-auto">We couldn't find anything matching your search. Try different keywords or browse our categories.</p>
              <Link href="/" className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                  Back to Home
              </Link>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
