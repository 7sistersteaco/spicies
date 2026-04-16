import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';

export default function Loading() {
  return (
    <Section className="pt-12">
      <Container>
        <div className="space-y-6">
          <div className="h-10 w-64 rounded-xl bg-charcoal/60" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-32 rounded-2xl border border-white/10 bg-charcoal/60" />
            <div className="h-32 rounded-2xl border border-white/10 bg-charcoal/60" />
            <div className="h-32 rounded-2xl border border-white/10 bg-charcoal/60" />
          </div>
          <div className="h-48 rounded-2xl border border-white/10 bg-charcoal/60" />
        </div>
      </Container>
    </Section>
  );
}
