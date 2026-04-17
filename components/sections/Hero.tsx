'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import SafeImage from '@/components/ui/SafeImage';
import { isValidImageUrl } from '@/lib/utils';

export default function Hero({ heroImageUrl }: { heroImageUrl?: string | null }) {
  const [imageError, setImageError] = useState(false);
  const showOverride = isValidImageUrl(heroImageUrl) && !imageError;

  return (
    <Section className="pt-10 md:pt-16">
      <Container className="grid gap-12 md:grid-cols-[1.15fr_0.85fr] md:items-center lg:gap-16">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-cream/80">7 Sisters Tea Co.</p>
          <h1 className="text-3xl sm:text-4xl font-heading font-semibold md:text-6xl text-cream leading-[1.1]">
            Authentic Assam Tea &amp; Spices
          </h1>
          <p className="max-w-xl text-lg text-cream/80">
            From our kitchen at 7 Sisters Restro to your home.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/products">
              <Button>Shop Now</Button>
            </Link>
            <Link href="/about" className="text-xs uppercase tracking-[0.3em] text-cream/80 hover:text-accent transition-colors font-bold">
              Explore Assam
            </Link>
          </div>
        </div>
        <Reveal delay={0.1}>
          <div className="relative h-[300px] w-full overflow-hidden lux-surface md:h-[380px] lg:h-[440px] xl:h-[480px] flex items-center justify-center">
            {showOverride ? (
              <SafeImage 
                src={heroImageUrl} 
                fallback="/images/hero-tea.svg"
                alt="7 Sisters Tea Co. Hero" 
                fill 
                className="object-cover"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <svg width="900" height="700" viewBox="0 0 900 700" fill="none" className="w-full h-full p-6 md:p-10" xmlns="http://www.w3.org/2000/svg">
                <rect width="900" height="700" fill="none"/>
                <g stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M260 420h300c40 0 72-32 72-72v-110h-444v110c0 40 32 72 72 72z"/>
                  <path d="M632 250h38c32 0 58 26 58 58s-26 58-58 58h-38"/>
                  <path d="M350 210c0-24 16-42 40-60"/>
                  <path d="M420 200c0-30 18-52 50-70"/>
                  <path d="M500 210c0-24 16-42 40-60"/>
                </g>
                <text x="120" y="560" fill="#D4AF37" fontSize="32" fontFamily="Playfair Display, serif" letterSpacing="2">Assam Tea &amp; Spices</text>
                <text x="120" y="600" className="fill-cream/40" fontSize="14" fontFamily="Poppins, sans-serif" letterSpacing="4">FROM RESTRO TO HOME</text>
              </svg>
            )}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
