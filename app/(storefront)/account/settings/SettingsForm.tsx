'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { updateProfile, updateEmail, updatePassword } from '@/app/actions/account';
import ReauthModal from '@/components/auth/ReauthModal';
import { ShieldCheck, Mail, Lock, User as UserIcon, CheckCircle2, ChevronLeft } from 'lucide-react';

type Props = {
  customer: {
    full_name: string;
    phone: string;
    email: string;
  };
};

export default function SettingsForm({ customer }: Props) {
  const [profileState, profileAction] = useFormState(updateProfile, { ok: false, error: '' });
  
  // States for sensitive actions
  const [reauthType, setReauthType] = useState<'email' | 'password' | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPwd, setNewPwd] = useState({ password: '', confirm: '' });
  const [sensitiveMsg, setSensitiveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSensitiveVerified() {
    setIsProcessing(true);
    setSensitiveMsg(null);
    
    try {
      if (reauthType === 'email') {
        const result = await updateEmail(newEmail);
        setSensitiveMsg({ ok: result.ok, text: result.message || result.error || 'Update failed' });
        if (result.ok) setNewEmail('');
      } else if (reauthType === 'password') {
        const formData = new FormData();
        formData.append('password', newPwd.password);
        formData.append('confirm', newPwd.confirm);
        const result = await updatePassword(formData);
        setSensitiveMsg({ ok: result.ok, text: result.message || result.error || 'Update failed' });
        if (result.ok) setNewPwd({ password: '', confirm: '' });
      }
    } catch (err) {
      setSensitiveMsg({ ok: false, text: 'An unexpected error occurred.' });
    } finally {
      setIsProcessing(false);
      setReauthType(null);
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ReauthModal 
        isOpen={!!reauthType}
        onClose={() => setReauthType(null)}
        onVerified={handleSensitiveVerified}
        title={reauthType === 'email' ? 'Change Email Verification' : 'Change Password Verification'}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-cream">Profile Settings</h2>
          <p className="text-sm text-cream/40">Manage your personal information and security preferences.</p>
        </div>
        <Link href="/account">
          <Button variant="secondary" size="sm" className="hidden sm:flex gap-2">
            <ChevronLeft size={14} /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Profile Details Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="lux-surface p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <UserIcon className="text-accent" size={18} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-cream">Personal Information</h3>
            </div>

            <form action={profileAction} className="grid gap-6 md:grid-cols-2">
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
              
              <div className="md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-white/5 mt-2">
                {profileState.error && <p className="text-xs text-accent">{profileState.error}</p>}
                {profileState.ok && <p className="text-xs text-green-400 font-medium">Profile updated successfully!</p>}
                <Button type="submit" className="px-10 ml-auto h-12">Save Profile</Button>
              </div>
            </form>
          </div>

          {/* Security & sensitive section */}
          <div className="lux-surface p-8 space-y-10">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <ShieldCheck className="text-accent" size={18} />
              <h3 className="text-sm font-bold uppercase tracking-widest text-cream">Identity & Security</h3>
            </div>

            {sensitiveMsg && (
               <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in zoom-in duration-300 ${
                 sensitiveMsg.ok ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-accent/10 border-accent/20 text-accent'
               }`}>
                 {sensitiveMsg.ok ? <CheckCircle2 size={16} /> : <ShieldCheck size={16} />}
                 <p className="text-xs font-medium">{sensitiveMsg.text}</p>
               </div>
            )}

            {/* Email Change Section */}
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-cream underline decoration-accent/30 underline-offset-4">Primary Email</p>
                <p className="text-[10px] text-cream/40 uppercase tracking-widest">Changing your email will require re-verification of the new address.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <Input
                    label="New Email Address"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email"
                  />
                </div>
                <Button 
                  onClick={() => setReauthType('email')}
                  disabled={!newEmail || isProcessing}
                  variant="secondary"
                  className="h-12 px-8 whitespace-nowrap"
                >
                  Change Email
                </Button>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="space-y-6 pt-6 border-t border-white/5">
              <div className="space-y-1">
                 <p className="text-xs font-bold text-cream underline decoration-accent/30 underline-offset-4">Security Credentials</p>
                 <p className="text-[10px] text-cream/40 uppercase tracking-widest">Update your password to a new secure one.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="New Password"
                  type="password"
                  value={newPwd.password}
                  onChange={(e) => setNewPwd(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="New password"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={newPwd.confirm}
                  onChange={(e) => setNewPwd(prev => ({ ...prev, confirm: e.target.value }))}
                  placeholder="Repeat password"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setReauthType('password')}
                  disabled={!newPwd.password || !newPwd.confirm || isProcessing}
                  variant="secondary"
                  className="h-12 px-8 whitespace-nowrap w-full sm:w-auto"
                >
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="lux-surface p-6 space-y-4 bg-accent/[0.02] border-accent/10">
              <div className="flex items-center gap-3 text-accent mb-2">
                 <Lock size={16} />
                 <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] leading-none">Why Re-verify?</h4>
              </div>
              <p className="text-[11px] leading-relaxed text-cream/50">
                To protect your account from unauthorized changes, we require you to verify your identity with your current password before updating sensitive details like email or credentials.
              </p>
           </div>

           <div className="lux-surface p-6 space-y-4">
              <div className="flex items-center gap-3 text-cream/40 mb-2">
                 <Mail size={16} />
                 <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] leading-none">Email Verification</h4>
              </div>
              <p className="text-[11px] leading-relaxed text-cream/40">
                When you change your email, Supabase sends a confirmation link to both your **old** and **new** address. The change only applies once both links are clicked.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
