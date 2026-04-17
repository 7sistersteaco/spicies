import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';
import SafeImage from '@/components/ui/SafeImage';
import { getBrandingSettings } from '@/app/actions/branding';
import { isValidImageUrl } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Food Safety & Compliance | 7 Sisters Tea Co.',
  description:
    'View our FSSAI registration details. 7 Sisters Tea Co. is a registered food business compliant with the Food Safety and Standards Authority of India.',
  alternates: {
    canonical: '/compliance'
  }
};

export default async function CompliancePage() {
  const branding = await getBrandingSettings();
  const hasCert = isValidImageUrl(branding.fssai_certificate_url);
  const licenseNum = branding.fssai_license_number;

  return (
    <Section className="pt-12">
      <Container className="max-w-3xl">
        <Reveal>
          <div className="space-y-3 mb-12">
            <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 font-semibold">Quality &amp; Compliance</p>
            <h1 className="text-3xl font-heading font-semibold md:text-4xl">Food Safety &amp; Compliance</h1>
          </div>
        </Reveal>

        <Reveal delay={0.07}>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 space-y-6">
            {/* FSSAI Registration block */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center shrink-0">
                  {/* Shield icon */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-cream">FSSAI Registration</h2>
              </div>

              <p className="text-sm text-cream/65 leading-relaxed">
                7 Sisters Tea Co. is a registered food business under the Food Safety and Standards
                Authority of India (FSSAI), ensuring all products meet regulated quality and safety standards.
              </p>

              {licenseNum && (
                <div className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-5 py-4">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-cream/35 font-semibold shrink-0">
                    License Number
                  </p>
                  <p className="font-mono text-sm text-cream/80 tracking-widest">{licenseNum}</p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5" />

            {/* Additional compliance notes */}
            <div className="space-y-3 text-sm text-cream/55 leading-relaxed">
              <p>
                All products sold by 7 Sisters Tea Co. are sourced from verified Assam-origin
                suppliers. Packaging carries the required FSSAI mark, batch number, best-before
                date, and ingredient declaration as mandated by FSSAI regulations.
              </p>
              <p className="text-cream/65">
                Manufactured and handled in compliance with FSSAI guidelines.
              </p>
              <p>
                For any compliance-related questions, please contact us via WhatsApp or email at{' '}
                <span className="text-cream/70">support@7sisterstea.com</span>.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Certificate image — only if uploaded */}
        {hasCert && (
          <Reveal delay={0.12}>
            <div className="mt-8 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.4em] text-cream/35 font-semibold text-center">
                Official Registration Certificate
              </p>
              <div className="relative rounded-2xl border border-white/8 overflow-hidden bg-white/[0.02] flex justify-center">
                <SafeImage
                  src={branding.fssai_certificate_url!}
                  fallback=""
                  alt="FSSAI Registration Certificate — 7 Sisters Tea Co."
                  width={900}
                  height={640}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}
