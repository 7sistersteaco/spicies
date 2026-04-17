import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';
import CheckoutClient from '@/components/cart/CheckoutClient';

export const metadata = {
  title: 'Checkout',
  description: 'Enter your delivery details to complete your order.'
};

export default function CheckoutPage() {
  return (
    <Section className="pt-12">
      <Container>
        <Reveal>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Checkout</p>
            <h1 className="text-4xl font-semibold md:text-5xl">Complete your order</h1>
            <p className="text-lg text-cream/70">From Assam to your home.</p>
          </div>
        </Reveal>
        <CheckoutClient />
      </Container>
    </Section>
  );
}
