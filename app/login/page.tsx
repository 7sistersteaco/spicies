'use client';

import { useFormState } from 'react-dom';
import { signInUser, type AuthState } from '@/app/actions/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Link from 'next/link';

const initialState: AuthState = { ok: false };

export default function LoginPage() {
  const [state, formAction] = useFormState(signInUser, initialState);

  return (
    <Section className="min-h-[80vh] flex items-center justify-center pt-24">
      <Container size="shrunken">
        <div className="lux-surface p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-cream">Sign In</h1>
            <p className="text-cream/60">Access your account to manage your orders and tea history.</p>
          </div>

          <form action={formAction} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {state.error && (
              <p className="text-sm text-accent text-center">{state.error}</p>
            )}

            <Button type="submit" className="w-full h-14 text-lg">
              Sign In
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-cream/40">
              Don't have an account?{' '}
              <Link href="/signup" className="text-accent hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
