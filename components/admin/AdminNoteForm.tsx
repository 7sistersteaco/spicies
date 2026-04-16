'use client';

import { useState } from 'react';
import { addOrderNote } from '@/app/actions/orders';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import TextArea from '@/components/ui/TextArea';

export default function AdminNoteForm({ orderId }: { orderId: string }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    try {
      const result = await addOrderNote(formData);
      if (result?.ok) {
        showToast(result.message || 'Note added', 'success');
        (event.target as HTMLFormElement).reset();
      } else {
        showToast(result?.error || 'Failed to add note', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <input type="hidden" name="id" value={orderId} />
      <TextArea
        label="Internal Note"
        name="note"
        placeholder="Add internal note..."
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Note'}
      </Button>
    </form>
  );
}
