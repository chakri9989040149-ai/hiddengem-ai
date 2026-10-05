'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DESTINATIONS, HOTELS_SEED, RESTAURANTS_SEED, GUIDES_SEED } from '@/lib/data/seed';
import { useAppStore } from '@/lib/store';
import { rankHiddenGems } from '@/lib/scoring';
import { GemCard } from '@/components/gems/GemCard';
import { GemDetailsModal } from '@/components/gems/GemDetailsModal';
import { CrowdAlertBanner } from '@/components/crowd/CrowdAlertBanner';
import { TravelMap } from '@/components/map/TravelMap';
import { formatCurrency } from '@/lib/utils';
import { DESTINATION_VISUALS } from '@/lib/destinationVisuals';
import { HiddenGem } from '@/types';
import {
  MapPin,
  Calendar,
  CloudSun,
  Star,
  Leaf,
  Hotel,
  UserCheck,
  Sparkles,
  Phone,
  Utensils,
} from 'lucide-react';

interface DestinationDetailClientProps {
  slug: string;
}

export default function DestinationDetailClient({ slug }: DestinationDetailClientProps) {
  const { preferences, setSelectedDestinationSlug } = useAppStore();
  const [activeModalGem, setActiveModalGem] = useState<HiddenGem | null>(null);

  const destination = DESTINATIONS.find((d) => d.slug === slug);

  if (!destination) {
    notFound();
  }

  const hotels = HOTELS_SEED.filter((h) => h.destinationSlug === destination.slug);
  const guides = GUIDES_SEED.filter((g) => g.destinationSlug === destination.slug);
  const ranked = rankHiddenGems(destination, preferences);

  // Vibe tags specific to destination
  const destinationTags =
    destination.slug === 'munnar'
      ? ['🌿 Nature', '🍵 Tea Gardens', '🌊 Hidden Waterfalls', '🧗 High Altitude Trekking']
      : destination.slug === 'hampi'
      ? ['🏛️ UNESCO Heritage', '🧗 Granite Bouldering', '🚣 Coracle Rafting', '🌅 Matanga Sunset']
      : ['🛕 Sacred Sanctums', '🌊 Forest Cascades', '🛡️ 11th-Century Forts', '🐒 Biosphere Reserve'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-28 select-none">
      {/* ========================================================
          1. FULL SCREEN DESTINATION HERO (Section 9 Requirement)
      ======================================================== */}
      <div className="relative rounded-3xl overflow-hidden min-h-[440px] sm:min-h-[520px] flex items-end p-6 sm:p-12 border border-white/20 dark:border-stone-800 shadow-2xl">
        <img
          src={DESTINATION_VISUALS[destination.slug]?.hero || destination.heroImage}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.55] contrast-[1.12] saturate-[1.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-3xl text-white">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-600/90 text-white font-extrabold text-xs uppercase tracking-wider backdrop-blur-md shadow">
              {destination.state}, {destination.country}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-stone-900/80 text-stone-200 text-xs font-bold backdrop-blur-md">
              Primary Hub: {destination.mainAttractionName}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-teal-500/80 text-white text-xs font-bold backdrop-blur-md">
              {destination.hiddenGems.length} Verified Uncrowded Gems
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight drop-shadow-md">
            {destination.name}
          </h1>

          <p className="text-sm sm:text-lg text-stone-200 leading-relaxed font-medium drop-shadow">
            {destination.description}
          </p>

          {/* Vibe Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {destinationTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold text-emerald-200"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              href="/plan-trip"
              onClick={() => setSelectedDestinationSlug(destination.slug)}
              className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-2xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan Journey to {destination.name}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* CROWD ALERT NOTIFICATION (If Main Attraction is Crowded) */}
      <CrowdAlertBanner destination={destination} />

      {/* ========================================================
          2. DESTINATION SPECS & WEATHER (IMAGE-BACKED METRICS)
      ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400">
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span className="font-extrabold uppercase text-[10px]">Live Weather</span>
          </div>
          <span className="font-black text-xl text-stone-900 dark:text-stone-100 block">
            {destination.weather.temperatureC}°C • {destination.weather.condition}
          </span>
          <span className="text-[11px] text-stone-500">Rain Probability: {destination.weather.rainProbability}%</span>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Calendar className="w-4 h-4 text-sky-500" />
            <span className="font-extrabold uppercase text-[10px]">Best Season</span>
          </div>
          <span className="font-black text-xl text-stone-900 dark:text-stone-100 block">
            {destination.weather.bestTravelWindow}
          </span>
          <span className="text-[11px] text-stone-500">Clear vistas & cool mountain breeze</span>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold uppercase text-[10px]">Hidden Gems</span>
          </div>
          <span className="font-black text-xl text-stone-900 dark:text-stone-100 block">
            {destination.hiddenGems.length} Sites
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">100% Uncrowded Alternatives</span>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold uppercase text-[10px]">Eco Health Score</span>
          </div>
          <span className="font-black text-xl text-emerald-600 dark:text-emerald-400 block">
            94 / 100
          </span>
          <span className="text-[11px] text-stone-500">Protected ecological biosphere</span>
        </div>
      </div>

      {/* ========================================================
          3. HIDDEN GEMS AROUND DESTINATION (FULL PHOTOGRAPHY)
      ======================================================== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
              Lesser-Known Treasures
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-0.5">
              Hidden Gems Around {destination.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Ranked by interest match, real-time crowd headroom, and accessibility.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ranked.map(({ gem, score }) => (
            <GemCard
              key={gem.id}
              gem={gem}
              score={score}
              onOpenDetails={(g) => setActiveModalGem(g)}
            />
          ))}
        </div>
      </div>

      {/* ========================================================
          4. RECOMMENDED STAYS & RESORTS (VISUAL TOURISM CARDS)
      ======================================================== */}
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-sky-600 dark:text-sky-400">
            Authentic Hospitality
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-0.5 flex items-center gap-2">
            <Hotel className="w-6 h-6 text-sky-500" />
            <span>Recommended Hotels & Eco Stays in {destination.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Plantation bungalows, heritage stone villas, and valley retreats with transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.map((h) => (
            <div
              key={h.id}
              className="group rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                  {h.type}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black flex items-center gap-1 shadow">
                  <Star className="w-3 h-3 fill-stone-950" />
                  <span>{h.rating}</span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors">
                    {h.name}
                  </h3>
                  <span className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{h.distanceFromCenterKm} km from destination center</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {h.amenities.map((a) => (
                    <span
                      key={a}
                      className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-bold"
                    >
                      {a}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Price Per Night</span>
                    <span className="text-lg font-black text-stone-900 dark:text-stone-100">
                      {formatCurrency(h.pricePerNightInr)}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Pre-booking preview for ${h.name} registered.`)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors shadow"
                  >
                    Check Stay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          5. AUTHENTIC FOOD EXPERIENCE (LARGE DISH PHOTOGRAPHY)
      ======================================================== */}
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-600 dark:text-amber-400">
            Regional Culinary Heritage
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-0.5 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-500" />
            <span>Authentic Local Food & Dishes</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            GI-tagged specialties and generational farm-to-table recipes you must taste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destination.localCuisine.map((dish, idx) => (
            <div
              key={idx}
              className="group rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                  {dish.isVeg ? '🟢 100% Pure Veg' : '🔴 Non-Veg Specialty'}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black shadow">
                  {dish.priceRange}
                </div>
              </div>

              <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                    {dish.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                  <span>Authentic Regional Recipe</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          6. VERIFIED LOCAL GUIDES (COMMUNITY CONNECT)
      ======================================================== */}
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
            Certified Storytellers
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-0.5 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            <span>Verified Local Naturalists & Historians</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Local residents licensed to guide forest canopy walks, ancient temple archaeology, and bouldering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((g) => (
            <div
              key={g.id}
              className="p-5 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md flex flex-col sm:flex-row items-center gap-5"
            >
              <img
                src={g.photo}
                alt={g.name}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-md"
              />
              <div className="space-y-1.5 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]">
                    Verified Naturalist
                  </span>
                  <span className="text-amber-500 font-black text-xs">★ {g.rating}</span>
                </div>
                <h4 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
                  {g.name}
                </h4>
                <p className="text-xs text-stone-500 font-medium">{g.specialty}</p>
                <div className="text-[11px] text-stone-400">
                  Languages: {g.languages.join(', ')}
                </div>
              </div>
              <div className="text-center sm:text-right shrink-0">
                <span className="font-black text-lg text-stone-900 dark:text-stone-100 block">
                  {formatCurrency(g.pricePerDayInr)}
                </span>
                <span className="text-[10px] text-stone-400 block mb-2">per day</span>
                <a
                  href={`tel:${g.phone}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Guide</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          7. GEOGRAPHIC ROUTE MAP (GIS SATELLITE & TERRAIN)
      ======================================================== */}
      <div className="space-y-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
            Geographic Proximity
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-0.5">
            Interactive Route Map & Distances
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Pins indicate exact GPS coordinates and travel times from {destination.mainAttractionName}.
          </p>
        </div>
        <TravelMap destination={destination} onSelectGem={(g) => setActiveModalGem(g)} />
      </div>

      {/* Details Modal */}
      <GemDetailsModal
        gem={activeModalGem}
        destination={destination}
        isOpen={!!activeModalGem}
        onClose={() => setActiveModalGem(null)}
      />
    </div>
  );
}
