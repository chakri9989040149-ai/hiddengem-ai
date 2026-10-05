'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { TRAVEL_VISUALS } from '@/lib/travelVisuals';
import {
  Award,
  Sparkles,
  MapPin,
  Leaf,
  Compass,
  CheckCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
  Stamp,
  Camera,
} from 'lucide-react';

export default function PassportPage() {
  const { badges, ecoPoints, gemsDiscoveredCount, isIdentityVerified, verifiedDocType } =
    useAppStore();

  const totalBadgesUnlocked = badges.filter((b) => b.unlockedAt).length;

  const destinationStamps = [
    {
      destination: 'Munnar',
      state: 'Kerala',
      status: 'VERIFIED EXPLORER',
      date: 'Oct 2026',
      gemsCount: 6,
      image: TRAVEL_VISUALS.destinations.munnar.hero,
      stampColor: 'border-emerald-500 text-emerald-400',
    },
    {
      destination: 'Hampi',
      state: 'Karnataka',
      status: 'HERITAGE ARCHIVIST',
      date: 'Sep 2026',
      gemsCount: 5,
      image: TRAVEL_VISUALS.destinations.hampi.hero,
      stampColor: 'border-amber-500 text-amber-400',
    },
    {
      destination: 'Tirupati',
      state: 'Andhra Pradesh',
      status: 'SACRED EXPLORER',
      date: 'Aug 2026',
      gemsCount: 4,
      image: TRAVEL_VISUALS.destinations.tirupati.hero,
      stampColor: 'border-sky-500 text-sky-400',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-28 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Digital Travel Passport</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Explorer Credentials & Badges
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Your verified records of off-beat discoveries, low-carbon itineraries, and responsible tourism.
          </p>
        </div>

        {/* Identity Verification Status Card */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 flex items-center gap-3.5 shadow-sm text-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-stone-900 dark:text-stone-100 block">
              Identity Verified ✓
            </span>
            <span className="text-[11px] text-stone-500">
              {verifiedDocType || 'Aadhaar (Mock Sandbox)'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 uppercase font-extrabold">Hidden Gems Discovered</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block">
            {gemsDiscoveredCount}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Beyond mass tourist traps</span>
        </div>

        <div className="p-5 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 uppercase font-extrabold">Unlocked Badges</span>
          <span className="text-3xl font-black text-stone-900 dark:text-stone-100 block">
            {totalBadgesUnlocked} / {badges.length}
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Milestone achievements</span>
        </div>

        <div className="p-5 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 uppercase font-extrabold">Eco Travel Score</span>
          <span className="text-3xl font-black text-emerald-600 block">
            {ecoPoints} 🌱
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Rail & low-carbon transit</span>
        </div>

        <div className="p-5 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm space-y-1">
          <span className="text-[11px] text-stone-400 uppercase font-extrabold">Explorer Rank</span>
          <span className="text-3xl font-black text-amber-500 block">
            Trailblazer
          </span>
          <span className="text-[10px] text-stone-500 font-medium">Top 5% mindful travellers</span>
        </div>
      </div>

      {/* DESTINATION PASSPORT STAMPS & PHOTOGRAPHY */}
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
            Passport Stamps & Travel Journal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-0.5">
            Verified Visited Gateways
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinationStamps.map((stamp) => (
            <div
              key={stamp.destination}
              className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl group flex flex-col justify-end min-h-[300px] p-6"
            >
              <img
                src={stamp.image}
                alt={stamp.destination}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.5] contrast-[1.1] group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              {/* Passport Stamp Seal */}
              <div className="absolute top-4 right-4 rotate-12 group-hover:rotate-0 transition-transform">
                <div className={`p-2.5 rounded-2xl border-2 border-dashed ${stamp.stampColor} bg-stone-950/70 backdrop-blur-md text-center`}>
                  <span className="text-[9px] font-black uppercase tracking-widest block">
                    {stamp.status}
                  </span>
                  <span className="text-xs font-mono font-bold block">{stamp.date}</span>
                </div>
              </div>

              <div className="relative z-10 text-white space-y-1">
                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block">
                  {stamp.state}, India
                </span>
                <h3 className="text-2xl font-black text-white">
                  {stamp.destination}
                </h3>
                <p className="text-xs text-stone-300 font-medium">
                  {stamp.gemsCount} Hidden Gems Cataloged
                </p>
                <div className="pt-2">
                  <Link
                    href={`/destination/${stamp.destination.toLowerCase()}`}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 hover:text-white transition-colors"
                  >
                    <span>View Destination Journal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xl text-stone-900 dark:text-stone-100">
            Explorer Achievement Badges
          </h3>
          <span className="text-xs text-stone-500">Earn badges through mindful travel choices</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const isUnlocked = !!badge.unlockedAt;

            return (
              <div
                key={badge.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isUnlocked
                    ? 'border-emerald-500/60 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-md hover:shadow-xl'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-3xl shadow-sm">
                    {badge.icon}
                  </div>
                  {isUnlocked ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-500 font-bold text-[10px] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  {badge.category}
                </span>
                <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100 mt-0.5">
                  {badge.title}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  {badge.description}
                </p>

                <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Requirement: {badge.criteria}</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                    +{badge.points} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Serendipity CTA */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <h4 className="font-black text-xl">Ready to unlock your next explorer credential?</h4>
          <p className="text-xs text-emerald-200">
            Spin the Serendipity wheel or add an uncrowded waterfall to your current itinerary.
          </p>
        </div>
        <Link
          href="/plan-trip"
          className="px-6 py-3.5 rounded-2xl bg-white text-emerald-950 font-black text-xs shadow-xl hover:bg-emerald-50 self-start sm:self-center transition-all hover:scale-105"
        >
          Plan Next Gem Excursion
        </Link>
      </div>
    </div>
  );
}
