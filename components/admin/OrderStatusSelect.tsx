'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { setOrderStatus } from '@/app/actions/orders';
import { type OrderStatus, ORDER_STATUS_STEPS, ORDER_STATUS_LABELS } from '@/lib/orders/types';

export default function OrderStatusSelect({ id, current }: { id: string; current: OrderStatus }) {
  const [value, setValue] = useState<OrderStatus>(current);
  const { showToast } = useToast();

  const handleAction = async (formData: FormData) => {
    const result = await setOrderStatus(formData);
    if (result?.ok) {
      showToast(result.message || 'Status updated', 'success');
    } else {
      showToast(result?.error || 'Update failed', 'error');
      setValue(current); // Reset on error
    }
  };

  // Standard flow options + special states
  const selectOptions: OrderStatus[] = [...ORDER_STATUS_STEPS, 'cancelled', 'refunded'];

  return (
    <form action={handleAction} className="space-y-1">
      <label className="text-[9px] uppercase tracking-[0.3em] text-cream/50 font-bold ml-1">Order Status</label>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        className="w-full md:w-auto rounded-lg border border-cream/10 bg-cream/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-ink"
        value={value}
        onChange={(event) => {
          const newValue = event.target.value as OrderStatus;
          setValue(newValue);
          const form = event.currentTarget.form;
          if (form) {
            form.requestSubmit();
          }
        }}
      >
        {selectOptions.map((option) => (
          <option key={option} value={option}>
            {ORDER_STATUS_LABELS[option] || option}
          </option>
        ))}
      </select>
    </form>
  );
}
