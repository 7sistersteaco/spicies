'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  showCloseButton = true
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Accessibility: Close on Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-charcoal p-8 shadow-2xl"
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute right-6 top-6 p-2 text-cream/40 transition-colors hover:text-cream hover:bg-white/5 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            <div className="space-y-6">
              {(title || description) && (
                <div className="space-y-2">
                  {title && <h3 className="text-2xl font-semibold text-cream">{title}</h3>}
                  {description && <p className="text-cream/60 leading-relaxed">{description}</p>}
                </div>
              )}

              <div className="relative">{children}</div>

              {footer && <div className="flex justify-end gap-3 pt-4">{footer}</div>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
