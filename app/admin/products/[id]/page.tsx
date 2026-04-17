import { getProductByIdSafe, getCategoriesSafe } from '@/lib/products/data';
import { isAdmin } from '@/app/actions/admin';
import { redirect, notFound } from 'next/navigation';
import AdminProductForm from '@/components/admin/AdminProductForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Admin | Product Edit',
  description: 'Manage individual product details, imagery and decommissioning.'
};

export default async function ProductEditPage({ params }: { params: { id: string } }) {
  const isAuthorized = await isAdmin();
  if (!isAuthorized) redirect('/login');

  const { id } = params;
  const [product, categories] = await Promise.all([
    getProductByIdSafe(id),
    getCategoriesSafe()
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/products" 
          className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/30 hover:text-accent transition-colors font-semibold"
        >
          <ChevronLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
          Back to Catalog
        </Link>
      </div>

      {/* The AdminProductForm handles the entire sectioned grid layout internally */}
      <AdminProductForm product={product} categories={categories} />
    </div>
  );
}
