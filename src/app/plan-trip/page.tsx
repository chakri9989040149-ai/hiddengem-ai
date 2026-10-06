'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { DESTINATIONS } from '@/lib/data/seed';
import { Category, TravelStyle, TravelType, HiddenGem, PlanningMode, CrowdLevel } from '@/types';
import {
  rankHiddenGems,
  findSimilarDestinations,
  getAlternativeRecommendations,
} from '@/lib/scoring';
import { getTransportImage, getCompanionImage, getAccommodationImage, TRAVEL_IMAGES } from '@/lib/travel-images';
import { getContextualTravelImage, TRAVEL_VISUALS } from '@/lib/travelVisuals';
import { getDestinationMedia } from '@/lib/destinationVisuals';
import { GemCard } from '@/components/gems/GemCard';
import { GemDetailsModal } from '@/components/gems/GemDetailsModal';
import { CrowdAlertBanner } from '@/components/crowd/CrowdAlertBanner';
import { ItineraryView } from '@/components/itinerary/ItineraryView';
import { BudgetCalculator } from '@/components/budget/BudgetCalculator';
import { ExpenseSplitter } from '@/components/budget/ExpenseSplitter';
import { TravelMap } from '@/components/map/TravelMap';
import { formatCurrency, formatTime } from '@/lib/utils';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Clock,
  Compass,
  CheckCircle,
  SlidersHorizontal,
  Route,
  ArrowRight,
  Layers,
  Leaf,
  Navigation,
  HelpCircle,
  Building,
  RotateCcw,
  Hotel,
  CloudSun,
  Flame,
  Shield,
  Train,
  Car,
  Plane,
  Bus,
} from 'lucide-react';

