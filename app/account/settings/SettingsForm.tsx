'use client';

import { useFormState } from 'react-dom';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { updateProfile } from '@/app/actions/account';

type Props = {
  customer: {
    full_name: string;
    phone: string;
    email: string;
  };
};

export default function SettingsForm({ customer }: Props) {
  const [state, formAction] = useFormState(updateProfile, { ok: false, error: '' });

  return (
    <div className="lux-surface p-8 md:p-12 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-cream">Profile Settings</h2>
          <p className="text-cream/60">Manage your personal information.</p>
        </div>
        <Link href="/account">
          <Button variant="secondary" size="sm">Back to Dashboard</Button>
        </Link>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Full Name"
            name="full_name"
            defaultValue={customer.full_name || ''}
            placeholder="Your name"
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            defaultValue={customer.phone || ''}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[0.3em] text-cream/40 font-semibold block ml-1">Email Address</label>
          <div className="w-full rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm text-cream/40 cursor-not-allowed">
            {customer.email}
          </div>
          <p className="text-[10px] text-cream/30 italic ml-1">Email cannot be changed.</p>
        </div>

        {state.error && (
          <p className="text-sm text-accent">{state.error}</p>
        )}
        {state.ok && (
          <p className="text-sm text-green-400">Profile updated successfully!</p>
        )}

        <div className="pt-4 flex justify-end">
          <Button type="submit" className="w-full md:w-auto px-12">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
