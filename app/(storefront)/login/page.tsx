'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { signInUser, signInWithMagicLink, type AuthState } from '@/app/actions/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Link from 'next/link';
import { Mail, ShieldCheck, Key } from 'lucide-react';

const initialState: AuthState = { ok: false };

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'password' | 'magic'>('password');
  const [pwdState, pwdAction] = useFormState(signInUser, initialState);
  const [magicState, magicAction] = useFormState(signInWithMagicLink, initialState);

  const activeState = authMethod === 'password' ? pwdState : magicState;
  const activeAction = authMethod === 'password' ? pwdAction : magicAction;

  return (
    <Section className="min-h-[80vh] flex items-center justify-center pt-24 pb-12">
      <Container size="shrunken">
        <div className="lux-surface p-8 md:p-12 space-y-8 relative overflow-hidden">
          {/* Background Highlight */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center space-y-2 relative">
            <h1 className="text-3xl font-bold tracking-tight text-cream">Welcome Back</h1>
            <p className="text-cream/60">Choose your preferred way to access your account.</p>
          </div>

          {/* Auth Method Toggle */}
          <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
            <button
              onClick={() => setAuthMethod('password')}
              className={`flex-1 py-3 text-[10px] uppercase tracking-[0.2em] font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMethod === 'password' ? 'bg-accent text-ink shadow-lg' : 'text-cream/40 hover:text-cream/60'
              }`}
            >
              <Key size={14} /> Password
            </button>
            <button
              onClick={() => setAuthMethod('magic')}
              className={`flex-1 py-3 text-[10px] uppercase tracking-[0.2em] font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                authMethod === 'magic' ? 'bg-accent text-ink shadow-lg' : 'text-cream/40 hover:text-cream/60'
              }`}
            >
              <Mail size={14} /> Magic Link
            </button>
          </div>

          {!activeState.ok ? (
            <form action={activeAction} className="space-y-6 relative">
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
                
                {authMethod === 'password' && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center pr-1">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-cream/40 font-semibold block ml-1">Password</label>
                      <Link href="/forgot-password" className="text-[10px] uppercase tracking-widest text-accent hover:underline">
                        Forgot?
                      </Link>
                    </div>
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                )}
              </div>

              {activeState.error && (
                <p className="text-sm text-accent text-center bg-accent/10 py-3 rounded-lg border border-accent/20">
                  {activeState.error}
                </p>
              )}

              <Button type="submit" className="w-full h-14 text-lg">
                {authMethod === 'password' ? 'Sign In' : 'Send Magic Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in duration-500">
               <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent border border-accent/20">
                 <Mail size={32} />
               </div>
               <div className="space-y-2 px-4">
                 <p className="text-lg font-medium text-cream">{activeState.message}</p>
                 <p className="text-sm text-cream/40 leading-relaxed">Check your inbox for the secure login link. The link will expire in 24 hours.</p>
               </div>
            </div>
          )}

          <div className="text-center pt-4 relative">
            <p className="text-sm text-cream/40">
              Don't have an account?{' '}
              <Link href="/signup" className="text-accent font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
