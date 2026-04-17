'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Reveal from '@/components/motion/Reveal';

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Target Date: June 4, 2026
    const targetDate = new Date('2026-06-04T00:00:00').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsLive(true);
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation to prevent flicker
    const initial = calculateTimeLeft();
    if (initial) {
      setTimeLeft(initial);
    } else {
      setIsLive(true);
    }

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (!remaining) {
        setIsLive(true);
        setTimeLeft(null);
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLive) {
    return (
      <Section className="py-8 border-y border-accent/20 bg-accent/5">
        <Container>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-accent uppercase tracking-[0.3em]">We Are Live</h2>
            <p className="text-cream/70 font-medium text-sm">Official selection now available for fulfillment.</p>
          </div>
        </Container>
      </Section>
    );
  }

  // Avoid rendering during SSR hydration mismatch
  if (!timeLeft) return null;

  return (
    <Section className="py-12 md:py-20 border-y border-accent/10">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center justify-center space-y-10">
            <div className="text-center space-y-3">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-accent/80 font-medium">Launching June 4</p>
              <h2 className="text-lg md:text-2xl font-light text-cream/90 italic font-heading max-w-2xl mx-auto leading-relaxed">
                “Our first dispatch begins June 4 — Pre-orders now open”
              </h2>
            </div>
            
            <div className="flex items-start justify-center gap-6 md:gap-16">
              <TimeUnit value={timeLeft.days} label="Days" />
              <div className="text-3xl md:text-5xl text-accent/20 font-light pt-1.5">:</div>
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <div className="text-3xl md:text-5xl text-accent/20 font-light pt-1.5">:</div>
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
            </div>

            <div className="w-16 h-px bg-accent/30 mx-auto" />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center space-y-1.5 md:space-y-3 min-w-[64px] md:min-w-[110px]">
      <span className="text-4xl md:text-7xl font-light font-heading text-cream tabular-nums tracking-tighter">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[9px] md:text-xs uppercase tracking-[0.4em] text-cream/40 font-medium">
        {label}
      </span>
    </div>
  );
}
