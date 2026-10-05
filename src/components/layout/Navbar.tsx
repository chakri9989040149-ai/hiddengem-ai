'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Sparkles,
  MapPin,
  CalendarDays,
  Dices,
  Bot,
  Briefcase,
  Award,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
  SlidersHorizontal,
  Languages,
  Navigation,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    isIdentityVerified,
    getCrowdPrediction,
    selectedDestinationSlug,
    adminCrowdOverride,
    isTravellingNow,
    setIsTravellingNow,
    setTranslatorOpen,
  } = useAppStore();

  const crowd = getCrowdPrediction();
  const isCrowdAlert = crowd.crowdLevel === 'high';

  const navLinks = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/hidden-discovery', label: '💎 Discover Gems', icon: Sparkles },
    { href: '/explore', label: 'Explore', icon: MapPin },
    { href: '/hidden-gems', label: 'Hidden Gems', icon: Sparkles },
    { href: '/plan-trip', label: 'Plan Trip', icon: CalendarDays },
    { href: '/surprise-me', label: 'Surprise Me', icon: Dices },
    { href: '/ai-agent', label: 'AI Agent', icon: Bot },
    { href: '/my-trips', label: 'My Trips', icon: Briefcase },
    { href: '/passport', label: 'Passport', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-stone-50/85 dark:bg-stone-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-lg">💎</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                HiddenGem <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950/80">AI</span>
              </span>
              <p className="text-[10px] text-stone-700 dark:text-stone-300 font-bold -mt-0.5 hidden sm:block">
                Discover Beyond the Destination
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all flex items-center gap-1.5',
                    isActive
                      ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                  )}
                >
                  <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-300')} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Crowd Alert Trigger Banner Button */}
            {isCrowdAlert && (
              <Link
                href="/plan-trip"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse font-semibold"
                title="Active Crowd Alert! Click to view low-crowd alternative gems."
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Crowd Alert Active</span>
              </Link>
            )}

            {/* Admin Simulator Quick Link */}
            <Link
              href="/admin"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
              title="Admin & Hackathon Crowd Simulator"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Admin Demo</span>
            </Link>

            {/* Verification Badge */}
            {isIdentityVerified ? (
              <Link
                href="/verify"
                className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-medium text-emerald-800 dark:text-emerald-300"
                title="Identity Verified ✓ (Mock Compliant Sandbox)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verified</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-emerald-600"
              >
                Sign In
              </Link>
            )}

            {/* Persistent Live Travel Translator Button */}
            <button
              onClick={() => setTranslatorOpen(true)}
              className="px-2.5 py-1 rounded-lg border border-sky-300 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-xs font-bold flex items-center gap-1.5 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors shadow-sm"
              title="Open Live Travel Translator (Speech & Conversation)"
            >
              <Languages className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="hidden sm:inline">🌐 Translator</span>
            </button>

            {/* Active Trip Mode Toggle ("I'm Travelling Now") */}
            <button
              onClick={() => setIsTravellingNow(!isTravellingNow)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm',
                isTravellingNow
                  ? 'bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400'
                  : 'border border-stone-300 dark:border-stone-700 bg-stone-100/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              )}
              title="Toggle Active Trip Mode ('I'm Travelling Now')"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{isTravellingNow ? 'Active Trip' : 'Travelling Now'}</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-2">
          {isCrowdAlert && (
            <div className="mb-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>⚠ High crowd detected in {selectedDestinationSlug}</span>
              </div>
              <Link
                href="/plan-trip"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-rose-700 underline"
              >
                View Gems
              </Link>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all',
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  )}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setTranslatorOpen(true);
              }}
              className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Languages className="w-3.5 h-3.5 text-sky-600" />
              <span>🌐 Live Translator</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsTravellingNow(!isTravellingNow);
              }}
              className={`p-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 ${
                isTravellingNow
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isTravellingNow ? 'Active Trip On' : 'Travelling Now'}</span>
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Admin Crowd Simulator</span>
            </Link>
            <Link
              href="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-700 dark:text-stone-300 flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Identity Verified ✓</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
