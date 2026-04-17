'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Archive, PowerOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { deleteProduct } from '@/app/actions/products';
import { useToast } from '@/components/ui/Toast';

interface AdminProductDangerZoneProps {
  productId: string;
  productName: string;
}

export default function AdminProductDangerZone({ productId, productName }: AdminProductDangerZoneProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProduct(productId);
      if (result.ok) {
        showToast(`${productName} deactivated successfully.`, 'success');
        router.push('/admin/products');
      } else {
        showToast(result.error || 'Failed to deactivate product.', 'error');
      }
    } catch (error) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-6 space-y-4">
        <div className="flex items-center gap-3 text-red-400">
          <PowerOff size={16} />
          <h3 className="text-[10px] font-semibold uppercase tracking-widest leading-none">Decommissioning</h3>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] leading-relaxed text-cream/40 italic">
            Deactivating hides this product from all storefront categories while preserving historical sales data.
          </p>

          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="outline" 
            className="w-full h-10 border-red-500/20 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-400 text-[10px] uppercase tracking-widest font-semibold"
          >
            Deactivate Product
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Deactivate Product?"
        description={`Are you sure you want to decommission "${productName}"? This will hide it from the storefront but preserve it in the database for historical records.`}
        confirmLabel="Deactivate"
        variant="danger"
      />
    </>
  );
}
