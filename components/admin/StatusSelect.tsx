'use client';

import { useRef } from 'react';
import { setPrebookStatus } from '@/app/actions/admin';
import type { PrebookStatus } from '@/lib/prebook/types';

const options: PrebookStatus[] = ['new', 'contacted', 'confirmed', 'fulfilled'];

export default function StatusSelect({ id, status }: { id: string; status: PrebookStatus }) {
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <form action={setPrebookStatus} ref={formRef}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-lg border border-cream/10 bg-cream/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-ink"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </form>
  );
}
