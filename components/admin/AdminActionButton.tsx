'use client';

import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import { useState } from 'react';

interface AdminActionButtonProps {
  action: (formData: FormData) => Promise<{ ok: boolean; message?: string; error?: string } | void>;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  formData?: Record<string, string>;
}

export default function AdminActionButton({
  action,
  children,
  variant,
  size,
  className,
  formData = {}
}: AdminActionButtonProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
      
      const result = await action(fd);
      if (result && typeof result === 'object') {
        if (result.ok) {
          showToast(result.message || 'Action successful', 'success');
        } else {
          showToast(result.error || 'Action failed', 'error');
        }
      } else {
        // Fallback for actions that return void (though we standardized them)
        showToast('Action processed', 'success');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAction}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Processing...
        </div>
      ) : children}
    </Button>
  );
}
