'use client';

import { useState } from 'react';
import { submitContactMessage } from '@/app/actions/contact';

type Props = { waUrl: string };

const topics = [
  { value: '', label: 'Select a topic' },
  { value: 'order', label: 'Order / Pre-order Query' },
  { value: 'wholesale', label: 'Wholesale / Bulk Pricing' },
  { value: 'product', label: 'Product Information' },
  { value: 'other', label: 'Other' }
];

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm({ waUrl }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '', phone: '', email: '', topic: '', message: ''
  });

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const res = await submitContactMessage({
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      topic: form.topic || undefined,
      message: form.message
    });

    if (res.ok) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMsg(res.error || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-10 flex flex-col items-center text-center gap-5">
        <div className="h-14 w-14 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-cream">Message received!</h3>
          <p className="text-sm text-cream/55 max-w-xs leading-relaxed">
            We've got your message and will get back to you personally — usually within a few hours.
          </p>
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-accent/25 px-6 py-2.5 text-[10px] uppercase tracking-widest text-accent font-bold hover:bg-accent/10 transition-all"
        >
          Also ping us on WhatsApp
        </a>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', phone: '', email: '', topic: '', message: '' }); }}
          className="text-[10px] text-cream/30 hover:text-cream/60 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-8 md:p-10 space-y-7">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-cream">Send us a message</h2>
        <p className="text-xs text-cream/40">We'll get back to you personally — usually within a few hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.3em] text-cream/50 font-semibold">
              Full Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.03] transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-[0.3em] text-cream/50 font-semibold">
              Phone <span className="text-accent">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              required
              className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.03] transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.3em] text-cream/50 font-semibold">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.03] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.3em] text-cream/50 font-semibold">Topic</label>
          <select
            value={form.topic}
            onChange={e => set('topic', e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-cream focus:outline-none focus:border-accent/40 transition-all"
          >
            {topics.map(t => (
              <option key={t.value} value={t.value} className="bg-zinc-900">{t.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-[0.3em] text-cream/50 font-semibold">
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            value={form.message}
            onChange={e => set('message', e.target.value)}
            rows={4}
            placeholder="How can we help you?"
            required
            className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.03] transition-all resize-none"
          />
        </div>

        {status === 'error' && (
          <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-accent text-ink px-6 py-3.5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-accent/90 transition-all duration-300 shadow-lg shadow-accent/15 disabled:opacity-60"
        >
          {status === 'sending' ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending…
            </>
          ) : (
            'Send Message'
          )}
        </button>

        <p className="text-center text-[10px] text-cream/25">
          We'll reply via WhatsApp or email within a few hours.
        </p>
      </form>
    </div>
  );
}
