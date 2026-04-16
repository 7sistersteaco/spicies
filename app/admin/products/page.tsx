import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { getProductsSafe } from '@/lib/products/data';
import { isAdmin } from '@/app/actions/admin';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin | Products',
  description: 'Manage product images and details.'
};

export default async function AdminProductsPage() {
  const isAuthorized = await isAdmin();
  if (!isAuthorized) redirect('/admin');

  const products = await getProductsSafe();

  return (
    <Section className="pt-12">
      <Container>
        <div className="space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Admin</p>
              <h1 className="text-3xl font-semibold md:text-4xl">Product Management</h1>
              <p className="text-sm text-cream/60">Upload and manage product imagery.</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/admin" className="text-xs uppercase tracking-[0.2em] text-cream/40 hover:text-cream">Back to Dashboard</a>
              <Button variant="secondary" disabled>Add Product (Disabled)</Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="lux-surface group flex flex-col overflow-hidden transition hover:border-accent/40">
                <div className="relative aspect-square w-full bg-ink/50">
                  <Image
                    src={product.image_url || product.images[0]?.url || '/images/product-ctc.svg'}
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  />
                  {!product.image_url && (
                    <div className="absolute top-4 left-4 rounded-full bg-accent/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent backdrop-blur-sm">
                      Using Fallback SVG
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 space-y-1">
                    <h3 className="font-semibold text-lg text-cream">{product.name}</h3>
                    <p className="text-xs uppercase tracking-[0.15em] text-cream/40">{product.category}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className={`text-[10px] uppercase tracking-widest ${product.is_active ? 'text-green-400' : 'text-cream/30'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="outline" size="sm" className="h-9 border-accent/30 hover:bg-accent/10">Manage Image</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
