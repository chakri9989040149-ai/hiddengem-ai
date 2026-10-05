'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('hiddengem-theme') as 'light' | 'dark' | 'system') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (t: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else if (t === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const cycleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('hiddengem-theme', nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-all text-stone-700 dark:text-stone-300 flex items-center gap-1.5 text-xs font-medium"
      title={`Current theme: ${theme}. Click to change.`}
      aria-label="Toggle theme"
    >
      {theme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
      {theme === 'dark' && <Moon className="w-4 h-4 text-sky-400" />}
      {theme === 'system' && <Laptop className="w-4 h-4 text-emerald-500" />}
      <span className="capitalize hidden sm:inline">{theme}</span>
    </button>
  );
}
