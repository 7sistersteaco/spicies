import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import { WHATSAPP_NUMBER } from '@/lib/config/whatsapp';

export default function ContactCTA() {
  return (
    <Section className="bg-cream text-ink">
      <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <Reveal>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-ink/50">Need help?</p>
            <h2 className="text-3xl font-semibold md:text-4xl">Chat on WhatsApp for quick support</h2>
            <p className="text-sm text-ink/70">We're here to help with orders, gifting, or sourcing.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
            <Button className="bg-ink text-cream hover:shadow-none">WhatsApp Us</Button>
          </a>
        </Reveal>
      </Container>
    </Section>
  );
}
