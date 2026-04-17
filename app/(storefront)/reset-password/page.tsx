'use client';

import { useFormState } from 'react-dom';
import { updatePassword, type AuthState } from '@/app/actions/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

const initialState: AuthState = { ok: false };

export default function ResetPasswordPage() {
  const [state, formAction] = useFormState(updatePassword, initialState);

  return (
    <Section className="min-h-[80vh] flex items-center justify-center pt-24">
      <Container size="shrunken">
        <div className="lux-surface p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-cream">New Password</h1>
            <p className="text-cream/60">Almost there! Choose a secure password for your account.</p>
          </div>

          {!state.ok ? (
            <form action={formAction} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="New Password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  required
                />
                <Input
                  label="Confirm New Password"
                  name="confirm_password"
                  type="password"
                  placeholder="Repeat new password"
                  required
                />
              </div>

              {state.error && (
                <p className="text-sm text-accent text-center bg-accent/10 py-3 rounded-lg border border-accent/20">
                  {state.error}
                </p>
              )}

              <Button type="submit" className="w-full h-14 text-lg">
                Update Password
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4 animate-in fade-in scale-in-95 duration-500">
              <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto text-green-400 border border-green-400/20">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-cream">{state.message}</p>
                <p className="text-sm text-cream/40">Your security is our priority. You can now access your account with your new credentials.</p>
              </div>
              <Link href="/login" className="block pt-4">
                <Button variant="primary" className="w-full h-12">
                   Sign In Now
                </Button>
              </Link>
            </div>
          )}

          {!state.ok && (
            <div className="bg-white/5 p-4 rounded-xl flex gap-3 items-start">
               <ShieldCheck className="text-accent shrink-0 mt-0.5" size={16} />
               <p className="text-[10px] text-cream/30 uppercase tracking-widest leading-relaxed">
                 Use a combination of letters, numbers, and special characters for the strongest protection.
               </p>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
