import prisma from '@/lib/prisma';
import { updateProduct } from '@/lib/actions';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditProductPage({ params }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!product) {
    notFound();
  }

  async function handleSubmit(formData) {
    'use server';
    await updateProduct(resolvedParams.id, formData);
    redirect('/admin/products');
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <h2 className="text-3xl font-bold mb-10">Edit Product</h2>

      <form action={handleSubmit} className="space-y-8 bg-[#111] border border-white/10 p-8 md:p-12 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-gray-500 font-bold px-1 text-blue-400">Product ID (ReadOnly)</label>
             <input 
               name="id" 
               defaultValue={product.id}
               className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 focus:outline-none transition-colors text-gray-500 cursor-not-allowed"
               readOnly
             />
           </div>
           <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-gray-500 font-bold px-1">Price (IDR)</label>
             <input 
               name="price" 
               type="number" 
               defaultValue={product.price}
               placeholder="250000" 
               className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
               required 
             />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs uppercase tracking-widest text-gray-500 font-bold px-1">Product Name</label>
           <input 
             name="name" 
             defaultValue={product.name}
             placeholder="Fitcheck Circles T-Shirt" 
             className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
             required 
           />
        </div>

        <div className="space-y-2">
           <label className="text-xs uppercase tracking-widest text-gray-500 font-bold px-1">Category</label>
           <select 
             name="category" 
             defaultValue={product.category}
             className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
             required
           >
             <option value="Shirts">Shirts</option>
             <option value="Objects">Objects</option>
           </select>
        </div>

        <div className="space-y-2">
           <label className="text-xs uppercase tracking-widest text-gray-500 font-bold px-1">Image URLs (comma separated)</label>
           <input 
             name="images" 
             defaultValue={product.images.join(', ')}
             placeholder="https://image1.jpg, https://image2.jpg" 
             className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
             required 
           />
           <p className="text-[10px] text-gray-600 px-1 italic">Enter multiple URLs separated by commas.</p>
        </div>

        <div className="space-y-2">
           <label className="text-xs uppercase tracking-widest text-gray-500 font-bold px-1">Description</label>
           <textarea 
             name="description" 
             defaultValue={product.description}
             rows="4" 
             placeholder="Brief description of the product..." 
             className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors resize-none"
             required 
           ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-colors mt-4"
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