export default function PlanTripPage() {
  const {
    preferences,
    updatePreferences,
    selectedDestinationSlug,
    setSelectedDestinationSlug,
    getSelectedDestination,
    selectedGems,
    activeTrip,
    generateItineraryFromState,
    getCrowdPrediction,
    requestCurrentLocation,
    locationStatus,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'preferences' | 'recommendations' | 'itinerary' | 'budget' | 'map'
  >('preferences');
  const [recommendationType, setRecommendationType] = useState<'nearby' | 'similar'>('nearby');
  const [activeModalGem, setActiveModalGem] = useState<HiddenGem | null>(null);
  const [notExpectedMode, setNotExpectedMode] = useState<
    'all' | 'nearby' | 'similar' | 'quieter' | 'adventurous' | 'scenic' | 'family'
  >('all');
  const [showNotExpectedMenu, setShowNotExpectedMenu] = useState(false);

  const destination = getSelectedDestination();
  const crowd = getCrowdPrediction();

  // Recommendations: Nearby
  const ranked = rankHiddenGems(destination, preferences);
  // Recommendations: Similar
  const similarDestinations = findSimilarDestinations(destination.slug, preferences);
  // Recommendations: "Not what you expected?" alternative
  const alternatives = getAlternativeRecommendations(destination, preferences, notExpectedMode);

  const activeGemsList =
    notExpectedMode !== 'all'
      ? alternatives
      : recommendationType === 'nearby'
      ? ranked
      : similarDestinations.map((s) => ({ gem: s.gem, score: s.score }));

  const allCategories: Category[] = [
    'Nature',
    'Photography',
    'History',
    'Adventure',
    'Spirituality',
    'Divine',
    'Waterfalls',
    'Mountains',
    'Heritage',
    'Food',
  ];

  const companionOptions: TravelType[] = [
    'Friends',
    'Family',
    'Couple',
    'Solo',
    'Seniors',
    'Children',
  ];

  const transportOptions = [
    { type: 'Train', label: 'Scenic Train', icon: Train },
    { type: 'Car', label: 'Road Trip (Car)', icon: Car },
    { type: 'Bus', label: 'Tour Bus', icon: Bus },
    { type: 'Flight', label: 'Flight', icon: Plane },
  ];

  const distanceOptions = [
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
    { label: '25 km', value: 25 },
    { label: '50 km', value: 50 },
    { label: '100 km', value: 100 },
    { label: '200+ km', value: 200 },
  ];

  const travelTimeOptions = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: '4 hours', value: 240 },
    { label: 'Flexible', value: 360 },
  ];

  const handleInterestToggle = (cat: Category) => {
    const current = preferences.interests || [];
    if (current.includes(cat)) {
      updatePreferences({ interests: current.filter((c) => c !== cat) });
    } else {
      updatePreferences({ interests: [...current, cat] });
    }
  };

  const handleDiscoverGems = () => {
    setActiveTab('recommendations');
  };

  const handleGenerateItinerary = () => {
    generateItineraryFromState();
    setActiveTab('itinerary');
  };

  // Strict Destination-Aware Hero Banner (Tirumala Temple / Seshachalam Hills for Tirupati)
  const currentHeroBanner = getDestinationMedia({
    destination: selectedDestinationSlug,
    preferHero: true,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* ========================================================
          DYNAMIC CONTEXT-AWARE HERO BANNER (Section 5, 8, 11, 12, 13)
      ======================================================== */}
      <div className="relative rounded-3xl overflow-hidden min-h-[250px] sm:min-h-[300px] flex items-end p-6 sm:p-10 border border-white/20 dark:border-stone-800 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={`${preferences.transportPreference}-${selectedDestinationSlug}-${preferences.companionType}-${preferences.interests[0]}`}
            src={currentHeroBanner}
            alt="Contextual Journey Banner"
            initial={{ opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.55] contrast-[1.15] saturate-[1.2]"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-600/90 text-white font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-md shadow">
                {preferences.transportPreference || 'Train'} Journey
              </span>
              <span className="px-3.5 py-1 rounded-full bg-stone-900/80 text-stone-200 text-[11px] font-bold backdrop-blur-md">
                {preferences.companionType} Companion
              </span>
              <span className="px-3.5 py-1 rounded-full bg-stone-900/80 text-emerald-300 text-[11px] font-bold backdrop-blur-md">
                Hub: {destination.name}
              </span>
              {preferences.interests[0] && (
                <span className="px-3.5 py-1 rounded-full bg-teal-600/80 text-white text-[11px] font-bold backdrop-blur-md">
                  Vibe: {preferences.interests[0]}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              {destination.name} Journey Planner
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 font-medium max-w-xl leading-relaxed">
              Real-time contextual discovery: your transport, companion, and passions dynamically transform your scenery, itinerary, and uncrowded gem rankings.
            </p>
          </div>

          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black flex items-center gap-1.5 shadow-xl backdrop-blur-md self-start sm:self-end hover:scale-105 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Admin Crowd Simulator</span>
          </Link>
        </div>
      </div>

      {/* Main Flow Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'preferences'
              ? 'bg-emerald-700 text-white shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <span>1. Trip Preferences</span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'recommendations'
              ? 'bg-emerald-700 text-white shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>2. Ranked Gems ({activeGemsList.length})</span>
        </button>

        <button
          onClick={() => {
            if (!activeTrip) generateItineraryFromState();
            setActiveTab('itinerary');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'itinerary'
              ? 'bg-emerald-700 text-white shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>3. Complete Itinerary</span>
        </button>

        <button
          onClick={() => {
            if (!activeTrip) generateItineraryFromState();
            setActiveTab('budget');
          }}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'budget'
              ? 'bg-emerald-700 text-white shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>4. Budget & Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'map'
              ? 'bg-emerald-700 text-white shadow'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>5. Route Map</span>
        </button>
      </div>

      {/* CROWD ALERT (Displays if High Crowd) */}
      <CrowdAlertBanner destination={destination} />

      {/* ========================================================
          TAB 1: PREFERENCES FORM (Context-Aware Image System)
      ======================================================== */}
      {activeTab === 'preferences' && (
        <div className="rounded-3xl border border-white/40 dark:border-stone-800/80 bg-white/80 dark:bg-stone-950/80 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* REQUIREMENT 5: DYNAMIC TRANSPORT SELECTION WITH VISUAL TRANSITION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400">
                Transport Mode (Visual Background Reacts)
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                Active: {preferences.transportPreference || 'Train'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {transportOptions.map((t) => {
                const Icon = t.icon;
                const isSelected = (preferences.transportPreference || 'Train') === t.type;
                const previewImg = getTransportImage(t.type);

                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => updatePreferences({ transportPreference: t.type as any })}
                    className={`relative rounded-2xl overflow-hidden border-2 p-3.5 text-left transition-all group ${
                      isSelected
                        ? 'border-emerald-600 shadow-lg scale-102 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={previewImg}
                        alt={t.label}
                        className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="relative z-10 text-white space-y-1">
                      <div className="w-8 h-8 rounded-lg bg-stone-900/70 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="font-extrabold text-sm block drop-shadow">{t.label}</span>
                      <span className="text-[10px] text-stone-300 block">
                        {t.type === 'Train'
                          ? 'Scenic mountain rail'
                          : t.type === 'Car'
                          ? 'Coastal / valley road trip'
                          : t.type === 'Bus'
                          ? 'Eco travel coach'
                          : 'Aerial skyline transit'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TWO PLANNING MODES */}
          <div className="space-y-3 pt-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400">
              Planning Mode
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => updatePreferences({ planningMode: 'fixed_destination' })}
                className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-3 ${
                  preferences.planningMode === 'fixed_destination'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-600 text-white mt-0.5">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-sm block">I Already Have a Destination</span>
                  <span className="text-[11px] font-normal opacity-80 block mt-0.5">
                    Select Tirupati, Hampi, or Munnar and find uncrowded gems around it.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updatePreferences({ planningMode: 'near_me' })}
                className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-3 ${
                  preferences.planningMode === 'near_me'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400'
                }`}
              >
                <div className="p-2 rounded-xl bg-teal-600 text-white mt-0.5">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-sm block">Explore Near Me</span>
                  <span className="text-[11px] font-normal opacity-80 block mt-0.5">
                    Use browser GPS or location to discover nearby waterfalls, citadels, and treks.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* CURRENT LOCATION BAR */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Current Location Reference</span>
              </span>
              <p className="text-[11px] text-stone-500">
                {preferences.userCurrentLocation?.address ||
                  'No GPS set — Using Tirupati Hub coordinates (Manual Default)'}
              </p>
            </div>

            <button
              type="button"
              onClick={requestCurrentLocation}
              disabled={locationStatus === 'requesting'}
              className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs shadow flex items-center gap-1.5 self-start sm:self-center hover:bg-emerald-700"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>
                {locationStatus === 'requesting'
                  ? 'Detecting GPS...'
                  : locationStatus === 'acquired'
                  ? 'GPS Acquired ✓'
                  : 'Use My Current Location'}
              </span>
            </button>
          </div>

          {/* FIXED DESTINATION OVERVIEW CARD */}
          {preferences.planningMode === 'fixed_destination' && (
            <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-50/40 via-white to-stone-50 dark:from-emerald-950/30 dark:via-stone-900 dark:to-stone-950 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                    Your Selected Destination
                  </span>
                  <h3 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                    {destination.name}, {destination.state}
                  </h3>
                </div>

                {/* NOT WHAT YOU EXPECTED? TRIGGER */}
                <button
                  type="button"
                  onClick={() => setShowNotExpectedMenu(!showNotExpectedMenu)}
                  className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 self-start sm:self-center"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Not what you expected?</span>
                </button>
              </div>

              {/* Destination Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                  <span className="text-stone-400 block text-[10px] uppercase">Main Attraction</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {destination.mainAttractionName}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                  <span className="text-stone-400 block text-[10px] uppercase">Current Crowd</span>
                  <span className="font-bold text-rose-600 capitalize">
                    {crowd.crowdLevel} ({crowd.estimatedOccupancy}%)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                  <span className="text-stone-400 block text-[10px] uppercase">Opening Hours</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {destination.openingHours}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                  <span className="text-stone-400 block text-[10px] uppercase">Best Season</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {destination.weather.bestTravelWindow}
                  </span>
                </div>
              </div>

              {/* "Not what you expected?" expanded options */}
              {showNotExpectedMenu && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 font-extrabold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Let&apos;s find something better:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      { key: 'nearby', label: '📍 Nearby Alternatives' },
                      { key: 'similar', label: '✨ Similar Vibe' },
                      { key: 'quieter', label: '🤫 Quieter / Empty' },
                      { key: 'adventurous', label: '🧗 More Adventurous' },
                      { key: 'scenic', label: '📸 More Scenic' },
                      { key: 'family', label: '👨‍👩‍👧 More Family-Friendly' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => {
                          setNotExpectedMode(opt.key as any);
                          setActiveTab('recommendations');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700 font-bold hover:bg-amber-100 text-stone-800 dark:text-stone-200"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WHO ARE YOU TRAVELLING WITH? (Visual Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-extrabold tracking-wider text-stone-700 dark:text-stone-300">
                Who are you travelling with? (Friends &amp; Family specifically influence recommendations)
              </label>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {preferences.companionType} Mode Active
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              {companionOptions.map((c) => {
                const compImg = getCompanionImage(c);
                const isSelected = preferences.companionType === c;

                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updatePreferences({ companionType: c, travelType: c })}
                    className={`relative rounded-2xl overflow-hidden border-2 p-3 text-center transition-all group ${
                      isSelected
                        ? 'border-emerald-600 shadow-md scale-102 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={compImg}
                        alt={c}
                        className="w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="relative z-10 text-white">
                      <span className="text-xl block mb-0.5">
                        {c === 'Friends'
                          ? '👥'
                          : c === 'Family'
                          ? '👨‍👩‍👧'
                          : c === 'Couple'
                          ? '💑'
                          : c === 'Solo'
                          ? '🎒'
                          : c === 'Seniors'
                          ? '🧓'
                          : '👶'}
                      </span>
                      <span className="font-extrabold text-xs block drop-shadow">{c}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* INTERESTS (Visual Categories) */}
          <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-extrabold tracking-wider text-stone-700 dark:text-stone-300">
                What are you interested in? (30% Match Weight)
              </label>
              <span className="text-xs text-stone-400">
                {preferences.interests.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {allCategories.map((cat) => {
                const isSelected = preferences.interests.includes(cat);
                const catImg =
                  TRAVEL_IMAGES.categories[cat as keyof typeof TRAVEL_IMAGES.categories]?.[0] ||
                  TRAVEL_IMAGES.categories.Nature[0];

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleInterestToggle(cat)}
                    className={`relative rounded-2xl overflow-hidden border-2 p-3 text-left transition-all group ${
                      isSelected
                        ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src={catImg}
                        alt={cat}
                        className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="relative z-10 text-white flex items-center justify-between">
                      <span className="font-extrabold text-xs drop-shadow">{cat}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CROWD PREFERENCE */}
          <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <label className="text-xs uppercase font-extrabold tracking-wider text-stone-700 dark:text-stone-300 block">
              How much crowd are you comfortable with?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { level: 'low', label: '🟢 Low Crowd', desc: 'Serene, unhurried, zero queues' },
                { level: 'moderate', label: '🟡 Moderate Crowd', desc: 'Balanced lively atmosphere' },
                { level: 'high', label: '🔴 High Crowd Tolerance', desc: 'Any occupancy acceptable' },
              ].map((c) => (
                <button
                  key={c.level}
                  type="button"
                  onClick={() => updatePreferences({ crowdPreference: c.level as CrowdLevel })}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    preferences.crowdPreference === c.level
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <span className="font-extrabold text-xs block">{c.label}</span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* MAXIMUM DISTANCE & TRAVEL TIME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 dark:border-stone-800">
            {/* Maximum Distance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase font-extrabold tracking-wider text-stone-700 dark:text-stone-300">
                  Maximum Distance
                </label>
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                  {preferences.maxDistanceKm} km
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {distanceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updatePreferences({ maxDistanceKm: opt.value })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      preferences.maxDistanceKm === opt.value
                        ? 'bg-emerald-700 text-white shadow'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Maximum Travel Time */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase font-extrabold tracking-wider text-stone-700 dark:text-stone-300">
                  Maximum Travel Time
                </label>
                <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                  {formatTime(preferences.maxTravelTimeMinutes || 60)}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {travelTimeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updatePreferences({ maxTravelTimeMinutes: opt.value })}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      preferences.maxTravelTimeMinutes === opt.value
                        ? 'bg-emerald-700 text-white shadow'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* OVERNIGHT STAY PREFERENCE */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Hotel className="w-4 h-4 text-sky-600" />
                <span>Are you willing to stay overnight?</span>
              </span>
              <p className="text-[11px] text-stone-500">
                {preferences.isOvernightWilling
                  ? 'YES — Allows recommending farther hidden valleys with eco-resort stays.'
                  : 'NO — Strictly prioritizes convenient same-day return excursions.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updatePreferences({ isOvernightWilling: true })}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  preferences.isOvernightWilling
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => updatePreferences({ isOvernightWilling: false })}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  !preferences.isOvernightWilling
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                NO
              </button>
            </div>
          </div>

          {/* People, Duration & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div>
              <label className="text-xs uppercase font-black text-stone-700 dark:text-stone-200 block mb-1">
                Travellers: {preferences.groupSize}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={preferences.groupSize}
                onChange={(e) => updatePreferences({ groupSize: parseInt(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs uppercase font-black text-stone-700 dark:text-stone-200 block mb-1">
                Trip Duration: {preferences.durationDays} Days
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => updatePreferences({ durationDays: d })}
                    className={`py-1.5 rounded-lg text-xs font-bold ${
                      preferences.durationDays === d
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {d}D
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase font-black text-stone-700 dark:text-stone-200 block mb-1">
                Target Budget: {formatCurrency(preferences.totalBudgetInr || 10000)}
              </label>
              <input
                type="range"
                min="3000"
                max="40000"
                step="1000"
                value={preferences.totalBudgetInr || 10000}
                onChange={(e) => updatePreferences({ totalBudgetInr: parseInt(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end">
            <button
              onClick={handleDiscoverGems}
              className="px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-xl shadow-emerald-700/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Discover My Hidden Gems</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: RANKED GEMS (With Nearby & Similar Engine Tabs)
      ======================================================== */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Sub Navigation: Nearby vs Similar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-100/80 dark:bg-stone-800/60 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setRecommendationType('nearby');
                  setNotExpectedMode('all');
                }}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                  recommendationType === 'nearby' && notExpectedMode === 'all'
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300'
                }`}
              >
                📍 Nearby Hidden Gems ({ranked.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecommendationType('similar');
                  setNotExpectedMode('all');
                }}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                  recommendationType === 'similar' && notExpectedMode === 'all'
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300'
                }`}
              >
                ✨ Similar Destinations ({similarDestinations.length})
              </button>

              {notExpectedMode !== 'all' && (
                <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold flex items-center gap-1">
                  <span>Filtered: {notExpectedMode}</span>
                  <button onClick={() => setNotExpectedMode('all')}>✕</button>
                </span>
              )}
            </div>

            <button
              onClick={handleGenerateItinerary}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>Build Complete Itinerary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeGemsList.map(({ gem, score }) => (
              <GemCard
                key={gem.id}
                gem={gem}
                score={score}
                onOpenDetails={(g) => setActiveModalGem(g)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: COMPLETE ITINERARY
      ======================================================== */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {activeTrip ? (
            <ItineraryView trip={activeTrip} />
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
              <Calendar className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Ready to Generate Your Schedule
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                We will compose a realistic daily itinerary with logistics, dining, and scenic stops.
              </p>
              <button
                onClick={handleGenerateItinerary}
                className="px-6 py-3 rounded-2xl bg-emerald-700 text-white text-xs font-bold shadow hover:bg-emerald-800"
              >
                Generate Day-by-Day Plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 4: BUDGET & EXPENSES
      ======================================================== */}
      {activeTab === 'budget' && (
        <div className="space-y-8">
          <BudgetCalculator trip={activeTrip} preferences={preferences} />
          <ExpenseSplitter />
        </div>
      )}

      {/* ========================================================
          TAB 5: ROUTE MAP
      ======================================================== */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 text-white border border-white/20 dark:border-stone-800 shadow-xl min-h-[160px] flex flex-col justify-end">
            <img
              src={getDestinationMedia({ destination: selectedDestinationSlug, preferHero: true })}
              alt={destination.name}
              className="absolute inset-0 w-full h-full object-cover brightness-[0.45] contrast-[1.1] saturate-[1.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white font-extrabold text-[10px] uppercase tracking-wider">
                  📍 {destination.name} Geographic Map
                </span>
                <h3 className="font-black text-2xl sm:text-3xl tracking-tight drop-shadow">
                  {destination.name} Regional Route Map
                </h3>
                <p className="text-xs text-stone-200">
                  Visualizing uncrowded hidden gems around {destination.name}. Click &quot;Optimize My Route&quot; to eliminate circular backtracking.
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-stone-900/80 backdrop-blur-md border border-white/20 text-xs font-bold text-stone-200 self-start sm:self-end">
                Hub: {destination.name} ({destination.state})
              </div>
            </div>
          </div>
          <TravelMap destination={destination} onSelectGem={(g) => setActiveModalGem(g)} />
        </div>
      )}

      {/* Details Modal */}
      <GemDetailsModal
        gem={activeModalGem}
        score={activeModalGem ? ranked.find((r) => r.gem.id === activeModalGem.id)?.score : undefined}
        onClose={() => setActiveModalGem(null)}
      />
    </div>
  );
}
