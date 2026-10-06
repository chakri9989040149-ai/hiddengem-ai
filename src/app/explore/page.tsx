'use client';

import React, { useState } from 'react';
import { DESTINATIONS } from '@/lib/data/seed';
import { useAppStore } from '@/lib/store';
import { TravelMap } from '@/components/map/TravelMap';
import { GemDetailsModal } from '@/components/gems/GemDetailsModal';
import { getAssetPath } from '@/lib/utils';
import { HiddenGem } from '@/types';
import { DESTINATION_VISUALS } from '@/lib/destinationVisuals';
import {
  Compass,
  MapPin,
  Sparkles,
  Route,
  Layers,
  Filter,
  CheckCircle,
} from 'lucide-react';

export default function ExplorePage() {
  const { selectedDestinationSlug, setSelectedDestinationSlug, getSelectedDestination } =
    useAppStore();

  const [activeGem, setActiveGem] = useState<HiddenGem | null>(null);
  const destination = getSelectedDestination();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      {/* Cinematic Panoramic Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-end p-6 sm:p-8 border border-white/20 dark:border-stone-800 shadow-2xl">
        <img
          src={DESTINATION_VISUALS[selectedDestinationSlug]?.hero || destination.heroImage}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.55] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-1.5 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
              Interactive GIS Explorer • {destination.state}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Explore {destination.name} & Surrounds
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 font-medium">
              Click pins to inspect crowd levels and photos. Click &quot;Optimize My Route&quot; to eliminate circular backtracking.
            </p>
          </div>

          {/* Hub Selector */}
          <div className="flex items-center gap-2 self-start sm:self-end">
            {DESTINATIONS.map((d) => (
              <button
                key={d.slug}
                onClick={() => setSelectedDestinationSlug(d.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all backdrop-blur-md ${
                  selectedDestinationSlug === d.slug
                    ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/40'
                    : 'bg-stone-900/70 text-stone-300 hover:text-white border border-white/10'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Map */}
      <div className="w-full">
        <TravelMap
          destination={destination}
          showRouteOptimizer={true}
          onSelectGem={(gem) => setActiveGem(gem)}
        />
      </div>

      {/* Destination Gems List Below Map */}
      <div className="space-y-4 pt-4">
        <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
          Nearby Attractions ({destination.hiddenGems.length} Spots)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destination.hiddenGems.map((gem) => (
            <div
              key={gem.id}
              onClick={() => setActiveGem(gem)}
              className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <img
                  src={gem.images?.[0] || getAssetPath('/images/destinations/munnar_tea_hills.jpg')}
                  alt={gem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    const fallback =
                      gem.id === 'gem-marayoor'
                        ? getAssetPath('/images/destinations/munnar_marayoor_sandalwood.jpg')
                        : gem.destinationSlug === 'munnar'
                        ? getAssetPath('/images/destinations/munnar_tea_hills.jpg')
                        : gem.destinationSlug === 'hampi'
                        ? getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg')
                        : getAssetPath('/images/destinations/tirupati_talakona_waterfall.jpg');
                    e.currentTarget.src = fallback;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                  {gem.category} • {gem.distanceFromMainKm} km
                </span>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate group-hover:text-emerald-600">
                  {gem.name}
                </h4>
                <span className="text-[11px] text-stone-500 block truncate">
                  {gem.crowdData.level} crowd ({gem.crowdData.occupancyPercent}% full)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <GemDetailsModal gem={activeGem} onClose={() => setActiveGem(null)} />
    </div>
  );
}
