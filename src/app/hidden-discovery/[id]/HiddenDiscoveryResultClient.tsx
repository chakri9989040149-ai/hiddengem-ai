'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/store';
import { discoverHiddenPlaces } from '@/lib/hiddenDiscoveryEngine';
import { DESTINATION_MEDIA } from '@/lib/destinationVisuals';
import { GemDetailsModal } from '@/components/gems/GemDetailsModal';
import { TravelMap } from '@/components/map/TravelMap';
import { formatCurrency, getAssetPath } from '@/lib/utils';
import { HiddenGem } from '@/types';
import {
  MapPin,
  Clock,
  Star,
  ArrowRight,
  AlertTriangle,
  Dices,
  ChevronDown,
} from 'lucide-react';

interface HiddenDiscoveryResultClientProps {
  id: string;
}

export default function HiddenDiscoveryResultClient({ id }: HiddenDiscoveryResultClientProps) {
  const router = useRouter();

  const {
    activeDiscovery,
    selectedDestinationSlug,
    getCrowdPrediction,
    addGemToTrip,
    generateItineraryFromState,
    updatePreferences,
  } = useAppStore();

  const [activeModalGem, setActiveModalGem] = useState<HiddenGem | null>(null);
  const [activeTab, setActiveTab] = useState<'gems' | 'journey' | 'comparison' | 'map'>('gems');
  const [isSurpriseRevealed, setIsSurpriseRevealed] = useState(false);
  const [surpriseGem, setSurpriseGem] = useState<HiddenGem | null>(null);
  const [expandedBreakdownId, setExpandedBreakdownId] = useState<string | null>(null);

  // Restore or generate discovery result if directly loaded
  const discovery =
    activeDiscovery && activeDiscovery.id === id
      ? activeDiscovery
      : discoverHiddenPlaces({
          startLocation: selectedDestinationSlug || 'Tirupati',
          budgetInr: 10000,
          travellersCount: 4,
          durationDays: 2,
        });

  const dest = discovery.destination;
  const currentPred = getCrowdPrediction(dest.slug);
  const isCrowdSurge = currentPred.crowdLevel === 'high';

  const handleRevealSurprise = () => {
    const gem = discovery.surpriseGem || dest.hiddenGems[1];
    setSurpriseGem(gem);
    setIsSurpriseRevealed(true);

    try {
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#38bdf8', '#a855f7'],
      });
    } catch {
      // ignore
    }
  };

  const handleBuildJourney = () => {
    // Add top 3 gems to trip
    discovery.hiddenGems.slice(0, 3).forEach(({ gem }) => {
      addGemToTrip(gem);
    });

    updatePreferences({
      destinationSlug: dest.slug,
      durationDays: discovery.params.durationDays,
      totalBudgetInr: discovery.params.budgetInr,
      groupSize: discovery.params.travellersCount,
    });

    generateItineraryFromState();
    setActiveTab('journey');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-28 select-none">
      {/* ========================================================
          1. HERO HEADER: "💎 YOUR HIDDEN PLACES"
      ======================================================== */}
      <div className="relative rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[360px] flex items-end p-6 sm:p-12 border border-white/20 dark:border-stone-800 shadow-2xl">
        <img
          src={DESTINATION_MEDIA[dest.slug]?.heroImages[0] || dest.heroImage}
          alt={dest.name}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.55] contrast-[1.12]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-600/90 text-white font-black text-xs uppercase tracking-wider backdrop-blur-md shadow">
                💎 DISCOVER MY HIDDEN PLACES
              </span>
              <span className="px-3.5 py-1 rounded-full bg-stone-900/80 text-emerald-300 text-xs font-bold backdrop-blur-md">
                Hub: {dest.name}, {dest.state}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
              Your Hidden Places in {dest.name}
            </h1>

            <p className="text-sm sm:text-base text-stone-200 font-medium leading-relaxed">
              We uncovered {discovery.hiddenGems.length} uncrowded sanctuaries normal tourists miss.
              Tailored for {discovery.params.travellersCount} travellers • {discovery.params.durationDays} Days • ₹{discovery.params.budgetInr.toLocaleString('en-IN')} Budget.
            </p>
          </div>

          {/* Quick Stats Panel */}
          <div className="backdrop-blur-xl bg-stone-950/70 border border-white/20 rounded-2xl p-4 sm:p-5 text-white text-xs space-y-2 shadow-2xl shrink-0">
            <span className="text-stone-300 text-[10px] uppercase font-bold block">
              Curated Exploration Budget
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              ₹{discovery.estimatedTotalCost.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-stone-300">
              ₹{Math.round(discovery.estimatedTotalCost / discovery.params.travellersCount).toLocaleString('en-IN')} / person • All-Inclusive
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          CROWD SURGE ALERT (Connected with Admin Crowd Simulator)
      ======================================================== */}
      {isCrowdSurge && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-red-950/60 to-stone-950/80 border-2 border-rose-500/60 backdrop-blur-xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shrink-0 shadow-lg animate-pulse">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm uppercase tracking-wide text-rose-300">
                  🚨 Real-Time Crowd Alert Detected
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-[10px] font-black uppercase">
                  High Wait Times
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 mt-0.5">
                {dest.mainAttractionName} has surging queues (&gt; 3.5 hours wait). Our algorithm has automatically prioritized peaceful nearby alternatives below!
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('gems')}
            className="px-4 py-2 rounded-xl bg-white text-rose-950 font-black text-xs hover:bg-stone-100 transition-colors shadow shrink-0 self-start sm:self-center"
          >
            View Quieter Alternatives ↓
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800 text-xs font-bold">
        {[
          { key: 'gems', label: `💎 Top Hidden Gems (${discovery.hiddenGems.length})` },
          { key: 'comparison', label: '⚖️ Famous vs Hidden' },
          { key: 'journey', label: '📅 Complete Journey Plan' },
          { key: 'map', label: '🗺️ Route Map' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}

        <button
          onClick={handleRevealSurprise}
          className="ml-auto px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all whitespace-nowrap"
        >
          <Dices className="w-4 h-4" />
          <span>🎲 Surprise Me</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: HIDDEN PLACE CARDS
      ======================================================== */}
      {activeTab === 'gems' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discovery.hiddenGems.map(({ gem, score, breakdown, recommendationReason }) => (
              <div
                key={gem.id}
                className="group rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                {/* Photo & Badges */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={gem.images?.[0] || getAssetPath('/images/destinations/munnar_tea_hills.jpg')}
                    alt={gem.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-[0.9]"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/20" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow">
                      💎 Hidden Gem
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-stone-900/80 text-emerald-400 text-[10px] font-black backdrop-blur-md flex items-center gap-1">
                      <span>Score: {score}/100</span>
                    </span>
                  </div>

                  {/* Bottom Image Stats */}
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{gem.distanceFromMainKm} km from hub</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      <span>{gem.travelTimeMinutes} mins</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-extrabold uppercase text-emerald-700 dark:text-emerald-400">
                        {gem.category}
                      </span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{gem.rating} ({gem.reviewCount})</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors">
                      {gem.name}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium line-clamp-2">
                      {gem.subtitle}
                    </p>
                  </div>

                  {/* AI Why We Recommend It */}
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-[11px] space-y-1">
                    <span className="font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                      Why We Recommend It:
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {recommendationReason}
                    </p>
                  </div>

                  {/* Score Breakdown Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedBreakdownId(expandedBreakdownId === gem.id ? null : gem.id)
                      }
                      className="text-[11px] font-bold text-stone-500 hover:text-emerald-600 flex items-center justify-between w-full pt-1"
                    >
                      <span>Explainable Score Breakdown (100% Metric)</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          expandedBreakdownId === gem.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedBreakdownId === gem.id && (
                      <div className="mt-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5 text-[10px]">
                        <div className="flex justify-between">
                          <span>Interest Match (30%):</span>
                          <span className="font-bold text-emerald-600">{breakdown.interestMatch} / 30</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Travel Time (20%):</span>
                          <span className="font-bold text-emerald-600">{breakdown.travelTimeScore} / 20</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Crowd Headroom (20%):</span>
                          <span className="font-bold text-emerald-600">{breakdown.crowdHeadroomScore} / 20</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rating (10%):</span>
                          <span className="font-bold text-emerald-600">{breakdown.ratingScore} / 10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Availability (10%):</span>
                          <span className="font-bold text-emerald-600">{breakdown.availabilityScore} / 10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Budget Fit (10%):</span>
                          <span className="font-bold text-emerald-600">{breakdown.budgetFitScore} / 10</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalGem(gem)}
                      className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-extrabold text-xs text-center transition-colors"
                    >
                      Explore Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addGemToTrip(gem);
                        alert(`Added ${gem.name} to your journey!`);
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center shadow transition-colors"
                    >
                      Add to Journey
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Large CTA: Build My Journey */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                Ready to explore beyond the tourist crowds?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Build My Complete Hidden Journey
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 max-w-xl">
                We’ll organize these discovered gems into a day-by-day itinerary with verified local stays, authentic cuisine, transit routing, and emergency contacts.
              </p>
            </div>

            <button
              onClick={handleBuildJourney}
              className="px-8 py-4 rounded-2xl bg-white text-stone-950 hover:bg-emerald-100 font-black text-sm sm:text-base shadow-2xl hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-2"
            >
              <span>BUILD MY JOURNEY</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: FAMOUS VS HIDDEN COMPARISON COMPONENT
      ======================================================== */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl p-6 sm:p-10 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400">
                Crowd Avoidance Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                Famous Tourist Trap vs. Hidden Gem Alternative
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                {discovery.comparison.benefitMessage}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Famous Destination */}
              <div className="p-6 rounded-3xl border-2 border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                    🔴 Famous Major Attraction
                  </span>
                  <span className="text-xs font-bold text-rose-600">Surge Density</span>
                </div>

                <h3 className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {discovery.comparison.famousName}
                </h3>

                <div className="space-y-3 text-xs font-medium text-stone-700 dark:text-stone-300">
                  <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900/40 pb-2">
                    <span>Crowd Occupancy:</span>
                    <span className="font-bold text-rose-600">{discovery.comparison.famousCrowd}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900/40 pb-2">
                    <span>Queue Wait Time:</span>
                    <span className="font-bold text-rose-600">~{discovery.comparison.famousWaitHours} Hours in Line</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-900/40 pb-2">
                    <span>Cost Level:</span>
                    <span className="font-bold">{discovery.comparison.famousCostTier}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Experience:</span>
                    <span className="text-rose-600">Rushed, crowded, congested transit</span>
                  </div>
                </div>
              </div>

              {/* Hidden Gem Alternative */}
              <div className="p-6 rounded-3xl border-2 border-emerald-400 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-4 shadow-lg ring-4 ring-emerald-500/20">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                    🟢 💎 Verified Hidden Gem
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Untouched Sanctuaries</span>
                </div>

                <h3 className="text-xl font-black text-stone-900 dark:text-stone-100">
                  {discovery.comparison.hiddenName}
                </h3>

                <div className="space-y-3 text-xs font-medium text-stone-700 dark:text-stone-300">
                  <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                    <span>Crowd Occupancy:</span>
                    <span className="font-bold text-emerald-600">{discovery.comparison.hiddenCrowd}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                    <span>Travel Time:</span>
                    <span className="font-bold text-emerald-600">{discovery.comparison.hiddenTravelTimeMins} mins scenic transit</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                    <span>Cost Level:</span>
                    <span className="font-bold text-emerald-600">{discovery.comparison.hiddenCostTier}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Experience:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      Tranquil nature, zero lines, pure exploration
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: COMPLETE JOURNEY PLAN
      ======================================================== */}
      {activeTab === 'journey' && (
        <div className="space-y-8">
          <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-10 shadow-xl space-y-8">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Itinerary Backbone
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
                Day-by-Day Hidden Places Journey
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                A seamless flow built around your uncovered gems, regional feasts, and nature viewpoints.
              </p>
            </div>

            {/* Day 1 */}
            <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs">
                    01
                  </span>
                  <span>Day 1: Hidden Nature &amp; Waterfall Expeditions</span>
                </h3>
                <span className="text-xs font-bold text-emerald-600">Eco-Score 95</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 font-bold">08:30 AM</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100">
                    {discovery.hiddenGems[0]?.gem.name || 'Nature Gem'}
                  </div>
                  <p className="text-stone-500">Morning canopy walk with fresh morning mist</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 font-bold">01:00 PM</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100">Regional Feast</div>
                  <p className="text-stone-500">Traditional banana-leaf lunch at local village kitchen</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 font-bold">04:30 PM</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100">
                    {discovery.hiddenGems[1]?.gem.name || 'Waterfall Gem'}
                  </div>
                  <p className="text-stone-500">Sunset rock pool swim &amp; golden hour photography</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 font-bold">08:00 PM</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100">Eco Heritage Stay</div>
                  <p className="text-stone-500">Comfortable eco-resort nestled near biosphere reserve</p>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs">
                    02
                  </span>
                  <span>Day 2: Living Heritage &amp; Panoramic Citadels</span>
                </h3>
                <span className="text-xs font-bold text-teal-600">Eco-Score 92</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 font-bold">09:00 AM</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100">
                    {discovery.hiddenGems[2]?.gem.name || 'Heritage Gem'}
                  </div>
                  <p className="text-stone-500">Prehistoric stone carvings &amp; secluded architectural pavilions</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 font-bold">01:30 PM</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100">Local Spices &amp; Chai</div>
                  <p className="text-stone-500">Authentic regional specialties prepared with GI-tagged ingredients</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 font-bold">04:00 PM</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100">
                    {discovery.hiddenGems[3]?.gem.name || 'Viewpoint Gem'}
                  </div>
                  <p className="text-stone-500">Scenic lake reservoir overlook with spotting of native birds</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-1">
                  <span className="text-stone-400 font-bold">07:00 PM</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100">Scenic Return Transit</div>
                  <p className="text-stone-500">Comfortable transit back to hub railway / bus terminal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: INTERACTIVE MAP
      ======================================================== */}
      {activeTab === 'map' && (
        <div className="rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl">
          <TravelMap
            destination={dest}
            showRouteOptimizer={true}
            onSelectGem={(gem) => setActiveModalGem(gem)}
          />
        </div>
      )}

      {/* ========================================================
          SURPRISE HIDDEN GEM MODAL
      ======================================================== */}
      <AnimatePresence>
        {isSurpriseRevealed && surpriseGem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg rounded-3xl overflow-hidden border-2 border-amber-400 bg-white dark:bg-stone-900 shadow-2xl space-y-4"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={surpriseGem.images[0]}
                  alt={surpriseGem.name}
                  className="w-full h-full object-cover brightness-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-black uppercase tracking-wider">
                  ✨ SECRET HIDDEN GEM REVEALED
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-2xl font-black">{surpriseGem.name}</h3>
                  <p className="text-xs text-stone-300 font-medium">{surpriseGem.subtitle}</p>
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  We selected this secret gem because it is safe, accessible, directly fits your budget (₹{surpriseGem.estimatedCostInr}), and is only {surpriseGem.travelTimeMinutes} mins from the route!
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      addGemToTrip(surpriseGem);
                      setIsSurpriseRevealed(false);
                      alert(`Added ${surpriseGem.name} to journey!`);
                    }}
                    className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow"
                  >
                    Add to Journey
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSurpriseRevealed(false)}
                    className="py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 font-extrabold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gem Details Modal */}
      <GemDetailsModal gem={activeModalGem} onClose={() => setActiveModalGem(null)} />
    </div>
  );
}
