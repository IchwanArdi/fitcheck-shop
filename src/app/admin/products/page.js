import prisma from '@/lib/prisma';
import { Plus, Trash2, Edit, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { deleteProduct } from '@/lib/actions';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your storefront inventory.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-white text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-black border border-white/10 flex-shrink-0 flex items-center justify-center p-2 overflow-hidden relative">
                         <Image 
                           src={product.images?.[0] || 'https://placehold.co/100x100?text=No+Image'} 
                           alt={product.name} 
                           fill
                           className="object-contain p-2" 
                           sizes="48px"
                         />
                      </div>
                      <span className="font-bold text-gray-200">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-400">
                    Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                  </td>
                  <td className="px-6 py-5 font-mono text-xs text-gray-600">
                    {product.id}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/product/${product.id}`} 
                        target="_blank"
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        title="View Public"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/products/edit/${product.id}`}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={async () => {
                        'use server';
                        await deleteProduct(product.id);
                      }}>
                        <button 
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
