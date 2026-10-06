'use client';

import React, { useState } from 'react';
import { DESTINATIONS } from '@/lib/data/seed';
import { useAppStore } from '@/lib/store';
import { rankHiddenGems } from '@/lib/scoring';
import { GemCard } from '@/components/gems/GemCard';
import { GemDetailsModal } from '@/components/gems/GemDetailsModal';
import { Category, HiddenGem } from '@/types';
import { getAssetPath } from '@/lib/utils';
import { DESTINATION_VISUALS } from '@/lib/destinationVisuals';
import {
  Sparkles,
  Filter,
  Search,
  CheckCircle,
  SlidersHorizontal,
  MapPin,
  Clock,
} from 'lucide-react';

export default function HiddenGemsPage() {
  const { preferences, selectedDestinationSlug, setSelectedDestinationSlug, getSelectedDestination } =
    useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxTimeFilter, setMaxTimeFilter] = useState<number>(90);
  const [crowdFilter, setCrowdFilter] = useState<string>('All');
  const [activeModalGem, setActiveModalGem] = useState<HiddenGem | null>(null);

  const destination = getSelectedDestination();
  const ranked = rankHiddenGems(destination, preferences);

  const allCategories = ['All', 'Divine', 'Waterfalls', 'Mountains', 'Heritage', 'Nature', 'Adventure'];

  // Filter items
  const filtered = ranked.filter(({ gem }) => {
    // Search text
    if (
      searchQuery &&
      !gem.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !gem.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Category
    if (selectedCategory !== 'All' && gem.category !== selectedCategory) {
      return false;
    }
    // Travel time
    if (gem.travelTimeMinutes > maxTimeFilter) {
      return false;
    }
    // Crowd
    if (crowdFilter !== 'All' && gem.crowdData.level !== crowdFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Panoramic Visual Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-end p-6 sm:p-8 border border-white/20 dark:border-stone-800 shadow-2xl">
        <img
          src={DESTINATION_VISUALS[selectedDestinationSlug]?.hero || destination.heroImage}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.55] contrast-[1.1]"
          onError={(e) => {
            e.currentTarget.src = getAssetPath('/images/destinations/munnar_tea_hills.jpg');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-1.5 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-white font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md">
              Off-Beat Directory • {destination.state}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Hidden Gems of {destination.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 font-medium">
              Ranked using our transparent 100% explainable metric: Interests (30%) + Travel (20%) + Crowd (20%) + Rating (10%) + Availability (10%) + Budget (10%).
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

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search hidden attractions, activities, rock arches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
            />
          </div>

          {/* Crowd Filter */}
          <div>
            <select
              value={crowdFilter}
              onChange={(e) => setCrowdFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold"
            >
              <option value="All">All Crowd Levels</option>
              <option value="Low">Low Crowd Only</option>
              <option value="Moderate">Moderate Crowd</option>
            </select>
          </div>

          {/* Travel Time Filter */}
          <div>
            <select
              value={maxTimeFilter}
              onChange={(e) => setMaxTimeFilter(parseInt(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-bold"
            >
              <option value={30}>Within 30 Mins Drive</option>
              <option value={60}>Within 60 Mins Drive</option>
              <option value={90}>Within 90 Mins Drive</option>
              <option value={150}>All Distances</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="text-[10px] uppercase font-bold text-stone-400 mr-2 shrink-0">
            Category:
          </span>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gems Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(({ gem, score }) => (
            <GemCard
              key={gem.id}
              gem={gem}
              score={score}
              onOpenDetails={(g) => setActiveModalGem(g)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-lg text-stone-700 dark:text-stone-300">
            No matching hidden gems found
          </h3>
          <p className="text-xs text-stone-500">
            Try adjusting your travel time radius or clearing category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setMaxTimeFilter(90);
              setCrowdFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
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
