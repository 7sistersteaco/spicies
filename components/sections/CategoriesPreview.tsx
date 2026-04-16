import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';
import { getCategoriesSafe } from '@/lib/products/data';

export default async function CategoriesPreview() {
  const categories = await getCategoriesSafe();
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Shop by Category</p>
              <h2 className="text-3xl font-semibold md:text-4xl">Tea &amp; Spices</h2>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={0.08 * index}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden lux-surface p-6 md:p-8 block w-full max-w-full"
              >
                <div className="flex flex-col space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-cream/30 font-bold">{category.name}</p>
                    <h3 className="text-xl md:text-2xl font-semibold leading-snug text-cream group-hover:text-accent transition-colors">
                      {category.description}
                    </h3>
                  </div>
                  <div className="relative mt-2 h-36 md:h-48 w-full flex items-center justify-center bg-black/5 rounded-2xl overflow-hidden">
                    <div className="relative h-28 w-4/5 md:h-full md:w-full">
                      <Image 
                        src={category.image.url} 
                        alt={category.image.alt} 
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                  </div>
                </div>
                <span className="absolute bottom-5 right-5 md:bottom-7 md:right-8 text-[9px] uppercase tracking-[0.4em] text-accent font-bold">
                  Explore
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
