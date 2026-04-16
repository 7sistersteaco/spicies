import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import { WHATSAPP_NUMBER } from '@/lib/config/whatsapp';

export const metadata = {
  title: 'Contact 7 Sisters Tea Co.',
  description: 'Reach us on WhatsApp or via our contact form. Barpeta Road, Assam.'
};

export default function ContactPage() {
  return (
    <Section className="pt-12">
      <Container>
        <Reveal>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Contact</p>
            <h1 className="text-4xl font-semibold md:text-5xl">We'd love to hear from you</h1>
            <p className="text-lg text-cream/70">Barpeta Road, Assam, India</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="lux-surface p-6">
            <form className="space-y-4">
              <Input label="Name" placeholder="Mahmud Delowar" name="name" required />
              <Input label="Email" placeholder="you@example.com" name="email" type="email" required />
              <Input label="Phone" placeholder="+91 XXXXX XXXXX" name="phone" required />
              <TextArea
                label="Message"
                name="message"
                placeholder="How can we help you?"
                required
              />
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-accent/30 bg-ink p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">WhatsApp</p>
              <p className="mt-4 text-lg font-semibold">Chat on WhatsApp for quick help</p>
              <p className="mt-2 text-sm text-cream/60">We respond within business hours.</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="mt-6 inline-block">
                <Button className="bg-accent text-ink">Start Chat</Button>
              </a>
            </div>
            <div className="lux-surface p-6 text-sm text-cream/70">
              <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Location</p>
              <p className="mt-4">7 Sisters Restro, Barpeta Road, Assam</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
