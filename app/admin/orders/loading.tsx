import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';

export default function Loading() {
  return (
    <Section className="pt-12">
      <Container>
        <div className="space-y-6">
          <div className="h-10 w-48 rounded-xl bg-charcoal/60" />
          <div className="h-24 rounded-2xl border border-white/10 bg-charcoal/60" />
          <div className="h-64 rounded-2xl border border-white/10 bg-charcoal/60" />
        </div>
      </Container>
    </Section>
  );
}
