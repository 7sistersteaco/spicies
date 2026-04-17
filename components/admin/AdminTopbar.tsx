'use client';

import React from 'react';
import { logoutAdmin } from '@/app/actions/admin';
import Button from '@/components/ui/Button';
import NotificationPanel from './NotificationPanel';
import { LogOut, User, Bell } from 'lucide-react';

interface AdminTopbarProps {
  userEmail?: string | null;
}

export default function AdminTopbar({ userEmail }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/5 bg-ink/50 px-4 backdrop-blur-xl lg:px-8">
      {/* Spacer for mobile hamburger */}
      <div className="w-10 lg:hidden" />
      
      <div className="flex-1 lg:flex-none">
        <div className="flex items-center gap-2 lg:hidden">
           <h1 className="text-sm font-semibold tracking-tight text-cream">Admin Panel</h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <NotificationPanel />

        <div className="flex items-center gap-4 pl-6 border-l border-white/5">
          <div className="hidden flex-col items-end gap-0.5 lg:flex">
            <span className="text-xs font-medium text-cream">{userEmail || 'Administrator'}</span>
            <span className="text-[10px] text-accent uppercase tracking-wider">Access Level: Manager</span>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-cream/60">
            <User size={20} />
          </div>

          <form action={logoutAdmin}>
            <button 
              type="submit"
              className="p-2 text-cream/40 transition-colors hover:text-red-400"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
