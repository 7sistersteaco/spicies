import Link from 'next/link';
import { WHATSAPP_NUMBER } from '@/lib/config/whatsapp';

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="section-pad mx-auto grid max-w-[96rem] 2xl:max-w-[104rem] gap-10 py-14 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
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
          <p className="text-xs uppercase tracking-[0.3em] text-cream/40">Contact</p>
          <p>Barpeta Road, Assam, India</p>
          <p>WhatsApp: +{WHATSAPP_NUMBER.slice(0, 2)} {WHATSAPP_NUMBER.slice(2, 7)} {WHATSAPP_NUMBER.slice(7)}</p>
          <p>Email: support@7sisterstea.com</p>
        </div>
      </div>
    </footer>
  );
}
