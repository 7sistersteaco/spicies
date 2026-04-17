import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import ProductGrid from '@/components/product/ProductGrid';
import Reveal from '@/components/motion/Reveal';
import { getProductsByCategorySafe } from '@/lib/products/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Premium Assam Tea & Spices | Shop the Collection',
  description: 'Brown gold from the banks of Brahmaputra. Authentic Assam CTC tea and restaurant-grade spices, packed fresh at 7 Sisters Restro.',
  alternates: {
    canonical: '/products'
  }
};

export default async function ProductsPage() {
  const tea = await getProductsByCategorySafe('tea');
  const spices = await getProductsByCategorySafe('spices');

  return (
    <>
      <Section className="pt-12">
        <Container>
          <Reveal>
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Shop</p>
              <h1 className="text-4xl font-semibold md:text-5xl">Authentic Assam Tea &amp; Spices</h1>
              <p className="text-lg text-cream/70">
                Crafted &amp; served at 7 Sisters Restro - now packed for your daily kitchen rituals.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
      <Section>
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold">Tea</h2>
          </Reveal>
          <div className="mt-8">
            <ProductGrid products={tea} />
          </div>
        </Container>
      </Section>
      <Section>
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold">Spices</h2>
          </Reveal>
          <div className="mt-8">
            <ProductGrid products={spices} />
          </div>
        </Container>
      </Section>
    </>
  );
}
