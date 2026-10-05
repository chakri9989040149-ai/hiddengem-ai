'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { DESTINATIONS } from '@/lib/data/seed';
import { useAppStore } from '@/lib/store';
import { rankHiddenGems } from '@/lib/scoring';
import { formatTime, formatCurrency } from '@/lib/utils';
import { TRAVEL_VISUALS } from '@/lib/travelVisuals';
import { DESTINATION_MEDIA } from '@/lib/destinationVisuals';
import { motion, AnimatePresence } from 'framer-motion';
import { GemCard } from '@/components/gems/GemCard';
import { GemDetailsModal } from '@/components/gems/GemDetailsModal';
import { CrowdAlertBanner } from '@/components/crowd/CrowdAlertBanner';
import { TravelToolsModal } from '@/components/travel-tools/TravelToolsModal';
import { TravelToolMode } from '@/lib/services/travelToolsService';
import { HiddenGem } from '@/types';
import {
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  ShieldAlert,
  Clock,
  Wallet,
  Leaf,
  Dices,
  Award,
  CheckCircle,
  AlertTriangle,
  Flame,
  ChevronRight,
  Train,
  Car,
  Plane,
  Bus,
  Camera,
  Heart,
  Users,
  User,
  ShieldCheck,
  Building,
  Navigation,
  Languages,
  CloudRain,
  Sun,
  PhoneCall,
  Star,
  Shield,
  Radio,
  Check,
  Globe,
} from 'lucide-react';
import { getDestinationWeatherForecast } from '@/lib/weatherService';

import { WorldExplorerMap } from '@/components/hero/WorldExplorerMap';

