'use client';

import React from 'react';
import { HiddenGem, RecommendationScore } from '@/types';
import { useAppStore } from '@/lib/store';
import { formatTime, formatCurrency, getAssetPath } from '@/lib/utils';
import {
  Sparkles,
  MapPin,
  Clock,
  Star,
  Users,
  CheckCircle2,
  Plus,
  Check,
  Eye,
  Shield,
  Leaf,
  Hotel,
} from 'lucide-react';

interface GemCardProps {
  gem: HiddenGem;
  score?: RecommendationScore;
  onOpenDetails: (gem: HiddenGem) => void;
  onViewOnMap?: (gem: HiddenGem) => void;
}

export function GemCard({ gem, score, onOpenDetails, onViewOnMap }: GemCardProps) {
  const { selectedGems, addGemToTrip, removeGemFromTrip, preferences } = useAppStore();
  const isSelected = selectedGems.some((g) => g.id === gem.id);

  const crowdColors = {
    low: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    moderate: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    high: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
  };

  // Preference match chips
  const matchedInterests = score?.matchedPreferences?.interests || [];
  const companionLabel = score?.matchedPreferences?.companionFit || '';

  return (
    <div className="group rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between">
      {/* Top Image Section */}
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img
            src={gem.images?.[0] || getAssetPath('/images/destinations/munnar_tea_hills.jpg')}
            alt={gem.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
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

          {/* Match Score Badge (Exact 100% Weight Formula) */}
          {score && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-700/95 text-white text-xs font-extrabold shadow-lg backdrop-blur-sm flex items-center gap-1.5 border border-emerald-400/40">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>{score.score}% Match</span>
            </div>
          )}

          {/* Eco Score Badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-stone-900/80 text-emerald-300 text-[10px] font-semibold backdrop-blur-sm flex items-center gap-1">
            <Leaf className="w-3 h-3 text-emerald-400" />
            <span>Eco {gem.ecoScore}</span>
          </div>

          {/* Travel Distance & Time Bar */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white font-medium bg-stone-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{gem.distanceFromMainKm} km away</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{formatTime(gem.travelTimeMinutes)}</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {gem.category}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-stone-700 dark:text-stone-300">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{gem.rating}</span>
              <span className="text-stone-400 font-normal">({gem.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {gem.name}
          </h3>

          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {gem.subtitle}
          </p>

          {/* Explicit Preference Match Chips (Section 15 Requirements) */}
          <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
            {matchedInterests.slice(0, 2).map((interest, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold"
              >
                {interest} ✓
              </span>
            ))}
            {companionLabel && (
              <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                {companionLabel}
              </span>
            )}
            <span
              className={`px-2 py-0.5 rounded-md font-semibold border ${
                crowdColors[gem.crowdData.level]
              }`}
            >
              {gem.crowdData.level === 'low' ? '🟢 Low Crowd ✓' : `${gem.crowdData.level} Crowd`}
            </span>
            {preferences.isOvernightWilling && (
              <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-semibold flex items-center gap-1">
                <Hotel className="w-2.5 h-2.5" />
                <span>Overnight available</span>
              </span>
            )}
          </div>

          {/* Opening Status */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>Open: {gem.openingHours || '06:00 AM – 06:00 PM'}</span>
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              🟢 Open now
            </span>
          </div>

          {/* Natural Language "Why Recommended" Explanation */}
          {score && (
            <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                Why we recommend it
              </span>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic line-clamp-2">
                &ldquo;{score.explanation}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-[10px] text-stone-400 block uppercase">Est. Cost</span>
            <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {gem.estimatedCostInr === 0 ? 'Free Entry' : formatCurrency(gem.estimatedCostInr)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetails(gem)}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="View Details"
              aria-label="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {isSelected ? (
              <button
                onClick={() => removeGemFromTrip(gem.id)}
                className="px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-all"
                title="Remove from trip"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Selected</span>
              </button>
            ) : (
              <button
                onClick={() => addGemToTrip(gem)}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Trip</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
