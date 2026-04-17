'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, ShoppingBag, MessageSquare, CreditCard, ChevronRight, Clock, CheckCheck } from 'lucide-react';
import { fetchNotifications, fetchUnreadCount, markAsRead } from '@/app/actions/notifications';
import type { AdminNotification } from '@/lib/notifications/queries';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial unread count fetch
    const getCount = async () => {
      const count = await fetchUnreadCount();
      setUnreadCount(count);
    };
    getCount();

    // Auto-refresh unread count every 60 seconds
    const interval = setInterval(getCount, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  async function handleToggle() {
    if (!isOpen) {
      setIsLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
      setIsLoading(false);
    }
    setIsOpen(!isOpen);
  }

  async function handleMarkAllAsRead() {
    await markAsRead();
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'new_order': return <ShoppingBag size={14} className="text-green-400" />;
      case 'new_prebook': return <MessageSquare size={14} className="text-accent" />;
      case 'payment_success': return <CreditCard size={14} className="text-blue-400" />;
      default: return <Clock size={14} className="text-cream/40" />;
    }
  };

  const getLink = (notif: AdminNotification) => {
    if (!notif.reference_id) return '/admin';
    if (notif.type === 'new_prebook') return `/admin?q=${notif.reference_id}`;
    return `/admin/orders/${notif.reference_id}`;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger */}
      <button 
        onClick={handleToggle}
        className="relative p-2 text-cream/40 transition-colors hover:text-cream group"
      >
        <Bell size={20} className={isOpen ? 'text-accent' : 'group-hover:rotate-12 transition-transform'} />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent animate-pulse" />
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-4 w-[calc(100vw-2rem)] sm:w-80 lg:w-96 rounded-2xl border border-white/5 bg-ink/95 shadow-2xl backdrop-blur-2xl z-[60] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-5 py-4">
              <div className="space-y-0.5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-cream">Notifications</h3>
                <p className="text-[10px] text-cream/30 uppercase tracking-widest leading-none">Recent Activity</p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-accent hover:text-accent/80 transition-colors"
                >
                  <CheckCheck size={12} />
                  Mark Read
                </button>
              )}
            </div>

            {/* Content Body */}
            <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] text-cream/20 uppercase tracking-[0.2em]">Synchronizing...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                   <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-cream/10">
                      <Bell size={24} />
                   </div>
                   <p className="text-xs font-medium text-cream/60">No new notifications</p>
                   <p className="text-[10px] text-cream/20 uppercase tracking-widest mt-1">Check back later</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notif) => (
                    <Link 
                      key={notif.id}
                      href={getLink(notif)}
                      onClick={() => setIsOpen(false)}
                      className={`flex gap-4 p-5 transition-all hover:bg-white/[0.03] relative group ${!notif.is_read ? 'bg-accent/[0.01]' : ''}`}
                    >
                      <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                        !notif.is_read ? 'bg-accent/10 border-accent/20' : 'bg-white/5 border-white/5'
                      }`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                         <div className="flex items-start justify-between">
                            <h4 className={`text-xs ${!notif.is_read ? 'font-bold text-cream' : 'font-medium text-cream/60'}`}>
                              {notif.title}
                            </h4>
                            {!notif.is_read && <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1 flex-shrink-0" />}
                         </div>
                         <p className="text-[11px] leading-relaxed text-cream/40 line-clamp-2">{notif.message}</p>
                         <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1 text-[9px] text-cream/20 uppercase tracking-widest">
                               <Clock size={10} />
                               {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                            </div>
                            <ChevronRight size={10} className="text-cream/10 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                         </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-white/5 bg-white/[0.01] px-5 py-3">
                 <Link 
                   href="/admin/orders" 
                   onClick={() => setIsOpen(false)}
                   className="block text-center text-[9px] uppercase tracking-[0.2em] text-cream/30 hover:text-accent transition-colors"
                 >
                   View All Activity
                 </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
