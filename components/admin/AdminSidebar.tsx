'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  Menu, 
  X,
  MessageSquare,
  ChevronRight,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type MenuItem = {
  name: string;
  icon: any;
  href: string;
  disabled?: boolean;
};

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/analytics' },
  { name: 'Inbox', icon: Mail, href: '/admin/messages' },
  { name: 'Pre-orders', icon: MessageSquare, href: '/admin' },
  { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Customers', icon: Users, href: '/admin/customers' },
  { name: 'Branding', icon: Settings, href: '/admin/branding' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-[60] lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-ink border border-white/10 text-cream shadow-lg"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 hidden w-64 border-r border-white/5 bg-ink/50 backdrop-blur-xl lg:block">
        <div className="flex h-full flex-col p-6">
          <div className="mb-10 px-2">
            <h2 className="text-lg font-semibold tracking-tight text-cream">7 Sisters</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium">Internal Dashboard</p>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.disabled ? '#' : item.href}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : item.disabled
                      ? 'opacity-40 cursor-not-allowed grayscale'
                      : 'text-cream/50 hover:bg-white/5 hover:text-cream'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                    />
                  )}
                  {item.disabled && (
                    <span className="text-[8px] uppercase tracking-wider text-accent/60">Soon</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
             <Link 
               href="/" 
               className="flex items-center gap-2 px-4 py-2 text-xs text-cream/40 hover:text-cream transition-colors"
             >
               <ChevronRight size={14} className="rotate-180" />
               View Storefront
             </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[55] bg-ink/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-[56] w-72 bg-ink border-r border-white/10 p-6 lg:hidden"
            >
              <div className="mb-10 px-2 pt-10 lg:pt-0">
                <h2 className="text-xl font-semibold tracking-tight text-cream">7 Sisters</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">Internal Dashboard</p>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.disabled ? '#' : item.href}
                      onClick={() => !item.disabled && setIsOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-4 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-accent/10 text-accent'
                          : item.disabled
                          ? 'opacity-40 cursor-not-allowed'
                          : 'text-cream/50 hover:bg-white/5 hover:text-cream'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
