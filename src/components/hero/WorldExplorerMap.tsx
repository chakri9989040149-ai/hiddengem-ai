'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  Compass,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Globe2,
  X,
  ExternalLink,
  ChevronRight,
  Check
} from 'lucide-react';
import { WORLD_COUNTRIES, WorldDestination, CountryData } from '@/data/countryDestinations';
import { useAppStore } from '@/lib/store';

interface WorldExplorerMapProps {
  onSelectDestination: (slug: string) => void;
  selectedDestinationSlug?: string;
}

export function WorldExplorerMap({
  onSelectDestination,
  selectedDestinationSlug,
}: WorldExplorerMapProps) {
  const { destinations } = useAppStore();

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const [activeStateTab, setActiveStateTab] = useState<string>('All');
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapPan, setMapPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeCountry: CountryData = WORLD_COUNTRIES[selectedCountryCode] || WORLD_COUNTRIES.IN;

  // Zoom into country
  const handleSelectCountry = (countryCode: string) => {
    const country = WORLD_COUNTRIES[countryCode];
    if (country) {
      setSelectedCountryCode(countryCode);
      setActiveStateTab('All');
      // Smoothly pan toward country
      setMapPan({
        x: (50 - country.centerCoordinates.xPercent) * 4,
        y: (50 - country.centerCoordinates.yPercent) * 3,
      });
      setZoomLevel(Math.min(country.zoomLevel, 2.2));
    }
  };

  const handleResetView = () => {
    setSelectedCountryCode('IN');
    setZoomLevel(1);
    setMapPan({ x: 0, y: 0 });
    setSearchQuery('');
  };

  // Filtered destinations in floating panel
  const displayedDestinations = useMemo(() => {
    let list = activeCountry.destinations;
    if (activeCountry.states && activeStateTab !== 'All') {
      const stateObj = activeCountry.states.find((s) => s.name === activeStateTab);
      if (stateObj) list = stateObj.destinations;
    }
    return list;
  }, [activeCountry, activeStateTab]);

  // Handle Search anywhere
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Search through countries
    for (const [code, country] of Object.entries(WORLD_COUNTRIES)) {
      if (
        country.name.toLowerCase().includes(query) ||
        country.continent.toLowerCase().includes(query)
      ) {
        handleSelectCountry(code);
        return;
      }
      // Search through destinations
      for (const dest of country.destinations) {
        if (
          dest.name.toLowerCase().includes(query) ||
          dest.stateOrRegion.toLowerCase().includes(query) ||
          dest.subtitle.toLowerCase().includes(query)
        ) {
          handleSelectCountry(code);
          if (dest.slug) {
            onSelectDestination(dest.slug);
          }
          return;
        }
      }
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/20 bg-stone-950 shadow-2xl">
      {/* ========================================================
          TOP CONTROL BAR & SEARCH ANYWHERE
      ======================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-3.5 bg-stone-900/90 border-b border-white/10 backdrop-blur-md z-30">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Globe2 className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Interactive World Map
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-stone-300">
                Click Anywhere to Discover
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Select countries & hidden destinations across 7 continents
            </p>
          </div>
        </div>

        {/* Search Anywhere input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search a country or destination (e.g. Tirupati, Hampi, Japan)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-950/90 border border-white/15 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-emerald-500 shadow-inner"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Map View Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 3))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.8))}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors"
            title="Reset World View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================
          INTERACTIVE SVG MAP CONTAINER
      ======================================================== */}
      <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-gradient-to-b from-stone-950 via-[#0d131a] to-stone-950 select-none">
        
        {/* Subtle grid latitude/longitude lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15">
          <defs>
            <pattern id="world-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#10b981" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#world-grid)" />
        </svg>

        {/* Interactive Map Transform Layer */}
        <motion.div
          animate={{
            scale: zoomLevel,
            x: mapPan.x,
            y: mapPan.y,
          }}
          transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          className="relative w-full h-full"
        >
          {/* Geographically accurate SVG Landmasses with interactive Country nodes */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 35px rgba(16, 185, 129, 0.08))' }}
          >
            {/* North America */}
            <path
              d="M 120 70 Q 180 50 240 70 T 320 90 Q 280 140 230 180 T 170 240 Q 140 200 120 150 Z"
              fill={selectedCountryCode === 'US' ? '#064e3b' : '#1c1917'}
              stroke={selectedCountryCode === 'US' ? '#10b981' : '#374151'}
              strokeWidth={selectedCountryCode === 'US' ? '2' : '1'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950 hover:stroke-emerald-400"
              onClick={() => handleSelectCountry('US')}
              onMouseEnter={() => setHoveredCountry('United States')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* South America */}
            <path
              d="M 280 250 Q 340 260 360 310 T 340 400 Q 300 450 270 470 T 260 370 Q 250 300 280 250 Z"
              fill={selectedCountryCode === 'BR' ? '#064e3b' : '#1c1917'}
              stroke={selectedCountryCode === 'BR' ? '#10b981' : '#374151'}
              strokeWidth={selectedCountryCode === 'BR' ? '2' : '1'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950 hover:stroke-emerald-400"
              onClick={() => handleSelectCountry('BR')}
              onMouseEnter={() => setHoveredCountry('Brazil & South America')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Europe */}
            <path
              d="M 460 110 Q 520 100 560 130 T 540 180 Q 490 200 470 170 T 460 110 Z"
              fill={selectedCountryCode === 'FR' ? '#064e3b' : '#1c1917'}
              stroke={selectedCountryCode === 'FR' ? '#10b981' : '#374151'}
              strokeWidth={selectedCountryCode === 'FR' ? '2' : '1'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950 hover:stroke-emerald-400"
              onClick={() => handleSelectCountry('FR')}
              onMouseEnter={() => setHoveredCountry('France & Europe')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Africa */}
            <path
              d="M 470 190 Q 550 180 580 240 T 560 340 Q 520 400 480 370 T 450 260 Q 440 210 470 190 Z"
              fill={selectedCountryCode === 'EG' ? '#064e3b' : '#1c1917'}
              stroke={selectedCountryCode === 'EG' ? '#10b981' : '#374151'}
              strokeWidth={selectedCountryCode === 'EG' ? '2' : '1'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950 hover:stroke-emerald-400"
              onClick={() => handleSelectCountry('EG')}
              onMouseEnter={() => setHoveredCountry('Egypt & Africa')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Asia Main (Siberia, China, Central Asia) */}
            <path
              d="M 570 90 Q 720 70 850 100 T 900 180 Q 820 220 740 210 T 630 180 Q 570 140 570 90 Z"
              fill="#1c1917"
              stroke="#374151"
              strokeWidth="1"
              className="transition-colors hover:fill-stone-900"
            />

            {/* 🇮🇳 INDIA (Highlighted Centerpiece) */}
            <path
              d="M 660 210 Q 710 215 720 250 T 695 320 Q 680 330 670 290 T 650 240 Z"
              fill={selectedCountryCode === 'IN' ? '#047857' : '#064e3b'}
              stroke={selectedCountryCode === 'IN' ? '#34d399' : '#10b981'}
              strokeWidth={selectedCountryCode === 'IN' ? '3' : '2'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-600 filter drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]"
              onClick={() => handleSelectCountry('IN')}
              onMouseEnter={() => setHoveredCountry('India (Selected)')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Japan */}
            <path
              d="M 830 170 Q 855 160 860 190 T 840 230 Q 825 210 830 170 Z"
              fill={selectedCountryCode === 'JP' ? '#064e3b' : '#1c1917'}
              stroke={selectedCountryCode === 'JP' ? '#10b981' : '#374151'}
              strokeWidth={selectedCountryCode === 'JP' ? '2' : '1'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950 hover:stroke-emerald-400"
              onClick={() => handleSelectCountry('JP')}
              onMouseEnter={() => setHoveredCountry('Japan')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Australia / Oceania */}
            <path
              d="M 770 330 Q 860 320 890 360 T 860 430 Q 800 450 760 410 T 770 330 Z"
              fill={selectedCountryCode === 'AU' ? '#064e3b' : '#1c1917'}
              stroke={selectedCountryCode === 'AU' ? '#10b981' : '#374151'}
              strokeWidth={selectedCountryCode === 'AU' ? '2' : '1'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950 hover:stroke-emerald-400"
              onClick={() => handleSelectCountry('AU')}
              onMouseEnter={() => setHoveredCountry('Australia')}
              onMouseLeave={() => setHoveredCountry(null)}
            />
          </svg>

          {/* ========================================================
              DESTINATION PINS ON MAP
          ======================================================== */}
          {activeCountry.destinations.map((dest) => (
            <motion.div
              key={dest.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                left: `${dest.coordinates.xPercent}%`,
                top: `${dest.coordinates.yPercent}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (dest.slug) {
                  onSelectDestination(dest.slug);
                }
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              {/* Outer pulsing radar ring */}
              <span className="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />

              {/* Pin Icon */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-2xl transition-all group-hover:scale-125 border ${
                  dest.slug === selectedDestinationSlug
                    ? 'bg-emerald-500 text-white border-white scale-110 shadow-emerald-500/50'
                    : 'bg-stone-900/90 text-stone-200 border-emerald-500/50 group-hover:border-emerald-400'
                }`}
              >
                <span className="text-xs">{dest.icon}</span>
                <span className="text-[10px] font-black tracking-tight whitespace-nowrap hidden sm:inline">
                  {dest.name}
                </span>
                {dest.isHiddenGemNearby && (
                  <span
                    className="text-[9px] text-amber-300 font-bold"
                    title="Hidden Gem Nearby"
                  >
                    💎
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Hover Country Tooltip */}
        {hoveredCountry && (
          <div className="absolute top-4 left-4 z-40 px-3 py-1.5 rounded-xl bg-stone-900/90 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xl pointer-events-none">
            📍 {hoveredCountry} • Click to explore destinations
          </div>
        )}

        {/* Current Map Instructions Banner */}
        <div className="absolute bottom-4 left-4 z-30 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/80 backdrop-blur-md border border-white/10 text-[11px] text-stone-400">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Click any continent or country to zoom and view destinations</span>
        </div>

        {/* ========================================================
            FLOATING DESTINATION DISCOVERY PANEL
        ======================================================== */}
        <AnimatePresence>
          {activeCountry && (
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute top-3 right-3 bottom-3 w-80 sm:w-96 bg-stone-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden text-white"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeCountry.flag}</span>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-wide text-white">
                        {activeCountry.name}
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {activeCountry.continent} • {activeCountry.destinations.length} Curated Destinations
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleResetView}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* State selector tabs for India deep exploration */}
                {activeCountry.states && (
                  <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar pt-1">
                    <button
                      onClick={() => setActiveStateTab('All')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                        activeStateTab === 'All'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/5 text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      All States
                    </button>
                    {activeCountry.states.map((st) => (
                      <button
                        key={st.name}
                        onClick={() => setActiveStateTab(st.name)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                          activeStateTab === st.name
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/5 text-stone-300 hover:bg-white/10'
                        }`}
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destinations Scroll List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {displayedDestinations.map((dest) => {
                  const isCurrentlyActive = dest.slug === selectedDestinationSlug;
                  return (
                    <div
                      key={dest.id}
                      className={`group p-3 rounded-xl border transition-all duration-300 ${
                        isCurrentlyActive
                          ? 'bg-emerald-950/40 border-emerald-500/70 shadow-lg shadow-emerald-950/50'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-20 h-20 rounded-xl object-cover border border-white/15 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{dest.icon}</span>
                            <h4 className="font-bold text-white text-xs truncate">
                              {dest.name}
                            </h4>
                            {isCurrentlyActive && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 shrink-0">
                                Active Hub
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {dest.stateOrRegion}
                          </span>
                          <p className="text-[10px] text-stone-300 line-clamp-2 mt-1 leading-snug">
                            {dest.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* 💎 Hidden Gem Nearby Highlight */}
                      {dest.isHiddenGemNearby && dest.hiddenGemHighlight && (
                        <div className="mt-2.5 p-2 rounded-lg bg-stone-900/90 border border-white/5 flex items-start gap-1.5 text-[10px]">
                          <span className="text-amber-400 shrink-0">💎</span>
                          <span className="text-stone-300">
                            <strong className="text-amber-300">Hidden Gem:</strong> {dest.hiddenGemHighlight}
                          </span>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] text-stone-400">
                          {dest.isAvailableInApp ? '✓ Full AI Itinerary Ready' : 'Global Preview'}
                        </span>

                        <button
                          onClick={() => {
                            if (dest.slug) {
                              onSelectDestination(dest.slug);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                            isCurrentlyActive
                              ? 'bg-emerald-500 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                          }`}
                        >
                          <span>{isCurrentlyActive ? 'Selected' : 'Explore'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Panel Footer */}
              <div className="p-3 border-t border-white/10 bg-stone-900/60 text-center">
                <span className="text-[10px] text-stone-400 block">
                  Select destination to pivot complete visual world & itinerary
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
