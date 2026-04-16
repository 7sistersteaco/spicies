'use client';

import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { loginAdmin, type AdminLoginState } from '@/app/actions/admin';

const initialState: AdminLoginState = { ok: false };

export default function AdminLoginForm() {
  const [state, formAction] = useFormState(loginAdmin, initialState);

  useEffect(() => {
    if (state.ok) {
      window.location.reload();
    }
  }, [state.ok]);

  return (
    <form action={formAction} className="mx-auto w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-charcoal/60 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Admin Authentication</p>
      <h1 className="text-2xl font-semibold">Secure Login</h1>
      <div className="space-y-4">
        <Input label="Email" name="email" type="email" placeholder="admin@7sisters.com" required />
        <Input label="Password" name="password" type="password" placeholder="••••••••" required />
      </div>
      {state.error && <p className="text-xs text-accent">{state.error}</p>}
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  );
}
