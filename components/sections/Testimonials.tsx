import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

const testimonials = [
  {
    quote: 'The tea is bold and clean - exactly how Assam chai should taste.',
    name: 'Nirmala, Kolkata'
  },
  {
    quote: 'The garam masala feels fresh and balanced. Big restaurant flavor.',
    name: 'Arjun, Bengaluru'
  },
  {
    quote: 'Feels premium, but made for daily use. Perfect.',
    name: 'Rhea, Mumbai'
  }
];

export default function Testimonials() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Loved by Everyday Kitchens</p>
            <h2 className="text-3xl font-semibold md:text-4xl">Trust built at the table</h2>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={0.08 * index}>
              <div className="lux-surface p-6">
                <p className="text-sm text-cream/70">"{item.quote}"</p>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-cream/50">{item.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
