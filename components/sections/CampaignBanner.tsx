import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { isValidImageUrl } from '@/lib/utils';

export default function CampaignBanner({ bannerImageUrl }: { bannerImageUrl?: string | null }) {
  // If no banner image has been uploaded, render nothing
  if (!isValidImageUrl(bannerImageUrl)) return null;

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(220px, 40vw, 520px)' }}>
      {/* Background image */}
      <SafeImage
        src={bannerImageUrl!}
        fallback=""
        alt="Campaign banner"
        fill
        className="object-cover object-center"
        priority={false}
      />

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="px-8 md:px-16 lg:px-24 space-y-5 max-w-2xl">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-accent font-semibold">
            New Harvest · 2024
          </p>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl text-cream leading-[1.05] tracking-tight">
            From Restro<br />
            <span className="text-accent italic">to Your Home.</span>
          </h2>
          <p className="text-sm md:text-base text-cream/70 leading-relaxed max-w-sm">
            Restaurant-tested Assam tea & spices, now available for pre-order.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-7 py-3 text-[10px] uppercase tracking-[0.25em] text-accent font-bold hover:bg-accent hover:text-ink transition-all duration-300"
          >
            Pre-order Now
          </Link>
        </div>
      </div>
    </section>
  );
}
