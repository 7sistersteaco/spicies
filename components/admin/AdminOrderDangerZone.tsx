'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive } from 'lucide-react';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { archiveOrder } from '@/app/actions/orders';
import { useToast } from '@/components/ui/Toast';

interface AdminOrderDangerZoneProps {
  orderId: string;
  orderCode: string;
}

export default function AdminOrderDangerZone({ orderId, orderCode }: AdminOrderDangerZoneProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      const result = await archiveOrder(orderId);
      if (result.ok) {
        showToast(`Order ${orderCode} archived successfully.`, 'success');
        router.push('/admin/orders');
      } else {
        showToast(result.error || 'Failed to archive order.', 'error');
      }
    } catch (error) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setIsArchiving(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 space-y-4">
        <div className="flex items-center gap-3 text-cream/40">
          <Archive size={16} />
          <h3 className="text-[10px] font-semibold uppercase tracking-widest leading-none">Record Management</h3>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] leading-relaxed text-cream/40 italic">
            Archiving removes this order from active lists while preserving financial data.
          </p>

          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="outline" 
            className="w-full h-10 border-white/5 text-cream/60 hover:text-orange-400 hover:bg-orange-400/5 hover:border-orange-400/20 text-[10px] uppercase tracking-widest font-semibold"
          >
            Archive Order
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleArchive}
        isLoading={isArchiving}
        title="Archive Order?"
        description={`Are you sure you want to archive order ${orderCode}? It will be hidden from the active orders dashboard.`}
        confirmLabel="Archive Record"
        variant="warning"
      />
    </>
  );
}
