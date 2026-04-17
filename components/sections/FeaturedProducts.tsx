import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';
import ProductCard from '@/components/product/ProductCard';
import { getFeaturedProductsSafe } from '@/lib/products/data';

export default async function FeaturedProducts() {
  const featured = (await getFeaturedProductsSafe()).slice(0, 2);
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Featured</p>
              <h2 className="text-3xl font-heading font-semibold md:text-4xl">Kitchen Classics, Assam-First</h2>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-cream/60">Crafted &amp; served at 7 Sisters Restro</p>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={0.1 * index}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
