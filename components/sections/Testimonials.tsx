import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

const testimonials = [
  {
    quote: 'The tea is bold and clean — exactly how Assam chai should taste. Been switching from my usual brand.',
    name: 'Nirmala S.',
    location: 'Kolkata',
    stars: 5,
    tag: 'Assam Strong CTC',
    initials: 'NS',
    color: 'from-amber-500/30 to-yellow-600/20'
  },
  {
    quote: 'The garam masala feels fresh and balanced. Big restaurant flavor in my home kitchen now.',
    name: 'Arjun M.',
    location: 'Bengaluru',
    stars: 5,
    tag: 'Garam Masala',
    initials: 'AM',
    color: 'from-orange-500/30 to-red-600/20'
  },
  {
    quote: 'Feels premium, but made for daily use. The packaging alone tells you this is a different level.',
    name: 'Rhea P.',
    location: 'Mumbai',
    stars: 5,
    tag: 'Assam Premium Leaf',
    initials: 'RP',
    color: 'from-emerald-500/30 to-teal-600/20'
  },
  {
    quote: 'My whole family switched. The kashmiri chilli is exactly what I needed for authentic North-East curries.',
    name: 'Debashish K.',
    location: 'Guwahati',
    stars: 5,
    tag: 'Kashmiri Chilli',
    initials: 'DK',
    color: 'from-rose-500/30 to-pink-600/20'
  }
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? 'text-accent' : 'text-white/10'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <Section className="overflow-hidden">
      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 font-semibold">Loved by Everyday Kitchens</p>
              <h2 className="text-3xl font-semibold md:text-4xl font-heading">Trust built at the table</h2>
            </div>
            {/* Aggregate rating stat */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="text-center">
                <p className="text-4xl font-heading font-semibold text-accent leading-none">4.9</p>
                <StarRating count={5} />
                <p className="text-[9px] uppercase tracking-widest text-cream/30 mt-1.5">Avg. Rating</p>
              </div>
              <div className="h-12 w-px bg-white/5" />
              <div className="text-center">
                <p className="text-4xl font-heading font-semibold text-cream leading-none">100%</p>
                <p className="text-[9px] uppercase tracking-widest text-cream/30 mt-2.5">Recommend</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Cards — horizontal scroll on mobile, 4-col grid on desktop */}
        <div className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-4 snap-x snap-mandatory md:snap-none scrollbar-none">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={0.07 * index}>
              <div className="group relative min-w-[280px] md:min-w-0 flex-1 snap-start rounded-2xl border border-white/5 bg-white/[0.025] p-6 flex flex-col gap-5 hover:border-accent/20 hover:-translate-y-1 transition-all duration-300 cursor-default">
                {/* Top row: avatar + verified */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 ring-1 ring-white/10`}>
                      <span className="text-[11px] font-bold text-cream/90 tracking-wide">{item.initials}</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-cream leading-none">{item.name}</p>
                      <p className="text-[10px] text-cream/40 mt-0.5">{item.location}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-accent/70 bg-accent/5 border border-accent/10 px-2 py-1 rounded-full font-bold shrink-0">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>

                {/* Stars */}
                <StarRating count={item.stars} />

                {/* Quote */}
                <p className="text-sm text-cream/75 leading-relaxed flex-1">
                  "{item.quote}"
                </p>

                {/* Product tag */}
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-accent/60 font-medium">{item.tag}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

