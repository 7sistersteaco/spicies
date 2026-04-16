import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';

export default function AdminLoading() {
  return (
    <Section className="pt-12">
      <Container>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Admin</p>
          <h1 className="text-3xl font-semibold">Loading pre-book requests...</h1>
          <div className="h-24 rounded-2xl border border-white/10 bg-charcoal/60" />
        </div>
      </Container>
    </Section>
  );
}
