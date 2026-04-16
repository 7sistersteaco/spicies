import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { getProductByIdSafe } from '@/lib/products/data';
import { isAdmin } from '@/app/actions/admin';
import { redirect, notFound } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';

export const metadata = {
  title: 'Admin | Product Edit',
  description: 'Manage individual product imagery.'
};

export default async function ProductEditPage({ params }: { params: { id: string } }) {
  const isAuthorized = await isAdmin();
  if (!isAuthorized) redirect('/admin');

  const { id } = params;
  const product = await getProductByIdSafe(id);

  if (!product) notFound();

  return (
    <Section className="pt-12">
      <Container>
        <div className="space-y-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Manage Product</p>
              <h1 className="text-3xl font-semibold md:text-4xl">{product.name}</h1>
              <p className="text-sm text-cream/60">ID: {product.id}</p>
            </div>
            <a href="/admin/products" className="text-xs uppercase tracking-[0.2em] text-cream/40 hover:text-cream">Back to List</a>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-cream border-b border-white/10 pb-4">Image Management</h2>
                <ImageUpload 
                  productId={product.id} 
                  currentImageUrl={product.image_url ?? null} 
                  fallbackUrl={product.images[0]?.url || '/images/product-ctc.svg'} 
                />
              </div>

              <div className="space-y-4 opacity-50">
                <h2 className="text-xl font-medium text-cream border-b border-white/10 pb-4">Product Details (ReadOnly)</h2>
                <div className="lux-surface p-6 space-y-4 text-sm text-cream/70">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-cream/40 mb-1">Category</p>
                      <p>{product.category}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-cream/40 mb-1">Slug</p>
                      <p>{product.slug}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-cream/40 mb-1">Short Description</p>
                    <p>{product.shortDescription}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="lux-surface p-6 space-y-4">
                <h3 className="text-sm font-semibold text-cream uppercase tracking-widest">Guide</h3>
                <div className="space-y-3 text-xs text-cream/60 leading-relaxed">
                  <p>1. <strong>Original SVG</strong> is kept as a permanent fallback.</p>
                  <p>2. <strong>Uploaded Image</strong> will replace the SVG across the entire site (Storefront, Cart, Dashboard).</p>
                  <p>3. <strong>Removing</strong> the uploaded image instantly restores the original SVG.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
