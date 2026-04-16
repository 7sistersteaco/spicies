import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';
import Image from 'next/image';

export const metadata = {
  title: 'About 7 Sisters Tea Co.',
  description: 'Assam roots, restaurant heritage, and premium daily essentials.'
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-12">
        <Container className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <Reveal>
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">About</p>
              <h1 className="text-4xl font-semibold md:text-5xl">Assam Roots. Restaurant-Tested.</h1>
              <p className="text-lg text-cream/70">
                Born in Barpeta Road, Assam, 7 Sisters Tea Co. carries the flavors we grew up with - now curated for
                modern kitchens across India and beyond.
              </p>
              <p className="text-sm text-cream/60">
                At 7 Sisters Restro, quality is non-negotiable. We bring that same standard to your home.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative h-[320px] w-full overflow-hidden rounded-3xl border border-white/10 bg-ink">
              <Image
                src="/images/about-assam.svg"
                alt="Assam heritage"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-contain"
              />
            </div>
          </Reveal>
        </Container>
      </Section>
      <Section className="bg-cream text-ink">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Our Origin',
                body: 'Barpeta Road, Assam - where tea and spices are daily rituals.'
              },
              {
                title: 'The Restro Promise',
                body: 'Restaurant-tested quality, made for everyday kitchens.'
              },
              {
                title: 'Our Philosophy',
                body: 'Daily essentials should taste premium - clean ingredients and honest aroma.'
              }
            ].map((item) => (
              <div key={item.title} className="lux-surface-cream p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-ink/70">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
