'use client';

import React, { useState } from 'react';
import { CompleteTrip, ItineraryItem, DayPlan } from '@/types';
import { formatCurrency, formatTime } from '@/lib/utils';
import { TRAVEL_IMAGES } from '@/lib/travel-images';
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Camera,
  Leaf,
  Sparkles,
  Share2,
  Download,
  CheckCircle,
  Plus,
  Route,
  ArrowRight,
} from 'lucide-react';

interface ItineraryViewProps {
  trip: CompleteTrip;
  onOptimizeRoute?: () => void;
}

export function ItineraryView({ trip, onOptimizeRoute }: ItineraryViewProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [copied, setCopied] = useState(false);

  const currentDayPlan = trip.days.find((d) => d.dayNumber === activeDay) || trip.days[0];

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const itineraryText = `HIDDENGEM AI — ${trip.title}
Destination: ${trip.destination.name} (${trip.destination.state})
Duration: ${trip.preferences.durationDays} Days | Travellers: ${trip.preferences.groupSize}
Overall Eco Score: ${trip.overallEcoScore}/100
Total Budget: ₹${trip.budget.totalBudget} | Estimated: ₹${trip.budget.estimatedCost}

${trip.days
  .map(
    (d) => `DAY ${d.dayNumber}: ${d.theme} (Day Cost: ₹${d.estimatedDayCostInr})
${d.items.map((i) => `  [${i.timeSlot}] ${i.title} - ${i.locationName} (${i.description})`).join('\n')}`
  )
  .join('\n\n')}
`;
    const blob = new Blob([itineraryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.destination.slug}-itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Select visual story image for each item
  const getItemImage = (item: ItineraryItem) => {
    // If it corresponds to a gem with images
    if (item.gemId) {
      const gem = trip.selectedGems.find((g) => g.id === item.gemId);
      if (gem && gem.images[0]) return gem.images[0];
    }
    const cat = item.category as keyof typeof TRAVEL_IMAGES.itinerary;
    if (TRAVEL_IMAGES.itinerary[cat]) {
      return TRAVEL_IMAGES.itinerary[cat];
    }
    if (item.title.toLowerCase().includes('arrival')) return TRAVEL_IMAGES.itinerary.Arrival;
    if (item.title.toLowerCase().includes('lunch') || item.title.toLowerCase().includes('breakfast') || item.title.toLowerCase().includes('dining'))
      return TRAVEL_IMAGES.itinerary.Dining;
    if (item.title.toLowerCase().includes('sunset') || item.title.toLowerCase().includes('photo'))
      return TRAVEL_IMAGES.itinerary.Photography;
    if (item.title.toLowerCase().includes('stay') || item.title.toLowerCase().includes('camp'))
      return TRAVEL_IMAGES.itinerary.Stay;
    return TRAVEL_IMAGES.itinerary.Mountains;
  };

  return (
    <div className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 dark:text-emerald-400">
              Visual Travel Story
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px] flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              <span>Eco Score {trip.overallEcoScore}/100</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            {trip.title}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-0.5">
            {trip.preferences.durationDays} Days • {trip.preferences.groupSize} Travellers •{' '}
            {trip.preferences.travelStyle} Style • {trip.preferences.transportPreference || 'Train'} Transit
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleShare}
            className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link!' : 'Share'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold shadow flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Plan</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-100 dark:border-stone-800">
        {trip.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => setActiveDay(day.dayNumber)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeDay === day.dayNumber
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Day {day.dayNumber}</span>
          </button>
        ))}
      </div>

      {/* Day Theme Subheader */}
      {currentDayPlan && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
              Day {currentDayPlan.dayNumber} Narrative
            </span>
            <h4 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100">
              {currentDayPlan.theme}
            </h4>
          </div>
          <div className="text-left sm:text-right text-xs">
            <span className="text-stone-400 block text-[10px] uppercase">Est. Day Outlay</span>
            <span className="font-bold text-stone-800 dark:text-stone-200">
              {formatCurrency(currentDayPlan.estimatedDayCostInr)}
            </span>
          </div>
        </div>
      )}

      {/* VISUAL ITINERARY TIMELINE (Section 15 Requirements) */}
      {currentDayPlan && (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
          {currentDayPlan.items.map((item, idx) => {
            const itemImage = getItemImage(item);

            return (
              <div key={item.id} className="relative group">
                {/* Timeline Pin Dot */}
                <div className="absolute -left-6 sm:-left-8 top-3 w-6 h-6 rounded-full bg-white dark:bg-stone-900 border-2 border-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>

                {/* Rich Photo + Content Card */}
                <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 hover:bg-stone-50 dark:hover:bg-stone-800/70 transition-all overflow-hidden shadow-sm hover:shadow-md flex flex-col sm:flex-row">
                  {/* High-Resolution Thumbnail */}
                  <div className="sm:w-44 h-36 sm:h-auto shrink-0 relative overflow-hidden bg-stone-200 dark:bg-stone-700">
                    <img
                      src={itemImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent sm:hidden" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 text-[10px] text-white font-mono sm:hidden">
                      {item.timeSlot}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-[11px] items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-stone-500" />
                          <span>{item.timeSlot}</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                          {item.category}
                        </span>
                      </div>

                      <span className="font-extrabold text-xs text-stone-900 dark:text-stone-100">
                        {item.estimatedCostInr === 0 ? 'Free Activity' : formatCurrency(item.estimatedCostInr)}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                      {item.title}
                    </h4>

                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-1 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.locationName}</span>
                      <span>•</span>
                      <span>~{item.estimatedDurationHours} hrs</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
