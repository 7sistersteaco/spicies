'use client';

import React from 'react';
import { LucideIcon, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] p-12 text-center animate-in fade-in zoom-in duration-700 ${className}`}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border border-white/5 text-accent shadow-[0_0_30px_rgba(234,179,8,0.1)]">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      
      <div className="mt-8 max-w-sm space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-cream">{title}</h3>
        <p className="text-sm leading-relaxed text-cream/40">{description}</p>
      </div>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="mt-10">
          {actionHref ? (
            <Button href={actionHref} className="h-12 px-8 text-xs uppercase tracking-widest gap-2">
              <Plus size={16} /> {actionLabel}
            </Button>
          ) : (
            <Button onClick={onAction} className="h-12 px-8 text-xs uppercase tracking-widest gap-2">
              <Plus size={16} /> {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
