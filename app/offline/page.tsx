import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';

export const metadata = {
  title: 'Offline',
  description: 'You are offline. Please reconnect to browse the catalog.'
};

export default function OfflinePage() {
  return (
    <Section className="pt-20">
      <Container>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Offline</p>
          <h1 className="text-4xl font-semibold md:text-5xl">You're offline</h1>
          <p className="text-lg text-cream/70">
            Please reconnect to browse 7 Sisters Tea Co. We'll be here with fresh Assam essentials.
          </p>
        </div>
      </Container>
    </Section>
  );
}
