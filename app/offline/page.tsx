import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/motion/Reveal';
import { WifiOff, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { getBrandingSettings } from '@/app/actions/branding';

// Note: Re-enabling 'use client' features via a separate wrapper or just using native features
// for the offline page to keep it extremely stable.

export default async function OfflinePage() {
  const branding = await getBrandingSettings();
  const logoUrl = branding.logo_url || '/images/tea-hero.svg';

  return (
    <Section className="min-h-[90vh] flex items-center justify-center pt-20">
      <Container className="max-w-md text-center">
        <Reveal>
          <div className="flex flex-col items-center space-y-10">
            {/* Branded Logo Container */}
            <div className="relative group">
              <div className="absolute inset-0 blur-3xl bg-accent/20 rounded-full animate-pulse transition-opacity group-hover:opacity-100" />
              <div className="relative h-24 w-48 transition-transform duration-700 group-hover:scale-105">
                <Image 
                  src={logoUrl} 
                  alt="7 Sisters Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-soft">
                <WifiOff className="h-8 w-8 text-accent/60" />
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold text-cream tracking-tight">You're offline</h1>
                <p className="text-lg text-cream/70 leading-relaxed max-w-sm">
                  Please check your internet connection and try again. We'll be ready for your next order.
                </p>
              </div>
            </div>

            <a href="/" className="w-full">
              <Button 
                variant="primary"
                className="group w-full max-w-[280px] h-14 text-sm uppercase tracking-widest gap-3"
              >
                <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
                Retry Connection
              </Button>
            </a>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
