import Link from 'next/link';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

export default function AnnouncementBar() {
  return (
    <Section className="pt-0">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-accent/25 bg-charcoal/60 p-6 shadow-soft md:flex-row md:items-center lg:px-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Pre-orders Live</p>
              <p className="text-lg font-semibold text-cream">
                Now accepting pre-orders for tea and spices.
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs uppercase tracking-[0.3em] text-accent hover:text-cream"
            >
              Pre-order Now
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
