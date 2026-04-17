'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'primary',
  isLoading = false
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      showCloseButton={!isLoading}
      footer={
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none h-11 px-6 text-[10px] uppercase tracking-widest border-white/5 hover:bg-white/5"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'primary' : variant === 'warning' ? 'secondary' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className={`flex-1 sm:flex-none h-11 px-8 text-[10px] uppercase tracking-widest ${
               variant === 'danger' ? 'bg-red-500 hover:bg-red-600 border-none' : ''
            }`}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <div className={`mt-0.5 ${variant === 'danger' ? 'text-red-400' : 'text-accent'}`}>
          <AlertCircle size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-cream/80">Safety Warning</p>
          <p className="text-[11px] leading-relaxed text-cream/40">
            {variant === 'danger' 
              ? 'This action is permanent and cannot be undone. Please ensure you have backed up any critical data.'
              : 'Please review the details above before proceeding with this administrative change.'}
          </p>
        </div>
      </div>
    </Modal>
  );
}
