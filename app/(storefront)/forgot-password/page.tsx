'use client';

import { useFormState } from 'react-dom';
import { requestPasswordReset, type AuthState } from '@/app/actions/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Link from 'next/link';
import { ChevronLeft, Mail } from 'lucide-react';

const initialState: AuthState = { ok: false };

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(requestPasswordReset, initialState);

  return (
    <Section className="min-h-[80vh] flex items-center justify-center pt-24">
      <Container size="shrunken">
        <div className="lux-surface p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-cream">Reset Password</h1>
            <p className="text-cream/60">Enter your email and we'll send you a link to get back into your account.</p>
          </div>

          {!state.ok ? (
            <form action={formAction} className="space-y-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />

              {state.error && (
                <p className="text-sm text-accent text-center bg-accent/10 py-3 rounded-lg border border-accent/20">
                  {state.error}
                </p>
              )}

              <Button type="submit" className="w-full h-14 text-lg">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent border border-accent/20">
                <Mail size={32} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-cream">{state.message}</p>
                <p className="text-sm text-cream/40">It might take a few minutes. Don't forget to check your spam folder.</p>
              </div>
            </div>
          )}

          <div className="text-center pt-4 border-t border-white/5">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-cream/40 hover:text-accent transition-colors">
              <ChevronLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
