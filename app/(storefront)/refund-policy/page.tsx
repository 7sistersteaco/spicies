import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

export const metadata = {
  title: 'Refund Policy | 7 Sisters Tea Co.',
  description: 'Cancellation and refund policy.'
};

export default function RefundPolicyPage() {
  return (
    <Section className="py-24">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="space-y-4 mb-12">
            <h1 className="text-3xl font-heading font-semibold md:text-5xl text-cream">Refund & Cancellation Policy</h1>
            <p className="text-sm text-cream/50 uppercase tracking-widest font-medium">Last updated: April 17, 2026</p>
          </div>
          <div className="space-y-8 text-sm text-cream/70 leading-relaxed lux-content">
            <p>
              Due to the perishable nature of our products (tea and spices), we maintain a strict return policy to ensure quality and hygiene standards via FSSAI guidelines.
            </p>

            <h2 className="text-lg font-semibold text-cream">1. Eligibility for Refunds</h2>
            <p>
              Returns and refunds are only accepted if you receive a damaged, defective, or incorrect item. In such cases, you must contact us via WhatsApp within 48 hours of delivery with photographic evidence.
            </p>

            <h2 className="text-lg font-semibold text-cream">2. Pre-order Cancellations</h2>
            <p>
              For any pre-orders placed prior to our June 4th launch date, you may cancel your order at any point before June 1st for a full refund. Cancellations after this point may incur processing fees.
            </p>

            <h2 className="text-lg font-semibold text-cream">3. Refund Process</h2>
            <p>
              Approved refunds will be processed immediately. The credited amount will automatically be applied to your original method of payment (via Razorpay) within 5-7 business days, depending on your bank's processing times.
            </p>

            <h2 className="text-lg font-semibold text-cream">4. How to Request</h2>
            <p>
              Please use our Contact page or message us directly on WhatsApp to initiate a cancellation or refund request.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
