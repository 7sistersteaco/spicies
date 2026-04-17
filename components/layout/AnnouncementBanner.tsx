'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Container from './Container';

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show only if not dismissed
    const isDismissed = localStorage.getItem('announcement-dismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcement-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-accent text-zinc-950 py-2.5 relative z-[60] animate-in fade-in slide-in-from-top duration-500 overflow-hidden border-b border-accent/20">
      <Container className="!py-0">
        <div className="flex items-center justify-between gap-4 px-1 md:px-4">
          <div className="flex-1 text-center">
            <p className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.25em] leading-relaxed max-w-[90%] mx-auto">
              🚀 Launching June 4 — Pre-orders are now open. All orders placed before launch will be fulfilled as pre-orders.
            </p>
          </div>
          <button 
            onClick={handleDismiss}
            className="p-1.5 rounded-full hover:bg-black/10 transition-colors flex-shrink-0"
            aria-label="Dismiss announcement"
          >
            <X size={16} />
          </button>
        </div>
      </Container>
    </div>
  );
}
