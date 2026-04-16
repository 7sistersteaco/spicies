'use client';

import { useFormState } from 'react-dom';
import { signUpUser, type AuthState } from '@/app/actions/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Link from 'next/link';

const initialState: AuthState = { ok: false };

export default function SignupPage() {
  const [state, formAction] = useFormState(signUpUser, initialState);

  return (
    <Section className="min-h-[90vh] flex items-center justify-center pt-24 pb-12">
      <Container size="shrunken">
        <div className="lux-surface p-8 md:p-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-cream">Create Your Account</h1>
            <p className="text-cream/60">Join the 7 Sisters Tea & Co. community for a premium tea experience.</p>
          </div>

          <form action={formAction} className="space-y-5">
            <div className="space-y-4">
              <Input
                label="Full Name"
                name="full_name"
                placeholder="Your Name"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="name@email.com"
                required
              />
              <Input
                label="Phone"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
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

            <div className="pt-2">
              <Button type="submit" className="w-full h-14 text-lg">
                Create Account
              </Button>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-cream/5">
            <p className="text-sm text-cream/40">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
