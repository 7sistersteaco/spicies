import Image from 'next/image';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

export default function BrandStory() {
  return (
    <Section className="bg-charcoal/60">
      <Container className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <Reveal>
          <div className="relative h-[320px] w-full overflow-hidden rounded-3xl border border-white/5 bg-ink shadow-soft">
            <Image
              src="/images/restro-story.svg"
              alt="7 Sisters Restro heritage"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-contain"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-cream/50">From Restro to Home</p>
            <h2 className="text-3xl font-semibold md:text-4xl">What we serve daily, we now bring to you.</h2>
            <p className="text-lg text-cream/70">
              Born in Barpeta Road, Assam, 7 Sisters Tea Co. brings restaurant-tested tea and spices to your kitchen - honest Assam flavors made for real homes.
            </p>
            <p className="text-sm text-cream/50">Crafted &amp; served at 7 Sisters Restro</p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
