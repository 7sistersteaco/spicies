'use client';

import { useFormState } from 'react-dom';
import { inviteNewUser } from '@/app/actions/admin';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { UserPlus, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [state, formAction] = useFormState(inviteNewUser, { ok: false, message: '', error: '' });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-cream">User Management</h1>
        <p className="text-xs text-cream/50 uppercase tracking-widest">Invite and manage administrative staff.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Invitation Form */}
        <div className="lg:col-span-7">
          <div className="lux-surface p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <UserPlus className="text-accent" size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest text-cream">Invite New Member</h2>
            </div>

            <form action={formAction} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Full Name"
                  name="full_name"
                  placeholder="John Doe"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="staff@7sisterstea.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-cream/40 font-semibold block ml-1">Access Level</label>
                <select 
                  name="role"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream outline-none focus:border-accent/40 transition-colors"
                >
                  <option value="staff">Staff (Standard Access)</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>

              {state.error && (
                <p className="text-sm text-accent bg-accent/10 p-4 rounded-xl border border-accent/20">
                  {state.error}
                </p>
              )}

              {state.ok && (
                <div className="bg-green-400/10 p-4 rounded-xl border border-green-400/20 flex items-center gap-3 text-green-400">
                  <CheckCircle2 size={16} />
                  <p className="text-xs font-medium">{state.message}</p>
                </div>
              )}

              <div className="pt-4">
                <Button type="submit" className="w-full h-12 gap-2">
                   <Mail size={16} /> Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Info & Policy Panel */}
        <div className="lg:col-span-5 space-y-6">
           <div className="lux-surface p-6 space-y-6 bg-accent/[0.02] border-accent/10">
              <div className="flex items-center gap-3 text-accent">
                <ShieldCheck size={20} />
                <h3 className="text-xs font-bold uppercase tracking-widest leading-none">Invitation Policy</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p className="text-[11px] leading-relaxed text-cream/50">
                    Invitations generate a secure link sent directly to the user's email.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p className="text-[11px] leading-relaxed text-cream/50">
                    The link will redirect the user to complete their account setup and choose a password.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <p className="text-[11px] leading-relaxed text-cream/50">
                    Staff users can manage orders and products, while Admin users have full control over branding and financials.
                  </p>
                </li>
              </ul>
           </div>

           <div className="p-6 border border-white/5 rounded-3xl space-y-2">
              <p className="text-[10px] text-cream/30 uppercase tracking-widest font-bold">Security Note</p>
              <p className="text-[11px] leading-relaxed text-cream/20 italic">
                “Never share invitation links manually. Always use this dashboard to ensure the link is bound to the correct email address for auditing.”
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
