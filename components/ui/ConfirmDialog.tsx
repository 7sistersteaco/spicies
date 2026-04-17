'use client';

import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary'
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      showCloseButton={!isConfirming}
      footer={
        <div className="flex w-full flex-col sm:flex-row sm:justify-end gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isConfirming}
            className="sm:order-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'primary' : 'primary'} // Adjusted to brand primary, danger uses same style but maybe red border?
            className={`${variant === 'danger' ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white border' : ''} sm:order-2 min-w-[100px]`}
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </div>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      }
    />
  );
}
