'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { DESTINATIONS, HOTELS_SEED, RESTAURANTS_SEED, TRANSPORT_SEED } from '@/lib/data/seed';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatTime, getAssetPath } from '@/lib/utils';
import { TRAVEL_VISUALS } from '@/lib/travelVisuals';
import { DESTINATION_MEDIA } from '@/lib/destinationVisuals';
import {
  Dices,
  Sparkles,
  RotateCcw,
  Calendar,
  Users,
  MapPin,
  Leaf,
  CheckCircle,
  ArrowRight,
  Flame,
  Train,
  Car,
  Hotel,
  Utensils,
} from 'lucide-react';

const SPIN_CAROUSEL_IMAGES = [
  { label: 'Scenic Mountain Train', image: TRAVEL_VISUALS.transport.Train[0] },
  { label: 'Coastal Road Trip', image: TRAVEL_VISUALS.transport.Car[0] },
  { label: 'Mist-Covered Mountains', image: TRAVEL_VISUALS.nature.mountain[0] },
  { label: 'Untouched Waterfall Cascade', image: TRAVEL_VISUALS.nature.waterfall[0] },
  { label: 'Serene Sunset Beach', image: TRAVEL_VISUALS.nature.beach[0] },
  { label: 'Boutique Eco Resort', image: TRAVEL_VISUALS.accommodation.Resort[0] },
  { label: 'Authentic Local Feast', image: TRAVEL_VISUALS.food.localFood[0] },
  { label: 'Ancient 11th-C Citadel', image: TRAVEL_VISUALS.culture.history[0] },
];

