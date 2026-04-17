'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CartCount from './CartCount';
import ThemeToggle from './ThemeToggle';
import { signOutUser } from '@/app/actions/auth';
import type { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { WHATSAPP_NUMBER } from '@/lib/config/whatsapp';
import { cx, getSafeImage, isValidImageUrl } from '@/lib/utils';
import SafeImage from '@/components/ui/SafeImage';

// --- Icons ---
const BagIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className ?? 'h-5 w-5'} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7V6a5 5 0 0 1 10 0v1" />
    <path d="M5 7h14l-1 13H6L5 7z" />
  </svg>
);

const ShopIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const AboutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const ContactIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-4.7 8.38 8.38 0 0 1 3.8.9L21 11.5z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'h-5 w-5'}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-20 group-hover:opacity-60 transition-opacity">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// --- Animation Variants ---
const drawerVariants = {
  hidden: { x: '100%', transition: { type: 'spring', damping: 30, stiffness: 300 } },
  visible: { x: 0, transition: { type: 'spring', damping: 30, stiffness: 300 } }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0, 
    transition: { delay: 0.15 + i * 0.04, duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }
  })
};

export default function SiteHeader({ 
  user, 
  branding 
}: { 
  user: User | null;
  branding: { logo_url: string | null; favicon_url: string | null; hero_image_url: string | null; banner_image_url: string | null };
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/90 backdrop-blur">
      <div className="section-pad mx-auto flex h-20 max-w-[96rem] 2xl:max-w-[104rem] items-center justify-between font-sans">
        <Link href="/" className="flex items-center gap-2 font-semibold group h-full">
          {isValidImageUrl(branding.logo_url) ? (
            /* Symbol icon uploaded — show icon + brand name side by side */
            <div className="flex items-center gap-3 transition-transform group-hover:scale-[1.01]">
              <div className="relative h-9 w-9 shrink-0">
                <SafeImage
                  src={branding.logo_url}
                  fallback="/images/logo-mark.svg"
                  alt="7 Sisters Tea Co."
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-heading text-[19px] md:text-[22px] tracking-[0.01em] text-cream leading-none">
                7 Sisters <span className="text-accent italic">Tea Co.</span>
              </span>
            </div>
          ) : (
            /* No logo — text branding only */
            <div className="flex flex-col items-start">
              <span className="font-heading text-[20px] md:text-[23px] tracking-[0.01em] text-cream leading-none">
                7 Sisters <span className="text-accent italic">Tea Co.</span>
              </span>
            </div>
          )}
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.25em] text-cream/60 md:flex font-medium">
          <Link href="/products" className="hover:text-cream transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-cream transition-colors">About</Link>
          <Link href="/contact" className="hover:text-cream transition-colors">Contact</Link>
          
          {user ? (
            <Link href="/account" className="hover:text-cream transition-colors">Account</Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-cream transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-cream transition-colors border border-accent/30 rounded-full px-4 py-1.5 hover:bg-accent/10">Signup</Link>
            </>
          )}

          <Link href="/cart" className="flex items-center gap-2 hover:text-cream transition-colors" aria-label="Cart">
            <BagIcon />
            <CartCount />
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/cart" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/5 text-cream/70 transition hover:border-accent/60 md:hidden group">
            <BagIcon className="h-5 w-5 group-hover:text-accent transition-colors" />
            <span className="absolute -right-1 -top-1 font-mono text-[9px] bg-accent text-ink h-4 w-4 rounded-full flex items-center justify-center font-bold">
              <CartCount />
            </span>
          </Link>
          <Link href="/products" className="hidden rounded-full border border-accent/60 px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] text-accent transition hover:bg-accent hover:text-ink md:inline-flex font-bold">
            Shop Now
          </Link>
          {user && (
            <form action={signOutUser} className="hidden md:inline-block">
              <button
                type="submit"
                title="Sign out"
                aria-label="Sign out"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-white/8 text-cream/30 hover:border-red-500/25 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
              >
                <LogoutIcon className="h-4 w-4" />
              </button>
            </form>
          )}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/5 text-cream/70 md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <div className="flex h-3 w-5 flex-col justify-between">
              <span className="h-[1.5px] w-full bg-current rounded-full" />
              <span className="h-[1.5px] w-full bg-current rounded-full opacity-60" />
              <span className="h-[1.5px] w-full bg-current rounded-full" />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Side Drawer */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 right-0 z-[70] h-screen w-[85%] max-w-[400px] bg-ink md:hidden overflow-hidden shadow-2xl border-l border-white/10"
            >
              <div className="relative z-10 flex flex-col h-full font-sans">
                {/* Header (Fixed) */}
                <div className="flex-none flex items-center justify-between p-7 border-b border-white/5">
                   <div className="text-[10px] uppercase font-bold tracking-[0.4em] text-cream/70">Navigation</div>
                   <button 
                     onClick={() => setIsOpen(false)}
                     className="h-11 w-11 flex items-center justify-center rounded-full border border-white/5 text-cream/40 hover:text-cream transition-all"
                   >
                     <XIcon />
                   </button>
                </div>

                {/* Primary Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-6 py-8 space-y-12">
                   {/* ... (rest of the code remains the same internally) */}
                  {/* User Profile */}
                  {user && (
                    <motion.div 
                      custom={0} variants={itemVariants}
                      className="p-5 rounded-2xl bg-cream/5 border border-white/5 flex items-center gap-4"
                    >
                      <div className="h-11 w-11 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <UserIcon />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] text-cream/60 uppercase tracking-[0.25em] font-bold">Authenticated</p>
                        <p className="text-sm font-medium text-cream/90 truncate">{user.email}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Nav Groups */}
                  <div className="space-y-10">
                    <div className="space-y-6">
                       <ul className="space-y-2">
                         {[
                           { href: '/products', label: 'Explore Shop', icon: <ShopIcon /> },
                           { href: '/about', label: 'Our Story', icon: <AboutIcon /> },
                           { href: '/contact', label: 'Contact Us', icon: <ContactIcon /> }
                         ].map((item, i) => (
                           <motion.li key={item.href} custom={i + 1} variants={itemVariants}>
                             <Link 
                               href={item.href} 
                               className="flex items-center justify-between p-4 rounded-xl hover:bg-cream/[0.03] text-cream/70 hover:text-cream transition-all group border border-transparent hover:border-white/5"
                               onClick={() => setIsOpen(false)}
                             >
                               <div className="flex items-center gap-4">
                                 <div className="text-cream/20 group-hover:text-accent transition-colors">{item.icon}</div>
                                 <span className="text-base font-medium tracking-tight">{item.label}</span>
                               </div>
                               <ChevronIcon />
                             </Link>
                           </motion.li>
                         ))}
                       </ul>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                       <ul className="space-y-2">
                         {user ? (
                           <>
                            <motion.li custom={5} variants={itemVariants}>
                               <Link href="/account" className="flex items-center justify-between p-4 rounded-xl hover:bg-cream/[0.03] text-cream/70 hover:text-cream transition-all group" onClick={() => setIsOpen(false)}>
                                 <div className="flex items-center gap-4">
                                   <div className="text-cream/20 group-hover:text-accent/60 transition-colors"><UserIcon /></div>
                                   <span className="text-[13px] uppercase tracking-[0.2em] font-medium">Dashboard</span>
                                 </div>
                                 <ChevronIcon />
                               </Link>
                            </motion.li>
                            <motion.li custom={6} variants={itemVariants}>
                               <form action={signOutUser}>
                                 <button type="submit" className="flex items-center gap-4 p-4 rounded-xl w-full hover:bg-accent/[0.03] text-accent/60 hover:text-accent transition-all">
                                   <LogoutIcon />
                                   <span className="text-[13px] uppercase tracking-[0.2em] font-medium">Sign Out</span>
                                 </button>
                               </form>
                            </motion.li>
                           </>
                         ) : (
                           <>
                            <motion.li custom={5} variants={itemVariants}>
                               <Link href="/login" className="flex items-center justify-between p-4 rounded-xl hover:bg-cream/[0.03] text-cream/70 group" onClick={() => setIsOpen(false)}>
                                 <div className="flex items-center gap-4">
                                   <div className="text-cream/20 group-hover:text-accent/60 transition-colors"><UserIcon /></div>
                                   <span className="text-[13px] uppercase tracking-[0.2em] font-medium">Member Login</span>
                                 </div>
                                 <ChevronIcon />
                               </Link>
                            </motion.li>
                            <motion.li custom={6} variants={itemVariants}>
                               <a 
                                 href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 className="flex items-center gap-4 p-4 rounded-xl bg-accent/[0.05] text-accent border border-accent/20" 
                                 onClick={() => setIsOpen(false)}
                               >
                                 <ContactIcon />
                                 <span className="text-[13px] uppercase tracking-[0.2em] font-bold">WhatsApp Community</span>
                               </a>
                            </motion.li>
                           </>
                         )}
                       </ul>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-7 pb-10 border-t border-white/5 space-y-6 bg-ink/40">
                   <Link 
                     href="/cart" 
                     className="flex items-center justify-between p-4 rounded-xl bg-accent text-ink font-bold shadow-lg shadow-accent/10 active:scale-95 transition-transform"
                     onClick={() => setIsOpen(false)}
                   >
                     <div className="flex items-center gap-3">
                       <BagIcon className="h-5 w-5" />
                       <span className="text-sm uppercase tracking-wider">Checkout Now</span>
                     </div>
                     <div className="bg-ink/10 px-3 py-0.5 rounded-full text-xs font-mono">
                       <CartCount />
                     </div>
                   </Link>
                   <div className="flex items-center justify-between px-2">
                      <p className="text-[9px] uppercase tracking-[0.4em] text-cream/20 font-bold">7S © 2026</p>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                        <span className="text-[9px] text-cream/40 uppercase font-bold tracking-[0.3em]">Operational</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
