import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

export const metadata = {
  title: 'Shipping Policy | 7 Sisters Tea Co.',
  description: 'Shipping and delivery information.'
};

export default function ShippingPolicyPage() {
  return (
    <Section className="py-24">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="space-y-4 mb-12">
            <h1 className="text-3xl font-heading font-semibold md:text-5xl text-cream">Shipping Policy</h1>
            <p className="text-sm text-cream/50 uppercase tracking-widest font-medium">Last updated: April 17, 2026</p>
          </div>
          <div className="space-y-8 text-sm text-cream/70 leading-relaxed lux-content">
            <p>
              All our orders are dispatched directly from our blending facility in Barpeta Road, Assam.
            </p>

            <h2 className="text-lg font-semibold text-cream">1. Pre-order Dispatch Timeline</h2>
            <p>
              Orders placed before our launch date are classified as "Pre-orders." <b>All pre-orders will be processed and dispatched starting on or after June 4th.</b> You will be notified via WhatsApp or email once your package is handed over to our courier partner.
            </p>

            <h2 className="text-lg font-semibold text-cream">2. Standard Processing</h2>
            <p>
              Post-launch, standard orders are processed within 1-2 business days. Delivery within India typically takes 4-7 business days depending on your location.
            </p>

            <h2 className="text-lg font-semibold text-cream">3. Issues with Delivery</h2>
            <p>
              If your order tracking shows delivered but you have not received it, or if your package arrives visibly damaged, please contact us within 48 hours for immediate assistance.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
