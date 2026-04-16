'use client';

import { useState } from 'react';
import { markNotificationSentAction } from '@/app/actions/orders';
import { getWhatsAppMessage, generateWhatsAppLink, type WhatsAppTemplate } from '@/lib/orders/whatsapp';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface OrderNotificationButtonProps {
  orderId: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  status: string;
  isInitiated: boolean;
}

const TARGET_STATUSES: string[] = ['confirmed', 'packed', 'shipped', 'delivered'];

export default function OrderNotificationButton({
  orderId,
  customerName,
  customerPhone,
  productName,
  status,
  isInitiated: initialIsInitiated
}: OrderNotificationButtonProps) {
  const [isInitiated, setIsInitiated] = useState(initialIsInitiated);
  const { showToast } = useToast();

  if (!TARGET_STATUSES.includes(status)) {
    return null;
  }

  const handleSend = async () => {
    const message = getWhatsAppMessage(status as WhatsAppTemplate, {
      customerName,
      customerPhone,
      productName
    });

    const link = generateWhatsAppLink(customerPhone, message);
    
    // Open WhatsApp
    window.open(link, '_blank');

    // Mark as initiated in DB
    const formData = new FormData();
    formData.append('id', orderId);
    formData.append('status', status);
    
    try {
      const result = await markNotificationSentAction(formData);
      if (result.ok) {
        setIsInitiated(true);
        showToast('Notification flow initiated', 'success');
      } else {
        showToast(result.error || 'Failed to log notification', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <p className="text-[9px] uppercase tracking-[0.3em] text-cream/50 font-bold ml-1">WhatsApp Notification</p>
      {isInitiated ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          Initiated
        </div>
      ) : (
        <Button 
          onClick={handleSend} 
          size="sm" 
          variant="secondary"
          className="bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-ink transition-all"
        >
          Send {status.toUpperCase()} Update
        </Button>
      )}
    </div>
  );
}
