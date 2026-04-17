import { getCategoriesSafe } from '@/lib/products/data';
import { isAdmin } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import AdminProductForm from '@/components/admin/AdminProductForm';
import Link from 'next/link';
import { ChevronLeft, Info, Package } from 'lucide-react';

export const metadata = {
  title: 'Admin | New Product',
  description: 'Create a new product for the 7 Sisters Tea catalog.'
};

export default async function NewProductPage() {
  const isAuthorized = await isAdmin();
  if (!isAuthorized) redirect('/login');

  const categories = await getCategoriesSafe();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link 
            href="/admin/products" 
            className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-cream/30 hover:text-accent transition-colors mb-2 font-semibold"
          >
            <ChevronLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-cream">Create New Product</h1>
          <p className="text-[10px] text-cream/30 uppercase tracking-widest">Add a primary entry to your global catalog.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Main Content: Form */}
        <div className="lg:col-span-8 space-y-8">
           <AdminProductForm categories={categories} />
        </div>

        {/* Sidebar: Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="lux-surface p-6 space-y-6 bg-accent/[0.02] border-accent/10">
             <div className="flex items-center gap-3 text-accent">
              <Info size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest leading-none">Onboarding Tips</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-cream underline decoration-accent/30 underline-offset-4">Initial Setup</p>
                <p className="text-[11px] leading-relaxed text-cream/40 leading-relaxed italic">
                  “After publishing the basic details, you can visit the product edit page to upload high-quality WebP hero imagery.”
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-cream underline decoration-accent/30 underline-offset-4">Slugs & SEO</p>
                <p className="text-[11px] leading-relaxed text-cream/40 leading-relaxed">
                  The system automatically generates a unique, SEO-friendly URL slug based on your product title.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 p-6 bg-white/[0.02]">
            <div className="flex items-center gap-3 text-cream/30 mb-4">
              <Package size={16} />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Standardization</p>
            </div>
            <p className="text-[11px] leading-relaxed text-cream/20 italic">
              “Ensure use of professional nomenclature. Avoid casual descriptions or internal testing notes in public-facing fields.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