export default function SurpriseMePage() {
  const { preferences, updatePreferences, setSelectedDestinationSlug, unlockBadge } = useAppStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const [result, setResult] = useState<any>(null);

  // Animated image carousel during spin
  useEffect(() => {
    let interval: any;
    if (isSpinning) {
      interval = setInterval(() => {
        setSpinIndex((prev) => (prev + 1) % SPIN_CAROUSEL_IMAGES.length);
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isSpinning]);

  const handleSpin = () => {
    setIsSpinning(true);
    setResult(null);

    // Pick random destination
    const randomDest = DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)];
    // Pick 2 random gems from this destination
    const gems = [...randomDest.hiddenGems].sort(() => 0.5 - Math.random()).slice(0, 2);
    // Pick stay
    const hotel =
      HOTELS_SEED.find((h) => h.destinationSlug === randomDest.slug) || HOTELS_SEED[0];
    // Pick dining
    const rest =
      RESTAURANTS_SEED.find((r) => r.destinationSlug === randomDest.slug) || RESTAURANTS_SEED[0];
    // Pick transport
    const transport = TRANSPORT_SEED[0];

    const estimatedTotal =
      (preferences.durationDays || 2) * hotel.pricePerNightInr +
      preferences.groupSize * transport.priceInr +
      preferences.groupSize * 1500;

    setTimeout(() => {
      setResult({
        destination: randomDest,
        gems,
        hotel,
        restaurant: rest,
        transport,
        estimatedTotal,
      });
      setSelectedDestinationSlug(randomDest.slug);
      unlockBadge('b-serendipity');
      setIsSpinning(false);

      // Celebratory Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#0284c7', '#ec4899'],
        });
      } catch {
        // graceful ignore
      }
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-28 select-none">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider">
          <Dices className="w-4 h-4 text-amber-500" />
          <span>Serendipity Travel Algorithm</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
          🎲 Surprise Me!
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed">
          Tired of endless overthinking? One click spins through verified uncrowded destinations and composes a complete spontaneous journey with stays, transit, and cuisine.
        </p>
      </div>

      {/* Control Inputs */}
      <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl shadow-xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-stone-400 uppercase font-extrabold block mb-1">Travellers</span>
          <select
            value={preferences.groupSize}
            onChange={(e) => updatePreferences({ groupSize: parseInt(e.target.value) })}
            className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold"
          >
            {[1, 2, 4, 6, 8].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Person' : 'People'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-stone-400 uppercase font-extrabold block mb-1">Duration</span>
          <select
            value={preferences.durationDays}
            onChange={(e) => updatePreferences({ durationDays: parseInt(e.target.value) })}
            className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold"
          >
            {[1, 2, 3, 4, 5].map((d) => (
              <option key={d} value={d}>
                {d} Days Escape
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="text-stone-400 uppercase font-extrabold block mb-1">Target Budget</span>
          <select
            value={preferences.totalBudgetInr || 10000}
            onChange={(e) => updatePreferences({ totalBudgetInr: parseInt(e.target.value) })}
            className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold"
          >
            <option value="6000">₹6,000 (Budget)</option>
            <option value="10000">₹10,000 (Standard)</option>
            <option value="20000">₹20,000 (Comfort)</option>
            <option value="40000">₹40,000 (Luxury)</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
          >
            <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Cycling Destinations...' : 'SPIN FOR ADVENTURE'}</span>
          </button>
        </div>
      </div>

      {/* SPINNING ANIMATION VISUAL CAROUSEL */}
      {isSpinning && (
        <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center justify-center p-8 border-2 border-amber-400 shadow-2xl animate-pulse">
          <img
            src={SPIN_CAROUSEL_IMAGES[spinIndex].image}
            alt={SPIN_CAROUSEL_IMAGES[spinIndex].label}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.45] transition-all duration-150"
          />
          <div className="absolute inset-0 bg-stone-950/40" />

          <div className="relative z-10 text-center text-white space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300 block">
              Searching {DESTINATIONS.length} Indian Gateways...
            </span>
            <h3 className="text-3xl sm:text-4xl font-black drop-shadow">
              {SPIN_CAROUSEL_IMAGES[spinIndex].label}
            </h3>
            <div className="w-12 h-12 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto mt-2" />
          </div>
        </div>
      )}

      {/* RESULT CAR REVEAL: "YOUR NEXT ADVENTURE" */}
      {result && !isSpinning && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
          {/* GIANT DESTINATION REVEAL HERO */}
          <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-end p-6 sm:p-10 border border-emerald-500/50 shadow-2xl">
            <img
              src={DESTINATION_MEDIA[result.destination.slug]?.heroImages[0] || result.destination.heroImage}
              alt={result.destination.name}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.55] contrast-[1.15]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

            <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white">
              <div className="space-y-2 max-w-xl">
                <span className="px-3.5 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider shadow">
                  🎉 YOUR NEXT ADVENTURE
                </span>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                  {result.destination.name}, {result.destination.state}
                </h2>
                <p className="text-sm text-stone-200 font-medium">
                  {result.destination.tagline}
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <span className="text-[10px] uppercase font-bold text-stone-300 block">
                  Calculated Journey Outlay
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
                  {formatCurrency(result.estimatedTotal)}
                </span>
                <span className="text-[11px] text-stone-300">
                  {preferences.groupSize} {preferences.groupSize === 1 ? 'Person' : 'People'} • {preferences.durationDays} Days
                </span>
              </div>
            </div>
          </div>

          {/* CURATED STOPS IN SURPRISE PACKAGE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2 Hidden Gems */}
            {result.gems.map((gem: any) => (
              <div
                key={gem.id}
                className="group rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md flex flex-col justify-between"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={gem.images?.[0] || getAssetPath('/images/destinations/munnar_tea_hills.jpg')}
                    alt={gem.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      const fallback =
                        gem.destinationSlug === 'munnar'
                          ? getAssetPath('/images/destinations/munnar_tea_hills.jpg')
                          : gem.destinationSlug === 'hampi'
                          ? getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg')
                          : getAssetPath('/images/destinations/tirupati_talakona_waterfall.jpg');
                      e.currentTarget.src = fallback;
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold">
                    {gem.category}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors">
                    {gem.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2">{gem.subtitle}</p>
                  <div className="pt-2 flex justify-between text-xs font-bold text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
                    <span>{formatTime(gem.travelTimeMinutes)} drive</span>
                    <span className="text-emerald-600">🟢 {gem.crowdData.level} crowd</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Recommended Stay */}
            <div className="group rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md flex flex-col justify-between">
              <div className="h-44 overflow-hidden relative">
                <img
                  src={result.hotel.image}
                  alt={result.hotel.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-sky-600 text-white text-[10px] font-bold">
                  Recommended Stay
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                  {result.hotel.name}
                </h4>
                <p className="text-xs text-stone-500">
                  {result.hotel.type} • {result.hotel.rating}★ Rating
                </p>
                <div className="pt-2 flex justify-between text-xs font-bold border-t border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500">Nightly tariff</span>
                  <span className="text-sky-600 font-black">{formatCurrency(result.hotel.pricePerNightInr)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action to Launch Journey */}
          <div className="p-6 rounded-3xl bg-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs uppercase font-extrabold text-emerald-400 block">
                Lock In Your Spontaneous Journey
              </span>
              <p className="text-xs text-stone-300">
                Transfers this surprise package directly into your live Itinerary and Map route.
              </p>
            </div>
            <Link
              href="/plan-trip"
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg inline-flex items-center justify-center gap-2 hover:scale-105 transition-all"
            >
              <span>Build Complete Itinerary in Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
