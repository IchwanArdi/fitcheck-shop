import { getProductsByCategory } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AnimatedPage from '@/components/AnimatedPage';
import AnimatedGridItem from '@/components/AnimatedGridItem';
import SortDropdown from '@/components/SortDropdown';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: `${title} Collection`,
    description: `Explore our premium collection of ${title} at Fitcheck Store.`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const sort = resolvedSearchParams.sort || 'latest';
  
  // Convert slug (e.g., 'shirts') to title (e.g., 'Shirts')
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  const products = await getProductsByCategory(title, sort);

  if (products.length === 0 && title !== 'All') {
    if (!['Shirts', 'Objects'].includes(title)) {
        notFound();
    }
  }

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
        <Breadcrumbs items={[{ label: title }]} />
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">{title}</h1>
            <p className="text-gray-500 text-sm">Showing {products.length} items in {title}</p>
          </div>
          <SortDropdown />
        </div>

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
        
        {products.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-gray-500">No products found in this category.</p>
            </div>
        )}
      </div>
    </AnimatedPage>
  );
}
