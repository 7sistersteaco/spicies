'use client';

import { useState } from 'react';
import { setPaymentStatus } from '@/app/actions/orders';
import { useToast } from '@/components/ui/Toast';

const options = ['pending', 'paid', 'failed', 'refunded'];

export default function PaymentStatusSelect({ id, current }: { id: string; current: string }) {
  const [value, setValue] = useState(current);
  const { showToast } = useToast();

  const handleAction = async (formData: FormData) => {
    const result = await setPaymentStatus(formData);
    if (result?.ok) {
      showToast(result.message || 'Payment status updated', 'success');
    } else {
      showToast(result?.error || 'Update failed', 'error');
      setValue(current); // Reset on error
    }
  };

  return (
    <form action={handleAction} className="space-y-1">
      <label className="text-[9px] uppercase tracking-[0.3em] text-cream/50 font-bold ml-1">Payment Status</label>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        className="w-full md:w-auto rounded-lg border border-cream/10 bg-cream/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-ink"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          const form = event.currentTarget.form;
          if (form) {
            form.requestSubmit();
          }
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replace('_', ' ')}
          </option>
        ))}
      </select>
    </form>
  );
}
