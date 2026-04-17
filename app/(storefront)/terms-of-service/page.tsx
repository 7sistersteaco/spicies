import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

export const metadata = {
  title: 'Terms of Service | 7 Sisters Tea Co.',
  description: 'Terms of Service for 7 Sisters Tea Co.'
};

export default function TermsOfServicePage() {
  return (
    <Section className="py-24">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="space-y-4 mb-12">
            <h1 className="text-3xl font-heading font-semibold md:text-5xl text-cream">Terms of Service</h1>
            <p className="text-sm text-cream/50 uppercase tracking-widest font-medium">Last updated: April 17, 2026</p>
          </div>
          <div className="space-y-8 text-sm text-cream/70 leading-relaxed lux-content">
            <p>
              Welcome to 7 Sisters Tea Co. By accessing our website and placing an order, you agree to be bound by the following Terms of Service.
            </p>

            <h2 className="text-lg font-semibold text-cream">1. General Conditions</h2>
            <p>
              We reserve the right to refuse service to anyone for any reason at any time. Prices for our products are subject to change without notice. We reserve the right to discontinue any product at any time.
            </p>

            <h2 className="text-lg font-semibold text-cream">2. Pre-orders & Fulfillment</h2>
            <p>
              All orders placed before June 4th are considered pre-orders. Fulfillment and shipping for pre-orders will commence strictly on or after the June 4th launch date. By placing a pre-order, you acknowledge and agree to this fulfillment timeline.
            </p>

            <h2 className="text-lg font-semibold text-cream">3. Payment Terms</h2>
            <p>
              We utilize Razorpay as our primary payment gateway. By proceeding with a purchase, you agree to Razorpay's terms of service regarding payment processing.
            </p>

            <h2 className="text-lg font-semibold text-cream">4. Modifications to the Service</h2>
            <p>
              We reserve the right to modify or terminate the service (or any part of the content) without notice at any time.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
