'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { DESTINATIONS } from '@/lib/data/seed';
import { discoverHiddenPlaces } from '@/lib/hiddenDiscoveryEngine';
import { DESTINATION_MEDIA } from '@/lib/destinationVisuals';
import {
  Sparkles,
  MapPin,
  Wallet,
  Users,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Dices,
  Radar,
  Leaf,
} from 'lucide-react';

const SCAN_STEPS = [
  'Scanning nearby destinations and biosphere reserves...',
  'Finding lesser-known places normal tourists miss...',
  'Checking real-time crowd levels & occupancy sensors...',
  'Evaluating travel-time efficiency & road conditions...',
  'Checking open status and visitor permits...',
  'Optimizing budget fit & local accommodation...',
  'Verifying safety & accessibility quality gates...',
  '✨ YOUR HIDDEN PLACES ARE READY!',
];

export default function HiddenDiscoveryInputPage() {
  const router = useRouter();
  const {
    selectedDestinationSlug,
    setSelectedDestinationSlug,
    setActiveDiscovery,
    updatePreferences,
  } = useAppStore();

  const [startLocation, setStartLocation] = useState(
    selectedDestinationSlug === 'hampi'
      ? 'Hampi'
      : selectedDestinationSlug === 'munnar'
      ? 'Munnar'
      : 'Tirupati'
  );
  const [budget, setBudget] = useState(10000);
  const [travellers, setTravellers] = useState(4);
  const [days, setDays] = useState(2);
  const [travelDate, setTravelDate] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  const interestOptions = [
    'Nature',
    'Photography',
    'History',
    'Adventure',
    'Culture',
    'Spirituality',
    'Food',
    'Wildlife',
    'Trekking',
    'Relaxation',
  ];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleDiscover = () => {
    setIsScanning(true);
    setScanStepIndex(0);

    // Step-by-step radar animation
    const interval = setInterval(() => {
      setScanStepIndex((prev) => {
        if (prev < SCAN_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 450);

    setTimeout(() => {
      clearInterval(interval);

      // Run Hidden Discovery Engine
      const result = discoverHiddenPlaces({
        startLocation,
        budgetInr: budget,
        travellersCount: travellers,
        durationDays: days,
        travelDate,
        selectedInterests,
      });

      setActiveDiscovery(result);
      setSelectedDestinationSlug(result.destination.slug);
      updatePreferences({
        destinationSlug: result.destination.slug,
        totalBudgetInr: budget,
        groupSize: travellers,
        durationDays: days,
      });

      router.push(`/hidden-discovery/${result.id}`);
    }, SCAN_STEPS.length * 480);
  };

  const activeMedia = DESTINATION_MEDIA[selectedDestinationSlug] || DESTINATION_MEDIA.tirupati;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-28 select-none">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span>Hidden Destination Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
          💎 Discover My Hidden Places
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base font-medium leading-relaxed">
          &ldquo;Give us your budget. We’ll uncover the places most travellers miss.&rdquo;
        </p>
      </div>

      {/* Main Form or Scanning State */}
      <AnimatePresence mode="wait">
        {!isScanning ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-2xl bg-white/90 dark:bg-stone-900/90 shadow-2xl p-6 sm:p-10 space-y-8"
          >
            {/* Input 1: Starting Location */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>📍 Starting Location / Hub</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {DESTINATIONS.map((d) => {
                  const isSelected = startLocation.toLowerCase() === d.name.toLowerCase();
                  return (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => {
                        setStartLocation(d.name);
                        setSelectedDestinationSlug(d.slug);
                      }}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105 ring-2 ring-emerald-400'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 hover:scale-102 border border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <span>{d.name}</span>
                      <span className="text-[10px] opacity-70 font-normal">({d.state})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 2: Budget */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-amber-500" />
                  <span>💰 Total Budget: ₹{budget.toLocaleString('en-IN')}</span>
                </label>
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                  ₹{Math.round(budget / Math.max(1, travellers)).toLocaleString('en-IN')} / person
                </span>
              </div>
              <input
                type="range"
                min="3000"
                max="50000"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
                className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex items-center gap-2 pt-1">
                {[5000, 10000, 20000, 35000].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                      budget === b
                        ? 'bg-amber-500 text-stone-950 font-black'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    ₹{b.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs 3 & 4: Travellers and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Travellers */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-500" />
                  <span>👥 Number of Travellers</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTravellers(num)}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                        travellers === num
                          ? 'bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-900 shadow-md scale-105'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {num} {num === 1 ? 'Solo' : 'Pax'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  <span>📅 Trip Duration</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDays(d)}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                        days === d
                          ? 'bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-900 shadow-md scale-105'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Preferences (Inferred Automatically if Blank) */}
            <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <span>✨ Optional Passions (AI automatically infers if unselected)</span>
                </span>
                <span className="text-[10px] text-stone-500 font-semibold">Optional</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => {
                  const active = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-emerald-600 text-white shadow-sm scale-105'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleDiscover}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg shadow-2xl shadow-emerald-600/35 flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-98"
              >
                <Sparkles className="w-5 h-5 text-emerald-200 animate-spin" />
                <span>💎 DISCOVER HIDDEN PLACES</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Radar Discovery Scanning Animation */
          <motion.div
            key="scanning-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-emerald-500/40 backdrop-blur-2xl bg-stone-950/90 text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl"
          >
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping [animation-duration:2s]" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <Radar className="w-12 h-12 text-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 block">
                Scanning {startLocation} &amp; Eastern/Western Ghats
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {SCAN_STEPS[scanStepIndex]}
              </h3>
            </div>

            <div className="w-full max-w-xs mx-auto h-2 bg-stone-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                initial={{ width: '10%' }}
                animate={{ width: `${((scanStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
