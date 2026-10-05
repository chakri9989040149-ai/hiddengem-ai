'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { TRAVEL_VISUALS } from '@/lib/travelVisuals';
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Phone,
  Mail,
  Compass,
  MapPin,
  Train,
  CheckCircle,
  Award,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setGuestMode } = useAppStore();

  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [authMethod, setAuthMethod] = useState<'mobile' | 'email'>('mobile');
  const [identifier, setIdentifier] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueAsGuest = () => {
    setGuestMode(true);
    router.push('/');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setOtp('7492'); // Simulated demo OTP
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuth(true, true, 'Aadhaar (Mock Sandbox)');
      router.push('/');
    }, 600);
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
      {/* 1. Full-Bleed Panoramic Travel Image Background */}
      <div className="absolute inset-0 -z-20">
        <img
          src={TRAVEL_VISUALS.panoramicMaster}
          alt="Cinematic World of Travel"
          className="w-full h-full object-cover brightness-[0.55] contrast-[1.15] saturate-[1.25] scale-105 animate-fade-in"
        />
      </div>

      {/* 2. Cinematic Multi-Layer Gradient Overlays */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/70 via-transparent to-sky-950/70" />

      {/* Floating Travel Mood Highlights in corners */}
      <div className="hidden lg:flex absolute top-10 left-10 items-center gap-3 px-4 py-2 rounded-full bg-stone-900/60 backdrop-blur-md border border-white/10 text-white text-xs font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Live Crowd Intelligence Active across Tirupati • Hampi • Munnar</span>
      </div>

      <div className="hidden lg:flex absolute bottom-10 left-10 items-center gap-4 text-white/80 text-xs font-medium">
        <span className="flex items-center gap-1.5"><Train className="w-3.5 h-3.5 text-emerald-400" /> Mountain Rail</span>
        <span className="flex items-center gap-1.5">🌊 Secret Cascades</span>
        <span className="flex items-center gap-1.5">🏛️ Ancient Citadels</span>
        <span className="flex items-center gap-1.5">🧗 Granite Treks</span>
      </div>

      {/* 3. Welcome Container (Glassmorphic) */}
      <div className="relative w-full max-w-xl rounded-3xl backdrop-blur-2xl bg-stone-950/70 border border-white/20 p-8 sm:p-12 shadow-2xl shadow-black/60 text-white space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 text-white text-3xl shadow-xl shadow-emerald-500/30 ring-4 ring-white/10">
            💎
          </div>
          <div>
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-emerald-400 block mb-1">
              HiddenGem AI Platform
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Discover Beyond <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300">
                the Destination.
              </span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
            AI-powered travel discovery for unforgettable journeys. Find uncrowded waterfalls, ancient monuments, scenic rail routes, and authentic local food.
          </p>
        </div>

        {/* MODE: WELCOME / LANDING CHOICES */}
        {mode === 'welcome' && (
          <div className="space-y-4 pt-2">
            {/* 1. Explore as Guest - PRIMARY HERO ACTION */}
            <button
              onClick={handleContinueAsGuest}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-600/30 flex items-center justify-between group transition-all transform hover:scale-[1.02] active:scale-98"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                  ✨
                </span>
                <div className="text-left">
                  <span className="block font-extrabold">Explore as Guest</span>
                  <span className="block text-[11px] text-emerald-100 font-normal">
                    Instant access • No registration needed
                  </span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1.5 transition-transform" />
            </button>

            {/* 2. Login & 3. Create Account Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setMode('login')}
                className="py-3.5 px-4 rounded-xl border border-white/20 hover:border-emerald-400 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>🔑 Login with OTP</span>
              </button>

              <button
                onClick={() => setMode('register')}
                className="py-3.5 px-4 rounded-xl border border-white/20 hover:border-teal-400 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>📝 Create Account</span>
              </button>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic explainable scoring & 100% verified Indian travel data</span>
              </p>
            </div>
          </div>
        )}

        {/* MODE: LOGIN OR REGISTER FORM */}
        {(mode === 'login' || mode === 'register') && (
          <div className="space-y-5 pt-2 animate-in fade-in duration-300">
            {/* Top Toggle Switch */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <button
                onClick={() => setMode('welcome')}
                className="text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                ← Back to Welcome
              </button>
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                {mode === 'login' ? 'Sign In to Passport' : 'New Explorer Registration'}
              </span>
            </div>

            {/* Auth Method Toggle */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-white/10 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('mobile');
                  setOtpSent(false);
                }}
                className={`py-2 rounded-lg transition-all ${
                  authMethod === 'mobile'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Mobile + OTP
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setOtpSent(false);
                }}
                className={`py-2 rounded-lg transition-all ${
                  authMethod === 'email'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Email
              </button>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    {authMethod === 'mobile' ? 'Mobile Number (Demo prefilled)' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type={authMethod === 'mobile' ? 'tel' : 'email'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      placeholder={authMethod === 'mobile' ? '9876543210' : 'explorer@hiddengem.ai'}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <div className="absolute right-3 top-3 text-stone-400">
                      {authMethod === 'mobile' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  {isLoading ? 'Generating OTP...' : 'Send Verification OTP'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                  <span>Demo OTP auto-filled: <strong>7492</strong></span>
                  <span className="text-[10px] bg-emerald-700/60 px-2 py-0.5 rounded text-white font-bold">
                    Sandbox Active
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    4-Digit Verification OTP
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  {isLoading ? 'Entering Travel Hub...' : 'Verify & Enter HiddenGem AI'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Guest Alternative */}
            <div className="pt-2 text-center">
              <button
                onClick={handleContinueAsGuest}
                className="text-xs text-stone-300 hover:text-white underline underline-offset-4 font-semibold"
              >
                Skip sign-in and Continue as Guest →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
