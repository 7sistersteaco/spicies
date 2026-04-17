import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

const points = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    stat: '100%',
    statLabel: 'Assam Origin',
    title: 'Authentic Assam Sourcing',
    body: 'Every batch is traced to Barpeta Road farms — no middlemen, no blending shortcuts. What we serve at our restro, we now pack for you.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    stat: '7+',
    statLabel: 'Years in Kitchen',
    title: 'Restaurant-Tested Quality',
    body: 'Used daily in the 7 Sisters Restro kitchen for over 7 years. Only ingredients that pass our chef\'s standard make it to your home.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    stat: '0',
    statLabel: 'Artificial Additives',
    title: 'Fresh Daily-Use Essentials',
    body: 'No preservatives. No artificial colour. Just clean, honest ingredients packed at peak freshness — the way real kitchens demand.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    stat: 'June 4',
    statLabel: 'First Dispatch',
    title: 'Direct to Your Door',
    body: 'Order today, dispatched from Assam on June 4. No retail markup — you get restro-grade quality at honest prices, delivered home.'
  }
];

const trustItems = [
  { label: 'Pre-orders Open', value: '✓' },
  { label: 'Dispatch Begins June 4', value: '✓' },
  { label: 'Assam Origin Guaranteed', value: '✓' },
  { label: 'No Artificial Additives', value: '✓' }
];

export default function WhyChooseUs() {
  return (
    <Section className="relative overflow-hidden">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 font-semibold">Why 7 Sisters</p>
              <h2 className="text-3xl font-heading font-semibold md:text-4xl lg:text-5xl leading-tight">
                Daily essentials,<br className="hidden md:block" /> premium standard
              </h2>
            </div>
            <p className="text-sm text-cream/50 max-w-xs leading-relaxed">
              From our restaurant kitchen to your home — without compromise.
            </p>
          </div>
        </Reveal>

        {/* Feature cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point, index) => (
            <Reveal key={point.title} delay={0.07 * index}>
              <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-7 flex flex-col gap-6 hover:border-accent/25 hover:bg-accent/[0.03] transition-all duration-300 overflow-hidden h-full">
                {/* Hover glow */}
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Icon */}
                <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/15 flex items-center justify-center text-accent shrink-0">
                  {point.icon}
                </div>

                {/* Stat */}
                <div>
                  <p className="text-3xl font-heading font-semibold text-accent leading-none">{point.stat}</p>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-cream/30 mt-1.5 font-medium">{point.statLabel}</p>
                </div>

                {/* Text */}
                <div className="flex-1 space-y-2">
                  <h3 className="text-[15px] font-semibold text-cream leading-snug">{point.title}</h3>
                  <p className="text-xs text-cream/55 leading-relaxed">{point.body}</p>
                </div>

                {/* Bottom accent line */}
                <div className="h-px w-full bg-gradient-to-r from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trust bar */}
        <Reveal delay={0.3}>
          <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.015] px-6 py-5">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-between">
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent text-[10px] font-bold shrink-0">✓</span>
                  <span className="text-[11px] text-cream/60 font-medium tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

