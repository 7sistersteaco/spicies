import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

export const metadata = {
  title: 'Privacy Policy | 7 Sisters Tea Co.',
  description: 'Privacy Policy for 7 Sisters Tea Co.'
};

export default function PrivacyPolicyPage() {
  return (
    <Section className="py-24">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="space-y-4 mb-12">
            <h1 className="text-3xl font-heading font-semibold md:text-5xl text-cream">Privacy Policy</h1>
            <p className="text-sm text-cream/50 uppercase tracking-widest font-medium">Last updated: April 17, 2026</p>
          </div>
          <div className="space-y-8 text-sm text-cream/70 leading-relaxed lux-content">
            <p>
              At 7 Sisters Tea Co. ("we," "us," or "our"), located in Barpeta Road, Assam, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.
            </p>

            <h2 className="text-lg font-semibold text-cream">1. Information We Collect</h2>
            <p>
              When you make a purchase or attempt to make a purchase, we collect certain information necessary to fulfill your pre-order/order. This includes your name, billing address, shipping address, payment information (processed securely through Razorpay), email address, and phone number.
            </p>

            <h2 className="text-lg font-semibold text-cream">2. How We Use Your Information</h2>
            <p>
              We use the Order Information to fulfill any orders placed through the site, including arranging for shipping and providing you with invoices. During our pre-order phase (prior to June 4), we will also use this information to keep you updated via WhatsApp or email on your fulfillment status.
            </p>

            <h2 className="text-lg font-semibold text-cream">3. Razorpay & Data Security</h2>
            <p>
              We use Razorpay for payment processing. We do not store your credit/debit card details on our servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payments.
            </p>

            <h2 className="text-lg font-semibold text-cream">4. Changes</h2>
            <p>
              We may update this privacy policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons.
            </p>

            <h2 className="text-lg font-semibold text-cream">5. Contact Us</h2>
            <p>
              For more information about our privacy practices or if you have questions, please reach out to us directly via our Contact page or WhatsApp.
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
