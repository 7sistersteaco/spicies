import { notFound } from 'next/navigation';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import ProductGallery from '@/components/product/ProductGallery';
import ProductMeta from '@/components/product/ProductMeta';
import ProductPurchase from '@/components/product/ProductPurchase';
import TeaAttributes from '@/components/product/TeaAttributes';
import Reveal from '@/components/motion/Reveal';
import { getProductBySlugSafe, getProductsSafe } from '@/lib/products/data';
import { productJsonLd } from '@/lib/seo/jsonld';

export async function generateStaticParams() {
  const allProducts = await getProductsSafe();
  return allProducts.filter((product) => product.category === 'tea').map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlugSafe(params.slug, 'tea');
  if (!product) {
    return {};
  }
  return {
    title: `${product.name} | Assam CTC Tea by 7 Sisters`,
    description: product.shortDescription,
    openGraph: {
      type: 'website',
      title: product.name,
      description: product.shortDescription,
      images: product.images.map((image) => image.url)
    }
  };
}

export default async function TeaProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlugSafe(params.slug, 'tea');
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
                <p>From Assam to your home. Daily essentials, premium quality.</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
      <Section>
        <Container>
          <TeaAttributes product={product} />
        </Container>
      </Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
    </>
  );
}
