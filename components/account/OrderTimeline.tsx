'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ORDER_STATUS_STEPS, ORDER_STATUS_LABELS, type OrderStatus } from '@/lib/orders/types';

interface OrderTimelineProps {
  status: OrderStatus;
  isPreOrder?: boolean;
  history?: any[];
}

export default function OrderTimeline({ status, isPreOrder, history }: OrderTimelineProps) {
  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(status);
  const activeIndex = currentStepIndex === -1 ? -1 : currentStepIndex;

  // Map history to steps for timestamp display
  const stepHistory = (history || []).filter(h => ORDER_STATUS_STEPS.includes(h.new_status as OrderStatus));

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-cream/10" />
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-accent"
          initial={{ width: 0 }}
          animate={{ 
            width: activeIndex <= 0 ? '0%' : `${(activeIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%` 
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {ORDER_STATUS_STEPS.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;
            
            // Find timestamp for this step from history or order creation
            const historyItem = stepHistory.find(h => h.new_status === step);
            const timestamp = historyItem?.created_at;

            return (
              <div key={step} className="flex flex-col items-center gap-4">
                <div className="relative z-10 flex items-center justify-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isCompleted || isActive ? 'var(--color-accent)' : 'rgb(var(--color-bg-rgb))',
                      borderColor: isCompleted || isActive ? 'var(--color-accent)' : 'rgb(var(--color-border-rgb) / 0.2)',
                    }}
                    className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-colors duration-500`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-ink" />
                    ) : (
                      <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-ink animate-pulse' : 'bg-cream/20'}`} />
                    )}
                  </motion.div>
                </div>
                
                <div className="flex flex-col items-center max-w-[80px]">
                  <p className={`text-[9px] uppercase tracking-[0.2em] font-bold text-center transition-colors duration-500 ${
                    isActive ? 'text-accent' : isCompleted ? 'text-cream/80' : 'text-cream/30'
                  }`}>
                    {ORDER_STATUS_LABELS[step]}
                  </p>
                  {timestamp && (
                    <p className="text-[8px] text-cream/40 mt-1 font-mono">
                      {new Date(timestamp).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Active Status Note */}
      {status === 'cancelled' && (
        <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-red-500">Order Cancelled</p>
        </div>
      )}
      {status === 'refunded' && (
        <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
          <p className="text-xs uppercase tracking-widest font-bold text-blue-500">Order Refunded</p>
        </div>
      )}
    </div>
  );
}
