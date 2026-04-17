import Link from 'next/link';
import { WHATSAPP_NUMBER } from '@/lib/config/whatsapp';

type BrandingProps = {
  fssai_license_number?: string | null;
  [key: string]: any;
};

export default function SiteFooter({ branding }: { branding?: BrandingProps }) {
  const fssaiNum = branding?.fssai_license_number;

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="section-pad mx-auto grid max-w-[96rem] 2xl:max-w-[104rem] gap-10 py-14 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
        <div className="space-y-4">
          <p className="text-lg font-semibold">7 Sisters Tea Co.</p>
          <p className="text-sm text-cream/70">
            Assam roots. Restaurant-tested. Delivered fresh.
          </p>
          <div className="lux-divider max-w-[240px]" />
          <p className="text-xs uppercase tracking-[0.28em] text-cream/50">From Assam to your home</p>
        </div>
        <div className="space-y-3 text-sm text-cream/70">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/40">Explore</p>
          <Link href="/products" className="block hover:text-cream">
            Shop
          </Link>
          <Link href="/about" className="block hover:text-cream">
            About
          </Link>
          <Link href="/contact" className="block hover:text-cream">
            Contact
          </Link>
        </div>
        <div className="space-y-3 text-sm text-cream/70">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/40">Legal</p>
          <Link href="/privacy-policy" className="block hover:text-cream">Privacy Policy</Link>
          <Link href="/terms-of-service" className="block hover:text-cream">Terms</Link>
          <Link href="/shipping-policy" className="block hover:text-cream">Shipping</Link>
          <Link href="/refund-policy" className="block hover:text-cream">Refunds</Link>
          <Link href="/compliance" className="block hover:text-cream">Compliance</Link>
        </div>
        <div className="space-y-3 text-sm text-cream/70">
          <p className="text-xs uppercase tracking-[0.3em] text-cream/40">Contact</p>
          <p>Barpeta Road, Assam, India</p>
          <p>WhatsApp: +{WHATSAPP_NUMBER.slice(0, 2)} {WHATSAPP_NUMBER.slice(2, 7)} {WHATSAPP_NUMBER.slice(7)}</p>
          <p>Email: support@7sisterstea.com</p>
        </div>
      </div>

      {/* FSSAI compliance strip — only shown when license number is set */}
      {fssaiNum && (
        <div className="border-t border-white/5 px-6 py-3">
          <div className="mx-auto max-w-[96rem] 2xl:max-w-[104rem] flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] text-cream/35 tracking-wide">
              FSSAI Registered • Lic No:{' '}
              <span className="text-cream/55 font-mono tracking-widest">{fssaiNum}</span>
            </p>
            <Link
              href="/compliance"
              className="text-[10px] text-cream/35 hover:text-cream/60 tracking-wide transition-colors"
            >
              Food Safety & Compliance →
            </Link>
          </div>
        </div>
      )}
    </footer>
  );
}