export default function HomePage() {
  const {
    preferences,
    updatePreferences,
    selectedDestinationSlug,
    setSelectedDestinationSlug,
    getSelectedDestination,
    isTravellingNow,
    setIsTravellingNow,
    setTranslatorOpen,
    guides,
    getCrowdPrediction,
  } = useAppStore();

  const [activeModalGem, setActiveModalGem] = useState<HiddenGem | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [requestedGuide, setRequestedGuide] = useState<string | null>(null);
  const [selectedTravelTool, setSelectedTravelTool] = useState<TravelToolMode | null>(null);

  const destination = getSelectedDestination();
  const ranked = rankHiddenGems(destination, preferences);
  const topGems = ranked.slice(0, 3);
  const activeMedia = DESTINATION_MEDIA[selectedDestinationSlug] || DESTINATION_MEDIA.tirupati;
  const weatherForecast = getDestinationWeatherForecast(selectedDestinationSlug, 3);
  const currentCrowd = getCrowdPrediction(selectedDestinationSlug);
  const destinationGuides = guides.filter(
    (g) => g.destinationSlug === selectedDestinationSlug || g.destinationSlug === 'tirupati'
  );

  // Category visual cards data
  const escapeCategories = [
    {
      name: 'Waterfalls',
      icon: '🌊',
      desc: 'Misty cascades & secret jungle plunge pools',
      image: TRAVEL_VISUALS.nature.waterfall[0],
      tag: 'Untouched',
    },
    {
      name: 'Mountains',
      icon: '⛰️',
      desc: 'Highland ridges above rolling sea of clouds',
      image: TRAVEL_VISUALS.nature.mountain[0],
      tag: 'Scenic Peaks',
    },
    {
      name: 'Beaches',
      icon: '🏖️',
      desc: 'Quiet coastal shores away from tourist swarms',
      image: TRAVEL_VISUALS.nature.beach[0],
      tag: 'Serene Waves',
    },
    {
      name: 'Nature',
      icon: '🌿',
      desc: 'Evergreen shola forests & wildlife reserves',
      image: TRAVEL_VISUALS.nature.forest[0],
      tag: 'Eco Haven',
    },
    {
      name: 'Spirituality',
      icon: '🛕',
      desc: 'Ancient sanctums & tranquil dawn meditation',
      image: TRAVEL_VISUALS.culture.temple[0],
      tag: 'Sacred Silence',
    },
    {
      name: 'History',
      icon: '🏛️',
      desc: '11th-century Vijayanagara citadels & ruins',
      image: TRAVEL_VISUALS.culture.history[0],
      tag: 'Living Heritage',
    },
    {
      name: 'Adventure',
      icon: '🧗',
      desc: 'Granite boulder climbing & canyon treks',
      image: TRAVEL_VISUALS.activities.adventure[0],
      tag: 'High Adrenaline',
    },
    {
      name: 'Photography',
      icon: '📸',
      desc: 'Golden hour vantage points with zero crowds',
      image: TRAVEL_VISUALS.activities.photography[0],
      tag: 'Cinematic Vistas',
    },
    {
      name: 'Food',
      icon: '🍲',
      desc: 'Authentic GI-tagged banana-leaf feasts',
      image: TRAVEL_VISUALS.food.localFood[0],
      tag: 'Culinary Soul',
    },
  ];

  // Transport options data - context aware based on active destination
  const transportCards = [
    {
      type: 'Train',
      label: 'Scenic Rail Journeys',
      subtitle: `${activeMedia.name} railway route & mountain express`,
      icon: Train,
      image: activeMedia.transportImages.Train || TRAVEL_VISUALS.transport.Train[0],
      stat: 'Zero Traffic • 100% Scenic',
    },
    {
      type: 'Car',
      label: 'Scenic Road Trips',
      subtitle: `${activeMedia.name} scenic highway & hidden valley paths`,
      icon: Car,
      image: activeMedia.transportImages.Car || TRAVEL_VISUALS.transport.Car[0],
      stat: 'Complete Freedom • Stop Anywhere',
    },
    {
      type: 'Bus',
      label: 'Eco Travel Coaches',
      subtitle: `${activeMedia.name} panoramic valley & heritage routes`,
      icon: Bus,
      image: activeMedia.transportImages.Bus || TRAVEL_VISUALS.transport.Bus[0],
      stat: 'Green Footprint • Group Friendly',
    },
    {
      type: 'Flight',
      label: 'Aerial Skyline Transit',
      subtitle: 'Fast regional access above cloud blankets',
      icon: Plane,
      image: activeMedia.transportImages.Flight || TRAVEL_VISUALS.transport.Flight[0],
      stat: 'Save Hours • Highland Access',
    },
  ];

  // People / Companion options data
  const companionCards = [
    {
      type: 'Solo',
      label: 'Solo Explorer',
      desc: 'Soulful trails, contemplative viewpoints & freedom',
      image: TRAVEL_VISUALS.people.solo[0],
      tag: 'Self Discovery',
    },
    {
      type: 'Couple',
      label: 'Romantic Escapes',
      desc: 'Sunset viewpoints, tranquil stays & intimate dining',
      image: TRAVEL_VISUALS.people.couple[0],
      tag: 'Private & Serene',
    },
    {
      type: 'Friends',
      label: 'Friends & Gangs',
      desc: 'Campfires, bouldering, road trips & group laughter',
      image: TRAVEL_VISUALS.people.friends[0],
      tag: 'Energetic Vibe',
    },
    {
      type: 'Family',
      label: 'Family & Kids',
      desc: 'Safe walkways, comfortable stays & wonder-filled sights',
      image: TRAVEL_VISUALS.people.family[0],
      tag: 'Safe & Comfortable',
    },
  ];

  // Popular destination hubs
  const destinationHubs = [
    {
      slug: 'munnar',
      name: 'Munnar',
      state: 'Kerala',
      subtitle: 'Tea Valley Cascades & Cloud-Capped Ridges',
      gemsCount: '12 Hidden Gems',
      image: TRAVEL_VISUALS.destinations.munnar.hero,
      highlights: ['Chinnakanal Waterfall', 'Kolukkumalai Sunrise', 'Lockhart Gap'],
    },
    {
      slug: 'hampi',
      name: 'Hampi',
      state: 'Karnataka',
      subtitle: 'UNESCO Boulders, Citadels & Coracle Rivers',
      gemsCount: '14 Hidden Gems',
      image: TRAVEL_VISUALS.destinations.hampi.hero,
      highlights: ['Sanapur Lake Rafting', 'Anegundi Royal Gate', 'Matanga Hill'],
    },
    {
      slug: 'tirupati',
      name: 'Tirupati',
      state: 'Andhra Pradesh',
      subtitle: 'Sacred Eastern Ghats, Waterfalls & Ancient Forts',
      gemsCount: '11 Hidden Gems',
      image: TRAVEL_VISUALS.destinations.tirupati.hero,
      highlights: ['Talakona Forest Falls', 'Silathoranam Prehistoric Arch', 'Chandragiri Fort'],
    },
  ];

  // Visual Itinerary travel timeline stops
  const timelineStops = [
    {
      step: '01',
      title: 'Arrival',
      subtitle: 'Scenic Rail Transition',
      time: '08:30 AM',
      image: TRAVEL_VISUALS.transport.Train[0],
      badge: 'Train Journey',
    },
    {
      step: '02',
      title: 'Check-In',
      subtitle: 'Plantation Heritage Stay',
      time: '10:00 AM',
      image: TRAVEL_VISUALS.accommodation.Resort[0],
      badge: 'Eco Resort',
    },
    {
      step: '03',
      title: 'Discover',
      subtitle: 'Untouched Waterfall Trail',
      time: '12:30 PM',
      image: TRAVEL_VISUALS.nature.waterfall[0],
      badge: 'Low Crowd Gem',
    },
    {
      step: '04',
      title: 'Local Feast',
      subtitle: 'Authentic Banana-Leaf Lunch',
      time: '02:00 PM',
      image: TRAVEL_VISUALS.food.localFood[0],
      badge: 'Local Cuisine',
    },
    {
      step: '05',
      title: 'Sunset View',
      subtitle: 'Ancient Citadel Vantage',
      time: '05:30 PM',
      image: TRAVEL_VISUALS.culture.history[0],
      badge: 'Golden Hour',
    },
    {
      step: '06',
      title: 'Night Journey',
      subtitle: 'Starry Mountain Pass Return',
      time: '08:00 PM',
      image: TRAVEL_VISUALS.transport.Car[0],
      badge: 'Scenic Highway',
    },
  ];

  return (
    <div className="space-y-28 pb-24 select-none">
      {/* ========================================================
          SECTION 1: FULL SCREEN HERO (CINEMATIC TOURISM WORLD)
      ======================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden rounded-b-3xl">
        {/* Full-Bleed High-Resolution Destination Travel Imagery with Smooth 800ms Crossfade */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedDestinationSlug}
              src={activeMedia.heroImages[0]}
              alt={activeMedia.name}
              initial={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full object-cover brightness-[0.55] contrast-[1.14] saturate-[1.25]"
            />
          </AnimatePresence>
        </div>

        {/* Multi-Layer Atmospheric Gradient Overlays */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/80 via-transparent to-sky-950/70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="space-y-8 text-white">
            {/* Header Experience */}
            <div className="max-w-4xl space-y-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 text-emerald-300 text-xs font-extrabold shadow-lg shadow-black/20">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>🌍 EXPLORE ANYWHERE • Click a country or destination to start discovering</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] drop-shadow-md">
                DISCOVER BEYOND <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300">
                  THE DESTINATION.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-stone-200 max-w-3xl leading-relaxed font-medium drop-shadow">
                Explore the world, uncover hidden places, and let AI build your perfect journey.
              </p>

              {/* Main Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/plan-trip"
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm sm:text-base shadow-2xl shadow-emerald-600/40 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all"
                >
                  <Globe className="w-5 h-5 text-emerald-200" />
                  <span>🌍 EXPLORE THE WORLD</span>
                </Link>

                <Link
                  href="/hidden-gems"
                  className="px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
                >
                  <span>💎 FIND HIDDEN GEMS</span>
                </Link>

                <Link
                  href="/surprise-me"
                  className="px-5 py-4 rounded-2xl backdrop-blur-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-extrabold text-sm sm:text-base flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Dices className="w-5 h-5 text-amber-400" />
                  <span>🎲 SURPRISE ME</span>
                </Link>
              </div>

              {/* Destination Hubs Switcher - Transforms Entire Visual Theme */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
                <span className="text-stone-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quick Destinations:</span>
                </span>
                {[
                  { slug: 'tirupati', name: 'Tirupati', state: 'Andhra Pradesh', icon: '🛕' },
                  { slug: 'hampi', name: 'Hampi', state: 'Karnataka', icon: '🏛️' },
                  { slug: 'munnar', name: 'Munnar', state: 'Kerala', icon: '🍵' },
                  { slug: 'goa', name: 'Goa', state: 'Goa', icon: '🏖️' },
                  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan', icon: '🏰' },
                  { slug: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', icon: '🌊' },
                ].map((d) => (
                  <button
                    key={d.slug}
                    onClick={() => setSelectedDestinationSlug(d.slug)}
                    className={`px-4 py-2 rounded-xl font-extrabold transition-all backdrop-blur-md flex items-center gap-1.5 ${
                      selectedDestinationSlug === d.slug
                        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 ring-2 ring-emerald-400 scale-105'
                        : 'bg-stone-900/70 text-stone-300 hover:text-white hover:bg-stone-800/90 border border-white/15 hover:scale-102'
                    }`}
                  >
                    <span>{d.icon}</span>
                    <span>{d.name}</span>
                    <span className="text-[10px] opacity-75 font-normal">({d.state})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 🌍 PROMINENT INTERACTIVE WORLD MAP (Replaces 3D globe) */}
            <div className="w-full pt-4">
              <WorldExplorerMap
                onSelectDestination={(slug) => setSelectedDestinationSlug(slug)}
                selectedDestinationSlug={selectedDestinationSlug}
              />
            </div>
          </div>

          {/* Travel Modes Visual Ribbon */}
          <div className="mt-14 pt-8 border-t border-white/15">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-300 block mb-4">
              Explore Popular Travel Modes
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5 text-xs font-bold text-white">
              {[
                { label: 'Flights', icon: '✈️', mode: 'flights' as TravelToolMode, hint: 'Air Hub' },
                { label: 'Trains', icon: '🚆', mode: 'trains' as TravelToolMode, hint: 'IRCTC Hub' },
                { label: 'Buses', icon: '🚌', mode: 'buses' as TravelToolMode, hint: 'RTC Fleet' },
                { label: 'Road Trips', icon: '🚗', mode: 'roadtrips' as TravelToolMode, hint: 'AI Route' },
                { label: 'Hotels', icon: '🏨', mode: 'hotels' as TravelToolMode, hint: 'Stays' },
                { label: 'Homestays', icon: '🏡', mode: 'homestays' as TravelToolMode, hint: 'Local Hosts' },
                { label: 'Local Guides', icon: '🧭', mode: 'guides' as TravelToolMode, hint: 'Verified' },
                { label: 'Trekking', icon: '🥾', mode: 'trekking' as TravelToolMode, hint: 'Trails' },
                { label: 'Beaches', icon: '🏖️', mode: 'beaches' as TravelToolMode, hint: 'Shores' },
                { label: 'Heritage', icon: '🏛️', mode: 'heritage' as TravelToolMode, hint: 'Temples' },
              ].map((m) => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => {
                    setSelectedTravelTool(m.mode);
                    if (m.mode === 'trains') updatePreferences({ transportPreference: 'Train' });
                    if (m.mode === 'flights') updatePreferences({ transportPreference: 'Flight' });
                    if (m.mode === 'buses') updatePreferences({ transportPreference: 'Bus' });
                    if (m.mode === 'roadtrips') updatePreferences({ transportPreference: 'Car' });
                  }}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-emerald-600/30 backdrop-blur-md border border-white/10 hover:border-emerald-400/50 flex flex-col items-center justify-center gap-1.5 transition-all hover:-translate-y-1 shadow-md cursor-pointer group text-center w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{m.icon}</span>
                  <span className="text-[11px] text-stone-200 group-hover:text-white font-bold leading-tight">
                    {m.label}
                  </span>
                  <span className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider opacity-80 group-hover:opacity-100 flex items-center gap-0.5">
                    Open ↗
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CROWD ALERT NOTIFICATION (If Active or Simulated)
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CrowdAlertBanner destination={destination} />
      </div>

      {/* ========================================================
          ACTIVE TRIP MODE: "I'M TRAVELLING NOW" LIVE COMPANION
      ======================================================== */}
      {isTravellingNow && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/95 via-teal-950/90 to-stone-950/95 border-2 border-emerald-500/80 shadow-2xl space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/60 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                    Active Trip Mode Engaged
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Currently Travelling in {destination.name}, {destination.state}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsTravellingNow(false)}
                className="px-3.5 py-1.5 rounded-xl border border-emerald-600/60 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 self-start sm:self-center"
              >
                Exit Active Mode
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <Link
                href="/explore"
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-1.5 text-center text-white transition-all hover:scale-105"
              >
                <span className="text-2xl">🗺️</span>
                <span className="text-xs font-bold">Live Map</span>
                <span className="text-[10px] text-emerald-300">GPS Routing</span>
              </Link>

              <button
                onClick={() => setTranslatorOpen(true)}
                className="p-3.5 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 flex flex-col items-center justify-center gap-1.5 text-center text-white transition-all hover:scale-105"
              >
                <span className="text-2xl">🌐</span>
                <span className="text-xs font-bold">Translator</span>
                <span className="text-[10px] text-sky-300">Speech & Voice</span>
              </button>

              <Link
                href="/ai-agent"
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-1.5 text-center text-white transition-all hover:scale-105"
              >
                <span className="text-2xl">🤖</span>
                <span className="text-xs font-bold">Tourist Help</span>
                <span className="text-[10px] text-emerald-300">Fact-Grounded</span>
              </Link>

              <a
                href="#forecast-dashboard"
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-1.5 text-center text-white transition-all hover:scale-105"
              >
                <span className="text-2xl">{weatherForecast[0]?.icon || '🌤️'}</span>
                <span className="text-xs font-bold">{weatherForecast[0]?.temperatureC || 28}°C</span>
                <span className="text-[10px] text-amber-300">{weatherForecast[0]?.rainProbability || 15}% Rain</span>
              </a>

              <Link
                href="/admin"
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-1.5 text-center text-white transition-all hover:scale-105"
              >
                <span className="text-2xl">👥</span>
                <span className="text-xs font-bold">Crowd: {currentCrowd.crowdLevel.toUpperCase()}</span>
                <span className="text-[10px] text-emerald-300">{currentCrowd.estimatedOccupancy}% Occupancy</span>
              </Link>

              <a
                href="#guides-section"
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-1.5 text-center text-white transition-all hover:scale-105"
              >
                <span className="text-2xl">🧑‍🏫</span>
                <span className="text-xs font-bold">Guide</span>
                <span className="text-[10px] text-emerald-300">{destinationGuides[0]?.name || 'Available'}</span>
              </a>

              <button
                onClick={() => setShowEmergencyModal(true)}
                className="p-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 flex flex-col items-center justify-center gap-1.5 text-center text-white transition-all hover:scale-105"
              >
                <span className="text-2xl">🆘</span>
                <span className="text-xs font-bold">Emergency</span>
                <span className="text-[10px] text-rose-300">112 / Hospital</span>
              </button>

              <Link
                href="/hidden-gems"
                className="p-3.5 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-400/40 flex flex-col items-center justify-center gap-1.5 text-center text-white transition-all hover:scale-105"
              >
                <span className="text-2xl">📍</span>
                <span className="text-xs font-bold">Nearby Gems</span>
                <span className="text-[10px] text-emerald-300">{destination.hiddenGems.length} Safe Spots</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          FINAL DASHBOARD QUICK ACTIONS (Section 18)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
                Travel Companion Hub
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                Quick Actions for {destination.name}
              </h2>
            </div>
            <button
              onClick={() => setIsTravellingNow(!isTravellingNow)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isTravellingNow
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isTravellingNow ? 'Active Trip On' : "I'm Travelling Now"}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <Link
              href="/hidden-discovery"
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-700 text-center space-y-1.5 transition-all hover:scale-105 group"
            >
              <span className="text-2xl block">💎</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600">Hidden Places</span>
            </Link>

            <Link
              href="/ai-agent"
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-700 text-center space-y-1.5 transition-all hover:scale-105 group"
            >
              <span className="text-2xl block">🤖</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600">Tourist Help</span>
            </Link>

            <button
              onClick={() => setTranslatorOpen(true)}
              className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 border border-sky-200 dark:border-sky-800 text-center space-y-1.5 transition-all hover:scale-105 group"
            >
              <span className="text-2xl block">🌐</span>
              <span className="text-xs font-bold text-sky-900 dark:text-sky-200">Live Translator</span>
            </button>

            <a
              href="#forecast-dashboard"
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-700 text-center space-y-1.5 transition-all hover:scale-105 group"
            >
              <span className="text-2xl block">🌦️</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600">Weather</span>
            </a>

            <Link
              href="/admin"
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200 dark:border-stone-700 text-center space-y-1.5 transition-all hover:scale-105 group"
            >
              <span className="text-2xl block">👥</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600">Crowd</span>
            </Link>

            <a
              href="#guides-section"
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-700 text-center space-y-1.5 transition-all hover:scale-105 group"
            >
              <span className="text-2xl block">🧑‍🏫</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600">Guides</span>
            </a>

            <Link
              href="/hidden-gems"
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-stone-200 dark:border-stone-700 text-center space-y-1.5 transition-all hover:scale-105 group"
            >
              <span className="text-2xl block">⭐</span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600">Reviews</span>
            </Link>

            <button
              onClick={() => setShowEmergencyModal(true)}
              className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 text-center space-y-1.5 transition-all hover:scale-105 group"
            >
              <span className="text-2xl block">🆘</span>
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200">Emergency</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          "💎 DISCOVER MY HIDDEN PLACES" HERO LAUNCH CARD
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-500/50 p-8 sm:p-12 bg-gradient-to-r from-stone-950 via-emerald-950/90 to-stone-950 text-white">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
              <span>💎 Core Tourism Discovery Engine</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              DISCOVER MY HIDDEN PLACES
            </h2>
            <p className="text-lg sm:text-xl text-stone-200 font-medium">
              &ldquo;Give us your budget. We’ll uncover the places most travellers miss.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              Enter your starting point, headcount, and budget. Our Quality Gate & Weather Intelligence scan across untouched waterfalls, lesser-known fortresses, and secluded viewpoints — with complete day-by-day journey construction.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/hidden-discovery"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-sm sm:text-base shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105"
              >
                <span>💎 DISCOVER HIDDEN PLACES</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <span className="text-xs text-stone-400">
                100% Explainable Recommendation Scores • Zero Invented Data
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION: 3-DAY WEATHER & CROWD FORECAST DASHBOARD (Section 10)
      ======================================================== */}
      <section id="forecast-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4" />
                  <span>Weather & Crowd Intelligence</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight mt-1">
                Multi-Day Forecast for {destination.name}
              </h2>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 max-w-sm">
              💡 {weatherForecast[1]?.isHighRain
                ? `${weatherForecast[0]?.dayName} is the better day to visit due to heavier rain expected on ${weatherForecast[1]?.dayName}.`
                : `${weatherForecast[1]?.dayName} offers lower crowd congestion with clear skies.`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {weatherForecast.map((day, idx) => (
              <div
                key={day.dayName}
                className={`p-5 rounded-2xl border transition-all ${
                  idx === 1
                    ? 'border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                    {day.dayName} ({day.dateStr})
                  </span>
                  <span className="text-2xl">{day.icon}</span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-stone-200 dark:border-stone-700/60">
                    <span className="text-stone-500">Weather Condition</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{day.condition}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-stone-200 dark:border-stone-700/60">
                    <span className="text-stone-500">Temperature & Rain</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {day.temperatureC}°C • {day.rainProbability}% Rain
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-stone-200 dark:border-stone-700/60">
                    <span className="text-stone-500">Crowd Outlook</span>
                    <span className={`font-bold ${day.crowdOutlook === 'low' ? 'text-emerald-600' : day.crowdOutlook === 'moderate' ? 'text-amber-600' : 'text-rose-600'}`}>
                      {day.crowdOutlook === 'low' ? '🟢 Low Crowd' : day.crowdOutlook === 'moderate' ? '🟡 Moderate Crowd' : '🔴 High Crowd'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-stone-500">Availability Forecast</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {day.availabilityOutlook === 'available' ? '🟢 Available' : '🟡 Limited Slots'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-xl bg-white dark:bg-stone-900 text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                  {day.advice}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION: LOCAL GUIDE SYSTEM + TRANSLATOR INTEGRATION (Section 11 & 12)
      ======================================================== */}
      <section id="guides-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
                Verified Local Expertise
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight mt-1">
                🧑‍🏫 Local Guides + 🌐 Language Support
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Visiting from another state? Pair a verified local guide with real-time audio translation.
              </p>
            </div>
            <Link
              href="/admin"
              className="text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center gap-1.5 self-start sm:self-center"
            >
              <span>Admin: Verify / Manage Guides</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationGuides.map((guide) => (
              <div
                key={guide.id}
                className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 space-y-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={guide.photo}
                    alt={guide.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-300 dark:border-stone-700"
                  />
                  <div>
                    <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                      {guide.name}
                    </h3>
                    {guide.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>✓ Verified Guide</span>
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <span>⭐ {guide.rating}</span>
                      <span className="text-stone-400 font-normal">({guide.experienceYears} yrs exp)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  <div>
                    <span className="text-stone-400 block font-medium">Languages Spoken:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {guide.languages.join(' • ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Specialization:</span>
                    <span>{guide.specialty}</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="font-black text-stone-900 dark:text-stone-100 text-sm">
                      ₹{guide.pricePerDayInr} / Day
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">🟢 Available Today</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                  <button
                    onClick={() => {
                      setRequestedGuide(guide.name);
                      setTimeout(() => setRequestedGuide(null), 2500);
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    {requestedGuide === guide.name ? '✓ Guide Requested!' : 'Request Guide'}
                  </button>
                  <button
                    onClick={() => setTranslatorOpen(true)}
                    className="px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 flex items-center gap-1"
                    title="Open Live Translator to communicate with this guide"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>Translator</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: "HOW DO YOU WANT TO TRAVEL?" (LARGE VISUAL CARDS)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
              Transport Visual Environment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
              How Do You Want to Travel?
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              Select your mode of transit. The platform immediately transforms its visual scenery and routing engine.
            </p>
          </div>
          <Link
            href="/plan-trip"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-end"
          >
            <span>Configure Transit In Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {transportCards.map((t) => {
            const Icon = t.icon;
            const isSelected = (preferences.transportPreference || 'Train') === t.type;
            return (
              <div
                key={t.type}
                onClick={() => updatePreferences({ transportPreference: t.type as any })}
                className={`group relative rounded-3xl overflow-hidden border-2 p-6 min-h-[300px] flex flex-col justify-end transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5 ${
                  isSelected
                    ? 'border-emerald-500 ring-4 ring-emerald-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-emerald-400'
                }`}
              >
                {/* Full Bleed High-Res Photography */}
                <img
                  src={t.image}
                  alt={t.label}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.5] contrast-[1.1] group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                <div className="relative z-10 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/90 backdrop-blur-md flex items-center justify-center shadow-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {isSelected && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-stone-950 font-extrabold text-[10px] uppercase tracking-wider shadow">
                        Active Mode
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    {t.label}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-medium">
                    {t.subtitle}
                  </p>
                  <div className="pt-2 text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>{t.stat}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION 3: "WHAT KIND OF ESCAPE ARE YOU LOOKING FOR?"
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
            Passions & Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            What Kind of Escape Are You Looking For?
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            From secluded mountain ridges and thundering cascades to living 11th-century fortresses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {escapeCategories.map((c) => (
            <Link
              key={c.name}
              href={`/hidden-gems?category=${c.name}`}
              className="group relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 p-6 min-h-[220px] flex flex-col justify-end shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all"
            >
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.45] contrast-[1.1] group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              <div className="relative z-10 text-white space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{c.icon}</span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">
                    {c.tag}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2">
                  {c.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 4: "TRAVEL WITH YOUR PEOPLE" (SOLO, COUPLE, FRIENDS, FAMILY)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
              Companion Dynamics
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
              Travel With Your People
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              Every travel cohort has unique pace, safety, and energy requirements.
            </p>
          </div>
          <span className="text-xs text-stone-500 font-bold">
            Current: {preferences.companionType || 'Friends'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {companionCards.map((comp) => {
            const isSelected = (preferences.companionType || 'Friends') === comp.type;
            return (
              <div
                key={comp.type}
                onClick={() => updatePreferences({ companionType: comp.type as any })}
                className={`group relative rounded-3xl overflow-hidden border-2 p-6 min-h-[320px] flex flex-col justify-end transition-all cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5 ${
                  isSelected
                    ? 'border-emerald-500 ring-4 ring-emerald-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-emerald-400'
                }`}
              >
                <img
                  src={comp.image}
                  alt={comp.label}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.5] contrast-[1.1] group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                <div className="relative z-10 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                      {comp.tag}
                    </span>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center text-xs font-black shadow">
                        ✓
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    {comp.label}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed font-medium">
                    {comp.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SECTION 5: "HIDDEN GEMS NEAR POPULAR DESTINATIONS"
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
              Gateway Destinations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
              Hidden Gems Near Famous Centers
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              Fly or ride to famous hubs, but discover secret valleys, ancient ruins, and tranquil waterfalls.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Open Interactive GIS Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinationHubs.map((hub) => (
            <div
              key={hub.slug}
              className="group relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={hub.image}
                  alt={hub.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                  {hub.state}, India
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-2xl font-black">{hub.name}</span>
                  <span className="block text-xs text-emerald-400 font-bold">{hub.gemsCount}</span>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-white dark:bg-stone-900">
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                  {hub.subtitle}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block">
                    Signature Hidden Spots:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hub.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Link
                    href={`/destination/${hub.slug}`}
                    className="flex-1 py-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-extrabold text-xs text-center hover:opacity-90 transition-opacity"
                  >
                    Explore Hub Details
                  </Link>
                  <Link
                    href="/plan-trip"
                    onClick={() => setSelectedDestinationSlug(hub.slug)}
                    className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center transition-all shadow"
                  >
                    Plan Trip
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 6: "CROWDS DON'T HAVE TO RUIN YOUR JOURNEY"
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-red-500/30 bg-gradient-to-br from-red-950/30 via-stone-900 to-emerald-950/30 backdrop-blur-xl p-8 sm:p-12 text-white shadow-2xl relative">
          <div className="max-w-3xl space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-extrabold">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Crowd Alert Engine Active</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Crowds Don't Have to Ruin Your Journey.
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed font-medium">
              When {destination.mainAttractionName} experiences peak queue surges (&gt; 3 hours wait), our transparent algorithm redirects you to uncrowded alternative sanctuaries just minutes away.
            </p>
          </div>

          {/* Top Ranked Uncrowded Gems Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topGems.map(({ gem, score }) => (
              <GemCard
                key={gem.id}
                gem={gem}
                score={score}
                onOpenDetails={(g) => setActiveModalGem(g)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 7: "YOUR JOURNEY, VISUALIZED" (STORYLINE TIMELINE)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
            Day-by-Day Visual Travel Story
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Your Journey, Visualized
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Understand your entire trip visually before you even pack. Every leg of the journey has photography.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {timelineStops.map((stop) => (
            <div
              key={stop.step}
              className="group relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 p-4 min-h-[260px] flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all"
            >
              <img
                src={stop.image}
                alt={stop.title}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.5] contrast-[1.1] group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

              <div className="relative z-10 flex items-center justify-between text-white">
                <span className="w-8 h-8 rounded-xl bg-emerald-600/90 backdrop-blur-md flex items-center justify-center text-xs font-black">
                  {stop.step}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-md text-[10px] font-bold text-stone-300">
                  {stop.time}
                </span>
              </div>

              <div className="relative z-10 text-white space-y-1">
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 text-[10px] font-extrabold uppercase">
                  {stop.badge}
                </span>
                <h4 className="text-base font-extrabold text-white group-hover:text-emerald-300">
                  {stop.title}
                </h4>
                <p className="text-[11px] text-stone-300 line-clamp-1">
                  {stop.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION 8: "SURPRISE ME" (SERENDIPITY ADVENTURE SECTION)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 border border-amber-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
            alt="Surprise Me Panoramic Background"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.45] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent" />

          <div className="relative z-10 max-w-xl space-y-4 text-white">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold">
              <Dices className="w-4 h-4 text-amber-400" />
              <span>Spontaneous Serendipity Mode</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Feeling Spontaneous? Let AI Surprise You.
            </h2>
            <p className="text-sm text-stone-200 leading-relaxed font-medium">
              Don’t want to spend hours planning? One click triggers an algorithmic spin through all uncrowded waterfalls, heritage ruins, and hill treks within your budget.
            </p>
            <div className="pt-2">
              <Link
                href="/surprise-me"
                className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-xl inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <Dices className="w-5 h-5 text-stone-950" />
                <span>SPIN FOR AN ADVENTURE</span>
              </Link>
            </div>
          </div>

          <div className="relative z-10 hidden lg:flex items-center gap-3">
            <div className="w-44 h-56 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-[-4deg] hover:rotate-0 transition-transform">
              <img
                src={TRAVEL_VISUALS.nature.waterfall[1]}
                alt="Waterfall reveal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-44 h-64 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl scale-105 z-10">
              <img
                src={TRAVEL_VISUALS.destinations.munnar.hero}
                alt="Munnar reveal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-44 h-56 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-[4deg] hover:rotate-0 transition-transform">
              <img
                src={TRAVEL_VISUALS.destinations.hampi.hero}
                alt="Hampi reveal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: "TRAVEL SMARTER" (ECO, BUDGET, CROWD, ROUTE)
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
            Intelligent Engineering
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Travel Smarter, Greener & Within Budget
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Four pillars that make HiddenGem AI mathematically superior to ordinary booking engines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative rounded-3xl overflow-hidden p-6 min-h-[240px] flex flex-col justify-end border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all group">
            <img
              src={TRAVEL_VISUALS.nature.forest[0]}
              alt="Eco Score"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 text-white space-y-1.5">
              <span className="text-2xl block">🌱</span>
              <h3 className="font-extrabold text-lg text-white">Eco Score Tracking</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Prioritize rail and eco-certified homestays to earn green badges and cut your carbon footprint.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden p-6 min-h-[240px] flex flex-col justify-end border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all group">
            <img
              src={TRAVEL_VISUALS.accommodation.Hotel[0]}
              alt="Budget Optimization"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 text-white space-y-1.5">
              <span className="text-2xl block">💰</span>
              <h3 className="font-extrabold text-lg text-white">Budget & Expense Splitter</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Deterministic cost calculation and group bill settlements so nobody is left guessing.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden p-6 min-h-[240px] flex flex-col justify-end border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all group">
            <img
              src={TRAVEL_VISUALS.transport.Car[0]}
              alt="TSP Route Optimizer"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 text-white space-y-1.5">
              <span className="text-2xl block">⚡</span>
              <h3 className="font-extrabold text-lg text-white">TSP Route Optimizer</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Eliminates circular backtracking, saving up to 40% of driving time through GIS nearest-neighbor paths.
              </p>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden p-6 min-h-[240px] flex flex-col justify-end border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all group">
            <img
              src={TRAVEL_VISUALS.culture.temple[0]}
              alt="AI Crowd Intelligence"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 text-white space-y-1.5">
              <span className="text-2xl block">🛡️</span>
              <h3 className="font-extrabold text-lg text-white">Crowd Intelligence</h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Real-time queue monitoring at major temples and peaks with proactive redirection to peaceful gems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10: FINAL CTA ("YOUR NEXT STORY IS WAITING.")
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden min-h-[360px] flex items-center justify-center p-8 sm:p-14 text-center text-white shadow-2xl border border-stone-700">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2560&q=85"
            alt="Sunset road trip expedition"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.45] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/40" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 block">
              Begin Your Exploration
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              YOUR NEXT STORY IS WAITING.
            </h2>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-medium">
              Join thousands of conscious travellers escaping overcrowded tourist lines and discovering India’s true hidden treasures.
            </p>
            <div className="pt-3">
              <Link
                href="/plan-trip"
                className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-2xl shadow-emerald-600/40 inline-flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
              >
                <span>✨ PLAN MY JOURNEY NOW</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Details Modal */}
      {activeModalGem && (
        <GemDetailsModal
          gem={activeModalGem}
          destination={destination}
          isOpen={!!activeModalGem}
          onClose={() => setActiveModalGem(null)}
        />
      )}

      {/* Destination-Aware Emergency Helpline Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🆘</span>
                <div>
                  <h3 className="text-xl font-black text-rose-600">Tourist Emergency Helpline</h3>
                  <span className="text-xs text-stone-500">{destination.name}, {destination.state}</span>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 space-y-1">
                <span className="font-extrabold text-rose-900 dark:text-rose-200 block text-sm">
                  National All-Emergency Dispatch: 112
                </span>
                <p className="text-rose-700 dark:text-rose-300">
                  Immediate police, ambulance, and disaster rescue throughout India.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 space-y-2">
                <span className="font-bold text-stone-900 dark:text-stone-100 block">
                  Local Emergency Hospitals & Facilities:
                </span>
                <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                  {selectedDestinationSlug === 'tirupati'
                    ? '• SVIMS Sri Venkateswara Institute of Medical Sciences (Alipiri Rd) • RUIA Govt General Hospital'
                    : selectedDestinationSlug === 'munnar'
                    ? '• Tata General Hospital (High Range, 04865-230222) • Govt Adimali Taluk Hospital'
                    : selectedDestinationSlug === 'hampi'
                    ? '• Hospet Government 24/7 Trauma Hospital (12 km) • Kamalapur Health Center'
                    : selectedDestinationSlug === 'goa'
                    ? '• Goa Medical College Hospital (Bambolim - 24/7) • Asilo District Hospital'
                    : selectedDestinationSlug === 'jaipur'
                    ? '• SMS Hospital JL Marg (24/7 Trauma Center) • Santokba Memorial'
                    : '• Sir Sunderlal Hospital (IMS-BHU 24/7 Emergency) • Heritage Hospital'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 space-y-1 text-stone-700 dark:text-stone-300">
                <span className="font-bold block text-stone-900 dark:text-stone-100">Tourism & Women Helpline:</span>
                <div>• Tourist Police Helpline: 1363 (Toll Free 24/7)</div>
                <div>• Women Safety Helpline: 1091 / 181</div>
              </div>
            </div>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs"
            >
              Close Help Desk
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          POPULAR TRAVEL MODES MODAL (ALL 10 FULLY FUNCTIONAL TOOLS)
      ======================================================== */}
      <TravelToolsModal
        isOpen={!!selectedTravelTool}
        onClose={() => setSelectedTravelTool(null)}
        initialMode={selectedTravelTool || 'trains'}
      />
    </div>
  );
}
