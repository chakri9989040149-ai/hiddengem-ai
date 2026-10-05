import React from 'react';
import Link from 'next/link';
import { Compass, Shield, Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800/80 bg-stone-100/60 dark:bg-stone-900/60 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Pitch */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              <span className="font-bold text-xl tracking-tight text-stone-900 dark:text-stone-100">
                HiddenGem <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950">AI</span>
              </span>
            </div>
            <p className="text-xs uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400">
              Discover Beyond the Destination.
            </p>
            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed max-w-md">
              Existing travel platforms help tourists find famous destinations. HiddenGem AI helps them discover what they would otherwise miss. We analyze traveller interests, travel time, crowd and capacity, availability, ratings and budget to identify better hidden destinations—and automatically build the complete journey around them.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 pt-2 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deterministic 100% explainable scoring • No black-box AI ranking</span>
            </div>
          </div>

          {/* Quick Routes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4">
              Explore Destinations
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-700 dark:text-stone-300">
              <li>
                <Link href="/destination/tirupati" className="hover:text-emerald-600 transition-colors">
                  Tirupati & Seshachalam Valleys
                </Link>
              </li>
              <li>
                <Link href="/destination/hampi" className="hover:text-emerald-600 transition-colors">
                  Hampi & Kishkindha Boulders
                </Link>
              </li>
              <li>
                <Link href="/destination/munnar" className="hover:text-emerald-600 transition-colors">
                  Munnar & Western Ghats Peaks
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-emerald-600 transition-colors">
                  Interactive GIS Map Explorer
                </Link>
              </li>
              <li>
                <Link href="/surprise-me" className="hover:text-emerald-600 transition-colors">
                  🎲 Surprise Me Serendipity
                </Link>
              </li>
            </ul>
          </div>

          {/* Hackathon Demo & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-4">
              Platform & Demo
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-700 dark:text-stone-300">
              <li>
                <Link href="/admin" className="text-amber-800 dark:text-amber-300 font-semibold hover:underline">
                  ⚙ Admin Crowd Simulator
                </Link>
              </li>
              <li>
                <Link href="/plan-trip" className="hover:text-emerald-600 transition-colors">
                  Itinerary & Budget Builder
                </Link>
              </li>
              <li>
                <Link href="/ai-agent" className="hover:text-emerald-600 transition-colors">
                  AI Travel Agent Assistant
                </Link>
              </li>
              <li>
                <Link href="/passport" className="hover:text-emerald-600 transition-colors">
                  Travel Passport & Badges
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-emerald-600 transition-colors">
                  Identity Verification Sandbox
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 dark:text-stone-300 gap-4">
          <p>
            © {new Date().getFullYear()} HiddenGem AI. All rights reserved. Hackathon Production Build.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Data Transparency: AI Predicted Crowd • Seeded GIS Coordinates
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
