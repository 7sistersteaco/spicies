'use client';

import { useState } from 'react';
import { updateFssaiLicenseNumber } from '@/app/actions/branding';
import BrandingUpload from './BrandingUpload';

type Props = {
  licenseNumber: string | null;
  certificateUrl: string | null;
};

export default function FssaiSection({ licenseNumber, certificateUrl }: Props) {
  const [value, setValue] = useState(licenseNumber ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    const fd = new FormData();
    fd.append('fssai_license_number', value);
    const res = await updateFssaiLicenseNumber(fd);
    setStatus(res.ok ? 'saved' : 'error');
    setTimeout(() => setStatus('idle'), 2500);
  }

  return (
    <div className="space-y-8">
      {/* License Number */}
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-cream">FSSAI License Number</p>
          <p className="text-[10px] text-cream/40">Displayed in the storefront footer and compliance page.</p>
        </div>
        <form onSubmit={handleSave} className="flex items-center gap-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 11223344556677"
            maxLength={14}
            className="flex-1 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-accent/40 transition-all font-mono tracking-wider"
          />
          <button
            type="submit"
            disabled={status === 'saving'}
            className="shrink-0 rounded-xl bg-accent text-ink px-5 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-accent/90 transition-all disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved' : status === 'error' ? 'Error' : 'Save'}
          </button>
        </form>
      </div>

      {/* Certificate Image */}
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-cream">FSSAI Certificate Image</p>
          <p className="text-[10px] text-cream/40">Upload a scan or photo of your FSSAI registration certificate. Shown on the /compliance page only if uploaded.</p>
        </div>
        <BrandingUpload
          type="fssai_certificate"
          currentUrl={certificateUrl}
          fallbackUrl=""
        />
      </div>
    </div>
  );
}
