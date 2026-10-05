'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HiddenGem, Destination } from '@/types';
import { useAppStore } from '@/lib/store';
import { rankHiddenGems } from '@/lib/scoring';
import { formatTime, formatCurrency } from '@/lib/utils';
import {
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ChevronRight,
  MapPin,
  Plus,
} from 'lucide-react';

interface CrowdAlertBannerProps {
  destination: Destination;
  onExploreGems?: () => void;
}

export function CrowdAlertBanner({ destination, onExploreGems }: CrowdAlertBannerProps) {
  const { preferences, getCrowdPrediction, addGemToTrip, selectedGems } = useAppStore();
  const [expanded, setExpanded] = useState(true);

  const crowd = getCrowdPrediction(destination.slug);
  const isHighCrowd = crowd.crowdLevel === 'high';

  if (!isHighCrowd) {
    return null;
  }

  // Get top 3 alternative gems with low/moderate crowd matching interests
  const ranked = rankHiddenGems(destination, preferences);
  const alternativeGems = ranked
    .filter((r) => r.gem.crowdData.level === 'low' || r.gem.crowdData.level === 'moderate')
    .slice(0, 3);

  return (
    <section className="w-full my-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-2xl border-2 border-rose-500/60 bg-gradient-to-r from-rose-50 via-amber-50/40 to-emerald-50/50 dark:from-rose-950/40 dark:via-stone-900 dark:to-emerald-950/30 p-5 sm:p-7 shadow-xl shadow-rose-500/5">
        {/* Animated Background Aura */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        {/* Top Alert Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-rose-200/80 dark:border-rose-900/60">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 shrink-0 animate-alert-pulse">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                  ⚠ High Crowd Expected
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  AI Predicted Occupancy: <strong>{crowd.estimatedOccupancy}%</strong> (Conf: {crowd.confidence}%)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
                {destination.mainAttractionName} is currently congested.
              </h3>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-1 self-end sm:self-center"
          >
            <span>{expanded ? 'Hide Alternatives' : 'Show Alternatives'}</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Subtitle Message */}
        <div className="mt-4">
          <p className="text-sm text-stone-700 dark:text-stone-300 font-medium">
            Instead of spending your time in crowded queues, our recommendation engine found{' '}
            <strong className="text-emerald-700 dark:text-emerald-400">{alternativeGems.length} nearby serene experiences</strong> that match your{' '}
            <span className="underline decoration-emerald-500 font-semibold">{preferences.interests.join(' & ')}</span> interests.
          </p>
        </div>

        {/* 3 Alternative Gems Cards Grid */}
        {expanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {alternativeGems.map(({ gem, score }) => {
              const isSelected = selectedGems.some((g) => g.id === gem.id);

              return (
                <div
                  key={gem.id}
                  className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 p-4 shadow-md flex flex-col justify-between hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <div>
                    {/* Gem Image & Match Tag */}
                    <div className="relative h-36 w-full rounded-lg overflow-hidden mb-3">
                      <img
                        src={gem.images[0]}
                        alt={gem.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-emerald-700/90 text-white font-extrabold text-xs backdrop-blur-sm shadow flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-200" />
                        <span>{score.score}% Match</span>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-stone-900/80 text-[10px] text-stone-200 backdrop-blur-sm">
                        {formatTime(gem.travelTimeMinutes)} drive
                      </div>
                    </div>

                    {/* Category & Title */}
                    <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                      {gem.category}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {gem.name}
                    </h4>

                    {/* Crowd Headroom & Capacity */}
                    <div className="flex items-center gap-2 mt-1.5 text-xs">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Low Crowd ({gem.crowdData.occupancyPercent}% full)
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-500 dark:text-stone-400">
                        {gem.rating}★ ({gem.reviewCount})
                      </span>
                    </div>

                    {/* Why Recommended Reasons */}
                    <ul className="mt-2.5 space-y-1 text-[11px] text-stone-600 dark:text-stone-400">
                      {score.reasons.slice(0, 2).map((reason, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-stone-800 dark:text-stone-200">
                      {gem.estimatedCostInr === 0 ? 'Free Entry' : formatCurrency(gem.estimatedCostInr)}
                    </span>

                    {isSelected ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>In Trip</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => addGemToTrip(gem)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow flex items-center gap-1 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Trip</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-rose-200/60 dark:border-rose-900/40">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Switching to these alternatives saves ~2.5 hours of waiting time.
          </span>
          <Link
            href="/plan-trip"
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 text-xs font-bold shadow-md flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span>Show All Quieter Alternatives & Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
