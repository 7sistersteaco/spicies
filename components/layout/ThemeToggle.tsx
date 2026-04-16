'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'dark' | 'light';

const modes: ThemeMode[] = ['dark', 'light'];

const applyTheme = (theme: ThemeMode) => {
  document.documentElement.classList.toggle('theme-light', theme === 'light');
  document.documentElement.classList.toggle('theme-dark', theme === 'dark');
  document.documentElement.dataset.theme = theme;
};

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as ThemeMode | null) ?? 'dark';
    setMode(stored);
    applyTheme(stored);
  }, []);

  const handleToggle = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    localStorage.setItem('theme', nextMode);
    applyTheme(nextMode);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-cream/70 transition hover:border-accent/40 hover:bg-white/10 hover:text-cream active:scale-95"
    >
      <span className="sr-only">Toggle theme</span>
      {mode === 'dark' ? (
        /* Moon Icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        /* Sun Icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
}
