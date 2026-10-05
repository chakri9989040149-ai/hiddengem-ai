'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { DESTINATIONS } from '@/lib/data/seed';
import { CrowdLevel } from '@/types';
import { DESTINATION_VISUALS, getDestinationVisual } from '@/lib/destinationVisuals';
import {
  SlidersHorizontal,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  TrendingUp,
  CloudRain,
  Plus,
  Check,
  X,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';

export function AdminCrowdSimulator() {
  const {
    adminCrowdOverride,
    setAdminCrowdOverride,
    simulateCrowdSpike,
    resetCrowdSimulation,
    selectedDestinationSlug,
    setSelectedDestinationSlug,
    getCrowdPrediction,
    guides,
    verifyGuide,
    addGuide,
    weatherRainOverride,
    setWeatherRainOverride,
    unsafeGemsOverride,
    toggleGemUnsafe,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'simulator' | 'guides'>('simulator');
  const [newGuideName, setNewGuideName] = useState('');
  const [newGuideDest, setNewGuideDest] = useState(selectedDestinationSlug);
  const [newGuideLangs, setNewGuideLangs] = useState('English, Telugu, Hindi');
  const [newGuideSpec, setNewGuideSpec] = useState('Heritage & Local Culture');
  const [newGuidePrice, setNewGuidePrice] = useState(900);
  const [guideSuccessMsg, setGuideSuccessMsg] = useState(false);

  const activeDest =
    DESTINATIONS.find((d) => d.slug === selectedDestinationSlug) || DESTINATIONS[0];
  const activeVisuals =
    DESTINATION_VISUALS[selectedDestinationSlug] || DESTINATION_VISUALS.tirupati;
  const currentPred = getCrowdPrediction(selectedDestinationSlug);
  const isHighCrowd = currentPred.crowdLevel === 'high';
  const currentRain = weatherRainOverride[selectedDestinationSlug];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header with Frosted Glass styling */}
      <div className="rounded-2xl backdrop-blur-xl bg-white/85 dark:bg-stone-900/85 border border-stone-200/80 dark:border-stone-800/80 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1 border border-amber-500/20">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Hackathon Live Demo Sandbox</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950 dark:text-stone-50 tracking-tight mt-2">
            Admin Crowd Simulator
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm mt-1">
            Switch destinations to trigger real-time crowd spikes and test the{' '}
            <strong>Crowd Alert → Alternative Gems</strong> recommendation engine.
          </p>
        </div>

        <Link
          href="/plan-trip"
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md flex items-center gap-1.5 self-start sm:self-center transition-transform hover:scale-105"
        >
          <span>View Traveller View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Admin Mode Switcher Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 gap-2">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-900 shadow-sm'
              : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Crowd, Weather & Safety Simulation</span>
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'guides'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-stone-900 shadow-sm'
              : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Local Guide Admin & Verification ({guides.length})</span>
        </button>
      </div>

      {activeTab === 'simulator' ? (
        <>
          {/* Destination-Aware Visual Preview Card with Smooth 800ms Crossfade */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-stone-200/60 dark:border-stone-800/60 min-h-[220px] flex items-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDestinationSlug}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={activeVisuals.hero}
              alt={activeVisuals.name}
              className="w-full h-full object-cover brightness-[0.78] contrast-[1.08]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Gradient & Crowd Status Overlay */}
        <div
          className={`absolute inset-0 transition-colors duration-700 ${
            isHighCrowd
              ? 'bg-gradient-to-t from-rose-950/95 via-rose-950/50 to-stone-950/40 ring-4 ring-rose-500/40 inset-ring'
              : 'bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent'
          }`}
        />

        <div className="relative z-10 p-6 sm:p-8 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>
                  {activeVisuals.name}, {activeVisuals.state}
                </span>
              </span>
              {isHighCrowd && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Surge Active</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2 drop-shadow-md">
              {isHighCrowd
                ? `High Crowd Expected at ${activeVisuals.name}`
                : `${activeVisuals.name} Crowd Conditions`}
            </h2>

            <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-xl font-medium drop-shadow">
              {isHighCrowd
                ? 'We found quieter alternatives nearby. The recommendation engine automatically re-routes travellers to uncrowded gems.'
                : activeVisuals.tagline}
            </p>
          </div>

          <div className="backdrop-blur-xl bg-stone-950/70 border border-white/20 rounded-2xl p-4 text-white text-xs space-y-1 shadow-lg shrink-0">
            <span className="text-white/60 text-[10px] uppercase font-semibold block">
              Occupancy Sensor
            </span>
            <div className="text-base font-extrabold flex items-center gap-2">
              <span className="capitalize">{currentPred.crowdLevel}</span>
              <span className="text-emerald-400">({currentPred.estimatedOccupancy}%)</span>
            </div>
            <p className="text-[11px] text-white/70 max-w-[200px] line-clamp-1">
              {currentPred.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Main Simulation Control Card with Frosted Glassmorphism */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-2xl bg-white/90 dark:bg-stone-900/90 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold text-amber-700 dark:text-amber-400 tracking-wider">
              Step 1: Select Active Destination
            </span>
            <p className="text-stone-500 text-xs mt-0.5">
              Select a destination to update the entire website background instantly:
            </p>
            <div className="flex flex-wrap gap-2.5 mt-3">
              {DESTINATIONS.map((d) => {
                const isSelected = selectedDestinationSlug === d.slug;
                return (
                  <button
                    key={d.slug}
                    onClick={() => setSelectedDestinationSlug(d.slug)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-stone-950 text-white dark:bg-stone-50 dark:text-stone-950 shadow-lg scale-105 ring-2 ring-emerald-500'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-200/70 hover:scale-102'
                    }`}
                  >
                    <span>{d.name}</span>
                    <span className="text-[10px] opacity-70">({d.state})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SIMULATE CROWD SPIKE */}
          <button
            onClick={() => simulateCrowdSpike(selectedDestinationSlug)}
            className="p-5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-rose-600/25 flex items-center justify-center gap-3 hover:from-rose-700 hover:to-red-800 active:scale-98 transition-all"
          >
            <AlertTriangle className="w-6 h-6 animate-bounce" />
            <div className="text-left">
              <div className="text-sm uppercase tracking-wide">Trigger Surge</div>
              <div className="text-xs font-normal opacity-90">Simulate Crowd Spike (HIGH)</div>
            </div>
          </button>

          {/* RESET SIMULATION */}
          <button
            onClick={() => resetCrowdSimulation(selectedDestinationSlug)}
            className="p-5 rounded-2xl bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-2 border-stone-300 dark:border-stone-700 font-extrabold text-sm sm:text-base shadow-md flex items-center justify-center gap-3 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
          >
            <RotateCcw className="w-5 h-5 text-stone-500" />
            <div className="text-left">
              <div className="text-sm uppercase tracking-wide">Reset Conditions</div>
              <div className="text-xs font-normal text-stone-500">Restore Baseline AI Predictions</div>
            </div>
          </button>
        </div>

        {/* Granular Level Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs text-stone-500 font-medium">Or set exact crowd level:</span>
          {(['low', 'moderate', 'high'] as CrowdLevel[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setAdminCrowdOverride(selectedDestinationSlug, lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                adminCrowdOverride[selectedDestinationSlug] === lvl
                  ? 'bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-900 shadow-md scale-105'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Weather Simulation Control (TEST 4) */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl p-6 space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-extrabold tracking-widest text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
            <CloudRain className="w-4 h-4" />
            <span>Weather Intelligence Simulator (TEST 4)</span>
          </span>
          <span className="text-xs text-stone-500 font-bold">
            Current Status: {currentRain !== null && currentRain !== undefined ? `${currentRain}% Rain (Override Active)` : 'Normal Baseline'}
          </span>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300">
          Simulate torrential monsoon weather to verify that outdoor waterfall cascades are automatically demoted and indoor cultural sanctuaries are elevated.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setWeatherRainOverride(selectedDestinationSlug, 88)}
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              currentRain === 88
                ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-400'
                : 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 text-sky-800 dark:text-sky-300 hover:bg-sky-100'
            }`}
          >
            <span>🌧️ Set Heavy Rain (88%)</span>
          </button>

          <button
            onClick={() => setWeatherRainOverride(selectedDestinationSlug, 10)}
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              currentRain === 10
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
                : 'bg-stone-100 dark:bg-stone-800 border-stone-300 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <span>☀️ Set Clear Weather (10%)</span>
          </button>

          <button
            onClick={() => setWeatherRainOverride(selectedDestinationSlug, null)}
            className="p-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100"
          >
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Safety Filter Simulator (TEST 5) */}
      <div className="rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl p-6 space-y-4 shadow-lg">
        <span className="text-xs uppercase font-extrabold tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4" />
          <span>Safety Filter & Quality Gate Control (TEST 5)</span>
        </span>

        <p className="text-xs text-stone-600 dark:text-stone-300">
          Mark an attraction as unsafe to verify that the Quality Gate immediately disqualifies it:
          <br />
          <em className="text-stone-500 font-semibold">
            &ldquo;This location matches your interests but is currently not recommended because conditions may be unsafe.&rdquo;
          </em>
        </p>

        <div className="space-y-2.5">
          {activeDest.hiddenGems.map((gem) => {
            const isUnsafe = Boolean(unsafeGemsOverride[gem.id]);
            return (
              <div
                key={gem.id}
                className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-extrabold text-stone-900 dark:text-stone-100">
                    {gem.name}
                  </span>
                  <span className="text-stone-400 block text-[11px]">
                    Category: {gem.category} • Trek: {gem.safety.trekDifficulty}
                  </span>
                  {isUnsafe && (
                    <span className="text-rose-600 font-bold text-[11px] block mt-0.5">
                      🚫 Disqualified by Safety Filter: Conditions unsafe
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleGemUnsafe(gem.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    isUnsafe
                      ? 'bg-rose-600 text-white shadow-rose-600/30'
                      : 'border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:border-rose-400'
                  }`}
                >
                  {isUnsafe ? 'Mark Safe ✓' : 'Mark as Unsafe 🚫 (TEST 5)'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  ) : (
    /* ========================================================
        GUIDE ADMIN & APPROVALS TAB (Section 11 & 12)
    ======================================================== */
    <div className="space-y-6">
      <div className="p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
              Authority Controls
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
              Local Guide Verification & Management
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
            Admin Exclusive • Users Cannot Self-Verify
          </span>
        </div>

        {/* Add New Guide Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newGuideName.trim()) return;
            addGuide({
              destinationSlug: newGuideDest,
              name: newGuideName.trim(),
              photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
              rating: 4.9,
              languages: newGuideLangs.split(',').map((s) => s.trim()),
              experienceYears: 8,
              pricePerDayInr: newGuidePrice,
              verified: true, // admin verified upon registration
              specialty: newGuideSpec.trim(),
              available: true,
            });
            setGuideSuccessMsg(true);
            setNewGuideName('');
            setTimeout(() => setGuideSuccessMsg(false), 2500);
          }}
          className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3"
        >
          <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
            Add & Authorize a New Verified Guide
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Guide Name
              </label>
              <input
                type="text"
                value={newGuideName}
                onChange={(e) => setNewGuideName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Destination
              </label>
              <select
                value={newGuideDest}
                onChange={(e) => setNewGuideDest(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
              >
                {DESTINATIONS.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Languages (comma separated)
              </label>
              <input
                type="text"
                value={newGuideLangs}
                onChange={(e) => setNewGuideLangs(e.target.value)}
                placeholder="English, Telugu, Hindi, Malayalam"
                className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                Price / Day (₹)
              </label>
              <input
                type="number"
                value={newGuidePrice}
                onChange={(e) => setNewGuidePrice(Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 dark:text-stone-400 text-xs font-medium mb-1">
              Specialization / Domain
            </label>
            <input
              type="text"
              value={newGuideSpec}
              onChange={(e) => setNewGuideSpec(e.target.value)}
              placeholder="Heritage • Architecture • Ecological Treks"
              className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {guideSuccessMsg && (
              <span className="text-xs text-emerald-600 font-bold">
                ✓ Guide registered and verified successfully!
              </span>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md ml-auto"
            >
              Register & Verify Guide
            </button>
          </div>
        </form>

        {/* Existing Registered Guides List */}
        <div className="space-y-3 pt-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-stone-500 block">
            Authorized Certified Guides ({guides.length})
          </span>

          {guides.map((guide) => (
            <div
              key={guide.id}
              className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={guide.photo}
                  alt={guide.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                      {guide.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] uppercase font-bold">
                      {guide.destinationSlug}
                    </span>
                    {guide.verified ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>✓ Verified</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 font-medium text-[11px]">Unverified</span>
                    )}
                  </div>
                  <div className="text-stone-500 text-[11px] mt-0.5">
                    {guide.languages.join(' • ')} | ₹{guide.pricePerDayInr}/day | {guide.specialty}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => verifyGuide(guide.id, !guide.verified)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                    guide.verified
                      ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {guide.verified ? 'Revoke Verification' : 'Verify Guide ✓'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

      {/* Demo Walkthrough Checklist */}
      <div className="p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-xl bg-white/85 dark:bg-stone-900/85 space-y-4 shadow-lg">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Hackathon 60-Second Demo Script</span>
        </h3>
        <ol className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 list-decimal list-inside leading-relaxed font-medium">
          <li>
            Click <strong>Tirupati (Andhra Pradesh)</strong>. Notice how the entire background smoothly crossfades to Tirumala temple gopuram &amp; Seshachalam hills.
          </li>
          <li>
            Click <strong>Hampi (Karnataka)</strong>. The background immediately transitions to the UNESCO stone chariot and ancient granite boulders.
          </li>
          <li>
            Click <strong>Munnar (Kerala)</strong>. The background transforms into mist-covered green tea plantations.
          </li>
          <li>
            Select <strong>Tirupati</strong> and click <strong className="text-rose-600">Trigger Surge (HIGH)</strong>.
          </li>
          <li>
            Click <strong className="text-emerald-700 dark:text-emerald-400">View Traveller View</strong> to observe how the Crowd Alert banner activates and suggests quieter alternatives like Talakona Waterfalls.
          </li>
        </ol>
      </div>
    </div>
  );
}
