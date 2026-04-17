import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';
import SafeImage from '@/components/ui/SafeImage';
import Link from 'next/link';
import { getBrandingSettings } from '@/app/actions/branding';
import { isValidImageUrl } from '@/lib/utils';

export const metadata = {
  title: 'Our Story | 7 Sisters Tea Co.',
  description: 'Discover how 7 Sisters Tea & Co. brings the authentic flavors of Barpeta Road to modern kitchens. From our restaurant to your home.',
  alternates: {
    canonical: '/about'
  }
};

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Our Origin',
    body: 'Barpeta Road, Assam — where tea and spices are not commodities but daily rituals passed across generations. Every product carries this geography.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'The Restro Promise',
    body: "At 7 Sisters Restro, quality is not a checkbox — it's the culture. Every ingredient we sell has already earned its place in our own kitchen."
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: 'Our Philosophy',
    body: 'Real food should taste like real food. No shortcuts. No synthetics. Just honest, clean ingredients — the same ones we trust to feed our own guests.'
  }
];

const stats = [
  { value: '7+', label: 'Years running 7 Sisters Restro' },
  { value: '100%', label: 'Assam-origin sourcing' },
  { value: '0', label: 'Artificial additives or preservatives' }
];

export default async function AboutPage() {
  const branding = await getBrandingSettings();
  const hasAboutImage = isValidImageUrl(branding.about_image_url);

  return (
    <>
      {/* Hero Section */}
      <Section className="pt-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <Container className="grid gap-14 md:grid-cols-[1.15fr_0.85fr] md:items-center lg:gap-20">
          <Reveal>
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 font-semibold">Our Story</p>
                <h1 className="text-4xl font-heading font-semibold md:text-5xl lg:text-6xl leading-[1.05]">
                  Assam Roots.<br />
                  <span className="text-accent italic">Restaurant-Tested.</span>
                </h1>
              </div>
              <p className="text-lg text-cream/70 leading-relaxed max-w-lg">
                Born in Barpeta Road, Assam, 7 Sisters Tea Co. carries the flavors we grew up with — now curated for modern kitchens across India and beyond.
              </p>
              <p className="text-sm text-cream/50 leading-relaxed max-w-md border-l-2 border-accent/30 pl-4">
                "At 7 Sisters Restro, quality is non-negotiable. We bring that same standard to your home."
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-accent text-ink px-7 py-3 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-accent/90 transition-all duration-300"
                >
                  Shop Now
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-3 text-[10px] uppercase tracking-[0.25em] text-cream/70 font-bold hover:border-accent/30 hover:text-cream transition-all duration-300"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative h-[360px] w-full overflow-hidden rounded-3xl border border-white/8 bg-ink shadow-soft md:h-[420px]">
              <SafeImage
                src={hasAboutImage ? branding.about_image_url! : '/images/about-assam.svg'}
                fallback="/images/about-assam.svg"
                alt="7 Sisters Tea Co. — Assam Heritage"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className={hasAboutImage ? 'object-cover object-center' : 'object-contain p-6'}
                priority
              />
              {/* Subtle overlay gradient at bottom */}
              {hasAboutImage && (
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/60 to-transparent" />
              )}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Stats Bar */}
      <Section className="py-0">
        <Container>
          <Reveal>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-8 py-7">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:divide-x sm:divide-white/5">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center text-center sm:px-8 gap-1.5">
                    <span className="text-4xl font-heading font-semibold text-accent leading-none">{stat.value}</span>
                    <span className="text-[10px] uppercase tracking-[0.35em] text-cream/40 font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Values Grid */}
      <Section>
        <Container>
          <Reveal>
            <div className="mb-12 space-y-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 font-semibold">What We Stand For</p>
              <h2 className="text-3xl font-heading font-semibold md:text-4xl">The principles we never compromise on</h2>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((item, index) => (
              <Reveal key={item.title} delay={0.08 * index}>
                <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-5 hover:border-accent/20 hover:bg-accent/[0.02] transition-all duration-300 h-full">
                  <div className="h-11 w-11 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center text-accent">
                    {item.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-cream">{item.title}</h3>
                    <p className="text-sm text-cream/55 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Closing CTA */}
      <Section>
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-accent/15 bg-gradient-to-br from-accent/5 via-accent/[0.02] to-transparent p-10 md:p-14 text-center space-y-6">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/8 via-transparent to-transparent pointer-events-none" />
              <p className="text-[10px] uppercase tracking-[0.5em] text-accent/70 font-semibold relative">From Our Kitchen to Yours</p>
              <h2 className="text-3xl font-heading font-semibold md:text-4xl text-cream relative">
                Taste the difference of<br />
                <span className="text-accent italic">restaurant-grade quality.</span>
              </h2>
              <p className="text-sm text-cream/55 max-w-md mx-auto leading-relaxed relative">
                Pre-orders are now open. Be among the first to bring Assam's finest to your home kitchen on June 4th.
              </p>
              <Link
                href="/products"
                className="relative inline-flex items-center gap-2 rounded-full bg-accent text-ink px-9 py-3.5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/20"
              >
                Pre-order Now
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

