import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

const points = [
  {
    title: 'Authentic Assam sourcing',
    body: 'Trusted by our own restaurant kitchen for daily service.'
  },
  {
    title: 'Restaurant-tested quality',
    body: 'What we serve daily, we now pack for your home.'
  },
  {
    title: 'Fresh daily-use essentials',
    body: 'Premium, honest ingredients with real aroma.'
  }
];

export default function WhyChooseUs() {
  return (
    <Section className="bg-cream text-ink">
      <Container>
        <Reveal>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-ink/50">Why 7 Sisters</p>
            <h2 className="text-3xl font-semibold md:text-4xl">Daily essentials, premium standard</h2>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {points.map((point, index) => (
            <Reveal key={point.title} delay={0.08 * index}>
              <div className="lux-surface-cream p-6">
                <h3 className="text-xl font-semibold">{point.title}</h3>
                <p className="mt-3 text-sm text-ink/70">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
