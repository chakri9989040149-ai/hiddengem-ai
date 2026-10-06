'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { formatCurrency, getAssetPath } from '@/lib/utils';
import {
  Briefcase,
  Calendar,
  Users,
  MapPin,
  Leaf,
  Sparkles,
  ArrowRight,
  Plus,
  Share2,
} from 'lucide-react';

export default function MyTripsPage() {
  const { activeTrip, preferences, getSelectedDestination } = useAppStore();
  const destination = getSelectedDestination();

  const savedTrips = [
    {
      id: 'trip-1',
      title: 'Tirupati Serene Seshachalam Escape',
      destinationName: 'Tirupati',
      state: 'Andhra Pradesh',
      dates: 'Oct 24 - Oct 26, 2026',
      people: 4,
      status: 'Upcoming',
      budget: 10000,
      cost: 9200,
      ecoScore: 92,
      gemsCount: 3,
      gemsNames: ['Talakona Waterfalls', 'Chandragiri Fort', 'Silathoranam Arch'],
      image: getAssetPath('/images/destinations/tirupati_tirumala_hero.jpg'),
    },
    {
      id: 'trip-2',
      title: 'Hampi & Anegundi Ancient Boulder Trail',
      destinationName: 'Hampi',
      state: 'Karnataka',
      dates: 'Nov 12 - Nov 15, 2026',
      people: 2,
      status: 'Saved',
      budget: 16000,
      cost: 14200,
      ecoScore: 96,
      gemsCount: 4,
      gemsNames: ['Sanapur Lake', 'Daroji Sloth Bear', 'Achyutaraya Temple', 'Anegundi Village'],
      image: getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
    },
    {
      id: 'trip-3',
      title: 'Munnar Highland Shola & Cloud Forest',
      destinationName: 'Munnar',
      state: 'Kerala',
      dates: 'Sep 04 - Sep 06, 2026',
      people: 3,
      status: 'Completed',
      budget: 14000,
      cost: 12800,
      ecoScore: 94,
      gemsCount: 3,
      gemsNames: ['Kolukkumalai Tea Estate', 'Meesapulimala Peak', 'Attukal Falls'],
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Journey Portfolio</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            My Trips & Saved Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5">
            Manage your past and upcoming uncrowded excursions, eco scores, and group expenses.
          </p>
        </div>

        <Link
          href="/plan-trip"
          className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Journey</span>
        </Link>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {savedTrips.map((trip) => (
          <div
            key={trip.id}
            className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image & Status */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-extrabold shadow ${
                    trip.status === 'Upcoming'
                      ? 'bg-emerald-600 text-white'
                      : trip.status === 'Saved'
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-800 text-stone-200'
                  }`}
                >
                  {trip.status}
                </span>

                <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-lg bg-stone-950/80 text-[10px] text-emerald-300 font-bold backdrop-blur-md flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  <span>Eco Score {trip.ecoScore}/100</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">
                    {trip.destinationName}, {trip.state}
                  </span>
                  <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 mt-0.5 line-clamp-1">
                    {trip.title}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400 py-2 border-y border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span className="truncate">{trip.dates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{trip.people} Travellers</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Included Hidden Gems ({trip.gemsCount})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {trip.gemsNames.map((name, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-semibold"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 pt-0">
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Est. Outlay</span>
                  <span className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                    {formatCurrency(trip.cost)}
                  </span>
                </div>

                <Link
                  href="/plan-trip"
                  className="px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs shadow hover:bg-emerald-700 flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
