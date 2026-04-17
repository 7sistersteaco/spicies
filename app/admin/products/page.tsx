import { getProductsSafe } from '@/lib/products/data';
import type { Product } from '@/lib/products/types';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Package, Plus, ExternalLink } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';
import { getProductFallbackImage } from '@/lib/products/visuals';
import { isValidImageUrl } from '@/lib/utils';
import EmptyState from '@/components/admin/EmptyState';

export const metadata = {
  title: 'Admin | Products',
  description: 'Manage product images and details.'
};

function ProductCard({ product }: { product: Product }) {
  const uploadedImgs = product.product_images || [];
  const primaryUploaded =
    uploadedImgs.find((img) => img.is_primary)?.image_url ||
    uploadedImgs[0]?.image_url;
  const premiumFallback = getProductFallbackImage(product.category, product.slug);
  const hasValidImage = isValidImageUrl(primaryUploaded);
  const displayImg = hasValidImage ? (primaryUploaded as string) : premiumFallback;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:bg-white/[0.04] hover:border-accent/20">
      <div className="relative aspect-[4/3] w-full bg-ink/40 overflow-hidden">
        <SafeImage
          src={displayImg}
          fallback={premiumFallback}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
        />
        {!hasValidImage && (
          <div className="absolute top-3 left-3 rounded-md bg-accent/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent backdrop-blur-sm border border-accent/20">
            Fallback UI
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm text-cream leading-tight">{product.name}</h3>
            <span
              className={`flex-shrink-0 h-1.5 w-1.5 rounded-full mt-1.5 ${
                product.is_active
                  ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                  : 'bg-cream/20'
              }`}
            />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-cream/30 font-medium">
            {product.category}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Button
            href={`/admin/products/${product.id}`}
            variant="outline"
            className="flex-1 h-10 text-[10px] uppercase tracking-widest border-white/5 hover:bg-white/5 hover:border-accent/40 transition-all font-semibold"
          >
            Edit Assets
          </Button>
          <Link
            href={`/products/${product.category.toLowerCase()}/${product.slug}`}
            target="_blank"
            className="p-2.5 rounded-xl border border-white/5 bg-white/5 text-cream/40 hover:text-cream hover:bg-white/10 transition-all"
          >
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function AdminProductsPage() {
  const products = await getProductsSafe();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-cream">Product Management</h1>
          <p className="text-xs text-cream/50">Manage your catalog, inventory and imagery.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products/new">
            <Button variant="secondary" className="gap-2 h-10 text-[10px] uppercase tracking-widest">
              <Plus size={14} /> New Product
            </Button>
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Products Found"
          description="Your product catalog is currently empty. Add products to start selling."
          actionLabel="Create Product"
          onAction={() => {}}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
