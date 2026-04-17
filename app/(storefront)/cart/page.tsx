import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';
import CartClient from '@/components/cart/CartClient';

export const metadata = {
  title: 'Cart',
  description: 'Review your kitchen essentials and proceed to checkout.'
};

export default function CartPage() {
  return (
    <Section className="pt-12">
      <Container>
        <Reveal>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-cream/50">Cart</p>
            <h1 className="text-4xl font-semibold md:text-5xl">Your Kitchen Essentials</h1>
            <p className="text-lg text-cream/70">Crafted &amp; served at 7 Sisters Restro.</p>
          </div>
        </Reveal>
        <CartClient />
      </Container>
    </Section>
  );
}
