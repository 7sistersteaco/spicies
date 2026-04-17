import { notFound } from 'next/navigation';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import ProductGallery from '@/components/product/ProductGallery';
import ProductMeta from '@/components/product/ProductMeta';
import ProductPurchase from '@/components/product/ProductPurchase';
import SpiceAttributes from '@/components/product/SpiceAttributes';
import Reveal from '@/components/motion/Reveal';
import { getProductBySlugSafe, getProductsSafe } from '@/lib/products/data';
import { productJsonLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const allProducts = await getProductsSafe();
  return allProducts
    .filter((product) => product.category === 'spices')
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlugSafe(params.slug, 'spices');
  if (!product) {
    return {};
  }
  return {
    title: `${product.name} | Fresh Indian Spices by 7 Sisters`,
    description: product.shortDescription,
    openGraph: {
      type: 'website',
      title: product.name,
      description: product.shortDescription,
      images: product.product_images?.map((image) => image.image_url) || []
    }
  };
}

export default async function SpiceProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlugSafe(params.slug, 'spices');
  if (!product) {
    notFound();
  }

  return (
    <>
      <Section className="pt-12">
        <Container className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-start">
          <Reveal>
            <ProductGallery product={product} />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-8">
              <ProductMeta product={product} />
              <ProductPurchase product={product} />
              <div className="text-sm text-cream/60">
                <p>Traditional recipes, intense aroma, daily-use freshness.</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
      <Section>
        <Container>
          <SpiceAttributes product={product} />
        </Container>
      </Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
    </>
  );
}
