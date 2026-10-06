'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  Compass,
  ArrowRight,
  Plus,
  Minus,
  Home,
  RotateCcw,
  Globe2,
  X,
  ChevronRight,
  Layers,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);
  const touchDistRef = useRef<number | null>(null);

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('IN');
  const [activeStateTab, setActiveStateTab] = useState<string>('All');
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [hoveredPin, setHoveredPin] = useState<WorldDestination | null>(null);
  const [selectedPinSlug, setSelectedPinSlug] = useState<string | null>(selectedDestinationSlug || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Pan & Zoom state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const activeCountry: CountryData = WORLD_COUNTRIES[selectedCountryCode] || WORLD_COUNTRIES.IN;

  // Clamping function to prevent the map from ever disappearing or getting stuck
  const clampPan = useCallback((x: number, y: number, currentZoom: number) => {
    const el = containerRef.current;
    const width = el ? el.clientWidth : 1000;
    const height = el ? el.clientHeight : 580;

    // Expand allowable bounds as zoom increases
    const maxPanX = Math.max(120, (width * (currentZoom - 0.75)) / 2 + 160);
    const maxPanY = Math.max(90, (height * (currentZoom - 0.75)) / 2 + 100);

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, y)),
    };
  }, []);

  // Center smoothly on coordinates { xPercent, yPercent }
  const focusOnCoordinates = useCallback(
    (xPercent: number, yPercent: number, targetZoom: number) => {
      const el = containerRef.current;
      const width = el ? el.clientWidth : 1000;
      const height = el ? el.clientHeight : 580;

      // Calculate translation to bring target (xPercent, yPercent) to the viewport center (50%, 50%)
      const targetPanX = (50 - xPercent) * (width / 100) * (targetZoom / 1.55);
      const targetPanY = (50 - yPercent) * (height / 100) * (targetZoom / 1.55);

      setZoom(targetZoom);
      setPan(clampPan(targetPanX, targetPanY, targetZoom));
    },
    [clampPan]
  );

  // Zoom into a selected country
  const handleSelectCountry = useCallback(
    (countryCode: string) => {
      const country = WORLD_COUNTRIES[countryCode];
      if (country) {
        setSelectedCountryCode(countryCode);
        setActiveStateTab('All');
        setSelectedPinSlug(null);
        setIsPanelCollapsed(false);

        const targetZoom = Math.min(3.4, Math.max(1.8, country.zoomLevel));
        focusOnCoordinates(
          country.centerCoordinates.xPercent,
          country.centerCoordinates.yPercent,
          targetZoom
        );
      }
    },
    [focusOnCoordinates]
  );

  // Reset View to initial world center
  const handleResetView = useCallback(() => {
    setSelectedCountryCode('IN');
    setSelectedPinSlug(null);
    setSearchQuery('');
    setActiveStateTab('All');
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => {
      const next = Math.min(4.5, +(prev + 0.35).toFixed(2));
      setPan((p) => clampPan(p.x, p.y, next));
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(0.85, +(prev - 0.35).toFixed(2));
      setPan((p) => clampPan(p.x, p.y, next));
      return next;
    });
  };

  // Select specific destination marker
  const handleSelectMarker = (dest: WorldDestination) => {
    setSelectedPinSlug(dest.slug || dest.id);
    setIsPanelCollapsed(false);
    focusOnCoordinates(dest.coordinates.xPercent, dest.coordinates.yPercent, Math.max(2.6, zoom));

    if (dest.slug) {
      onSelectDestination(dest.slug);
    }
  };

  // Mouse wheel zoom toward cursor
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;

      setZoom((prevZoom) => {
        const nextZoom = Math.min(4.5, Math.max(0.85, +(prevZoom * zoomFactor).toFixed(2)));
        const rect = el.getBoundingClientRect();
        const cursorX = e.clientX - rect.left - rect.width / 2;
        const cursorY = e.clientY - rect.top - rect.height / 2;

        setPan((prevPan) => {
          const scaleChange = nextZoom / prevZoom;
          const newX = cursorX - (cursorX - prevPan.x) * scaleChange;
          const newY = cursorY - (cursorY - prevPan.y) * scaleChange;
          return clampPan(newX, newY, nextZoom);
        });

        return nextZoom;
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [clampPan]);

  // Pointer drag events
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if ((e.target as HTMLElement).closest('button, input, select, .no-drag')) return;

    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const dx = Math.abs(e.clientX - (dragStartRef.current.x + pan.x));
    const dy = Math.abs(e.clientY - (dragStartRef.current.y + pan.y));
    if (dx > 4 || dy > 4) {
      hasMovedRef.current = true;
    }

    const nextX = e.clientX - dragStartRef.current.x;
    const nextY = e.clientY - dragStartRef.current.y;
    setPan(clampPan(nextX, nextY, zoom));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Mobile pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      touchDistRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (dist - touchDistRef.current) / 180;
      touchDistRef.current = dist;
      setZoom((z) => {
        const next = Math.min(4.5, Math.max(0.85, +(z + delta).toFixed(2)));
        setPan((p) => clampPan(p.x, p.y, next));
        return next;
      });
    }
  };

  const handleTouchEnd = () => {
    touchDistRef.current = null;
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

  // Real-time search suggestions
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const matches: Array<{
      type: 'country' | 'destination';
      title: string;
      subtitle: string;
      icon: string;
      countryCode: string;
      destSlug?: string;
      coordinates: { xPercent: number; yPercent: number };
    }> = [];

    // Country matches
    for (const [code, c] of Object.entries(WORLD_COUNTRIES)) {
      if (c.name.toLowerCase().includes(q) || c.continent.toLowerCase().includes(q)) {
        matches.push({
          type: 'country',
          title: c.name,
          subtitle: `${c.continent} • ${c.destinations.length} Curated Destinations`,
          icon: c.flag,
          countryCode: code,
          coordinates: c.centerCoordinates,
        });
      }

      // Destination matches
      for (const dest of c.destinations) {
        if (
          dest.name.toLowerCase().includes(q) ||
          dest.stateOrRegion.toLowerCase().includes(q) ||
          dest.subtitle.toLowerCase().includes(q)
        ) {
          matches.push({
            type: 'destination',
            title: dest.name,
            subtitle: `${dest.stateOrRegion}, ${c.name}`,
            icon: dest.icon,
            countryCode: code,
            destSlug: dest.slug,
            coordinates: dest.coordinates,
          });
        }
      }
    }

    return matches.slice(0, 6);
  }, [searchQuery]);

  // Handle Search submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setIsSearchFocused(false);

    // Exact or partial match check
    for (const [code, country] of Object.entries(WORLD_COUNTRIES)) {
      // 1. Check destination name first
      for (const dest of country.destinations) {
        if (
          dest.name.toLowerCase().includes(query) ||
          query.includes(dest.name.toLowerCase()) ||
          dest.stateOrRegion.toLowerCase().includes(query)
        ) {
          setSelectedCountryCode(code);
          setSelectedPinSlug(dest.slug || dest.id);
          setIsPanelCollapsed(false);
          focusOnCoordinates(dest.coordinates.xPercent, dest.coordinates.yPercent, 2.8);
          if (dest.slug) onSelectDestination(dest.slug);
          return;
        }
      }

      // 2. Check country name
      if (
        country.name.toLowerCase().includes(query) ||
        query.includes(country.name.toLowerCase()) ||
        country.continent.toLowerCase().includes(query)
      ) {
        handleSelectCountry(code);
        return;
      }
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/20 bg-stone-950 shadow-2xl select-none">
      {/* ========================================================
          1. TOP CONTROL BAR & SEARCH WITH AUTO-SUGGEST
      ======================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-3.5 bg-stone-900/90 border-b border-white/10 backdrop-blur-md z-30 relative">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Globe2 className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Interactive World Map
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                Drag • Zoom • Discover
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Drag anywhere to pan • Scroll wheel or pinch to zoom • Click countries &amp; gems
            </p>
          </div>
        </div>

        {/* Search Anywhere input with dropdown suggestions */}
        <div className="relative flex-1 max-w-sm">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search destination (e.g. Hampi, Tirupati, Japan)..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 220)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-950/90 border border-white/15 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete suggestions dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute top-full left-0 right-0 mt-1.5 bg-stone-900/98 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5"
              >
                {searchSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={() => {
                      if (s.type === 'destination') {
                        setSelectedCountryCode(s.countryCode);
                        setSelectedPinSlug(s.destSlug || null);
                        setIsPanelCollapsed(false);
                        focusOnCoordinates(s.coordinates.xPercent, s.coordinates.yPercent, 2.8);
                        if (s.destSlug) onSelectDestination(s.destSlug);
                      } else {
                        handleSelectCountry(s.countryCode);
                      }
                      setSearchQuery(s.title);
                      setIsSearchFocused(false);
                    }}
                    className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-emerald-950/40 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{s.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {s.title}
                        </div>
                        <div className="text-[10px] text-stone-400">{s.subtitle}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-emerald-400 transition-colors" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick View Switcher & Panel Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsPanelCollapsed((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
            title={isPanelCollapsed ? 'Show Destination Panel' : 'Hide Destination Panel'}
          >
            <span>{isPanelCollapsed ? 'Show Panel' : 'Hide Panel'}</span>
            {isPanelCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ========================================================
          2. MAIN INTERACTIVE MAP VIEWPORT
      ======================================================== */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] overflow-hidden bg-gradient-to-b from-stone-950 via-[#0a1118] to-stone-950"
      >
        {/* Geospatial Coordinate Grid Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <pattern id="world-gis-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#10b981" strokeWidth="0.6" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#world-gis-grid)" />
        </svg>

        {/* Dynamic Zoom & Pan Transform Canvas Layer */}
        <motion.div
          animate={{
            scale: zoom,
            x: pan.x,
            y: pan.y,
          }}
          transition={{
            type: isDragging ? false : 'spring',
            stiffness: 260,
            damping: 32,
          }}
          className="relative w-full h-full origin-center"
        >
          {/* Detailed SVG World Landmasses with interactive Country Nodes */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 40px rgba(16, 185, 129, 0.08))' }}
          >
            {/* Equator & Meridian Guide */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="#047857" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.3" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="#047857" strokeWidth="0.5" strokeDasharray="6 6" opacity="0.3" />

            {/* Greenland */}
            <path
              d="M 330 35 Q 370 25 390 50 T 370 95 Q 340 95 330 65 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* Canada & Arctic */}
            <path
              d="M 120 45 Q 220 30 280 50 T 320 85 Q 280 110 240 105 T 160 90 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* 🇺🇸 UNITED STATES & NORTH AMERICA */}
            <path
              d="M 120 75 Q 180 55 240 75 T 310 95 Q 290 145 240 185 T 180 235 Q 140 195 120 145 Z"
              fill={selectedCountryCode === 'US' ? '#047857' : '#18181b'}
              stroke={selectedCountryCode === 'US' ? '#34d399' : '#3f3f46'}
              strokeWidth={selectedCountryCode === 'US' ? '2.5' : '1.2'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950/80 hover:stroke-emerald-400"
              onClick={() => {
                if (!hasMovedRef.current) handleSelectCountry('US');
              }}
              onMouseEnter={() => setHoveredCountry('United States (4 Destinations)')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Central America & Mexico */}
            <path
              d="M 175 235 Q 225 235 240 260 T 265 285 Q 240 295 215 275 T 175 235 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* 🇧🇷 BRAZIL & SOUTH AMERICA */}
            <path
              d="M 270 270 Q 340 260 375 305 T 355 405 Q 310 460 275 480 T 260 375 Q 245 305 270 270 Z"
              fill={selectedCountryCode === 'BR' ? '#047857' : '#18181b'}
              stroke={selectedCountryCode === 'BR' ? '#34d399' : '#3f3f46'}
              strokeWidth={selectedCountryCode === 'BR' ? '2.5' : '1.2'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950/80 hover:stroke-emerald-400"
              onClick={() => {
                if (!hasMovedRef.current) handleSelectCountry('BR');
              }}
              onMouseEnter={() => setHoveredCountry('Brazil & South America (Rio de Janeiro)')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Scandinavia */}
            <path
              d="M 485 55 Q 525 45 535 85 T 510 120 Q 485 110 485 55 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* British Isles */}
            <path
              d="M 435 105 Q 455 95 460 120 T 445 145 Q 430 135 435 105 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* 🇫🇷 FRANCE & WESTERN EUROPE */}
            <path
              d="M 460 110 Q 525 100 560 130 T 540 180 Q 485 200 465 170 T 460 110 Z"
              fill={selectedCountryCode === 'FR' ? '#047857' : '#18181b'}
              stroke={selectedCountryCode === 'FR' ? '#34d399' : '#3f3f46'}
              strokeWidth={selectedCountryCode === 'FR' ? '2.5' : '1.2'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950/80 hover:stroke-emerald-400"
              onClick={() => {
                if (!hasMovedRef.current) handleSelectCountry('FR');
              }}
              onMouseEnter={() => setHoveredCountry('France (Paris & Côte d’Azur)')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* 🇪🇬 EGYPT & NORTH AFRICA */}
            <path
              d="M 535 195 Q 585 190 590 225 T 555 245 Q 530 225 535 195 Z"
              fill={selectedCountryCode === 'EG' ? '#047857' : '#18181b'}
              stroke={selectedCountryCode === 'EG' ? '#34d399' : '#3f3f46'}
              strokeWidth={selectedCountryCode === 'EG' ? '2.5' : '1.2'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950/80 hover:stroke-emerald-400"
              onClick={() => {
                if (!hasMovedRef.current) handleSelectCountry('EG');
              }}
              onMouseEnter={() => setHoveredCountry('Egypt (Cairo & Giza Pyramids)')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Rest of Africa */}
            <path
              d="M 460 200 Q 535 195 560 250 T 545 350 Q 510 410 470 380 T 440 270 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* Madagascar */}
            <path
              d="M 585 340 Q 605 330 610 370 T 590 395 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* Russia / Siberia / Northern Asia */}
            <path
              d="M 570 70 Q 740 50 860 80 T 895 150 Q 810 165 720 150 T 570 110 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* China & East Asia */}
            <path
              d="M 680 145 Q 795 135 835 195 T 775 255 Q 705 235 665 185 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* 🇮🇳 INDIA (Highlighted Centerpiece with accurate Subcontinental Peninsula) */}
            <path
              d="M 655 210 Q 705 205 720 235 T 710 270 Q 692 315 680 325 T 665 285 Q 648 248 655 210 Z"
              fill={selectedCountryCode === 'IN' ? '#047857' : '#064e3b'}
              stroke={selectedCountryCode === 'IN' ? '#34d399' : '#10b981'}
              strokeWidth={selectedCountryCode === 'IN' ? '3' : '2'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-600 filter drop-shadow-[0_0_14px_rgba(52,211,153,0.55)]"
              onClick={() => {
                if (!hasMovedRef.current) handleSelectCountry('IN');
              }}
              onMouseEnter={() => setHoveredCountry('India (Hampi, Tirupati, Munnar, Goa, Jaipur, Varanasi)')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Sri Lanka */}
            <circle cx="688" cy="335" r="4" fill="#10b981" opacity="0.8" />

            {/* Southeast Asia */}
            <path
              d="M 725 240 Q 770 240 775 280 T 740 310 Q 720 280 725 240 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* Indonesia */}
            <path
              d="M 750 310 Q 820 310 840 330 T 780 345 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />

            {/* 🇯🇵 JAPAN (Honshu, Hokkaido, Kyushu) */}
            <path
              d="M 830 165 Q 855 155 860 185 T 845 225 Q 830 215 830 165 Z"
              fill={selectedCountryCode === 'JP' ? '#047857' : '#18181b'}
              stroke={selectedCountryCode === 'JP' ? '#34d399' : '#3f3f46'}
              strokeWidth={selectedCountryCode === 'JP' ? '2.5' : '1.2'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950/80 hover:stroke-emerald-400"
              onClick={() => {
                if (!hasMovedRef.current) handleSelectCountry('JP');
              }}
              onMouseEnter={() => setHoveredCountry('Japan (Tokyo & Kyoto)')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* 🇦🇺 AUSTRALIA & OCEANIA */}
            <path
              d="M 765 330 Q 860 320 890 360 T 870 430 Q 805 450 765 410 T 765 330 Z"
              fill={selectedCountryCode === 'AU' ? '#047857' : '#18181b'}
              stroke={selectedCountryCode === 'AU' ? '#34d399' : '#3f3f46'}
              strokeWidth={selectedCountryCode === 'AU' ? '2.5' : '1.2'}
              className="cursor-pointer transition-all duration-300 hover:fill-emerald-950/80 hover:stroke-emerald-400"
              onClick={() => {
                if (!hasMovedRef.current) handleSelectCountry('AU');
              }}
              onMouseEnter={() => setHoveredCountry('Australia (Sydney & Harbour)')}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* New Zealand */}
            <path
              d="M 900 415 Q 925 405 920 445 T 895 465 Z"
              fill="#18181b"
              stroke="#27272a"
              strokeWidth="1"
            />
          </svg>

          {/* ========================================================
              DESTINATION MARKER NODES (ACTIVE COUNTRY)
          ======================================================== */}
          {activeCountry.destinations.map((dest) => {
            const isSelectedPin =
              selectedPinSlug === dest.slug ||
              selectedPinSlug === dest.id ||
              selectedDestinationSlug === dest.slug;

            return (
              <motion.div
                key={dest.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  left: `${dest.coordinates.xPercent}%`,
                  top: `${dest.coordinates.yPercent}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasMovedRef.current) {
                    handleSelectMarker(dest);
                  }
                }}
                onMouseEnter={() => setHoveredPin(dest)}
                onMouseLeave={() => setHoveredPin(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group select-none no-drag"
              >
                {/* Radar ping animation */}
                <span className="absolute -inset-2.5 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />

                {/* Pin Badge */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-2xl transition-all duration-200 border ${
                    isSelectedPin
                      ? 'bg-emerald-500 text-white border-white scale-110 shadow-emerald-500/60 ring-4 ring-emerald-400/30'
                      : 'bg-stone-900/95 text-stone-200 border-emerald-500/60 group-hover:border-emerald-400 group-hover:scale-115'
                  }`}
                >
                  <span className="text-xs">{dest.icon}</span>
                  <span className="text-[11px] font-black tracking-tight whitespace-nowrap hidden sm:inline">
                    {dest.name}
                  </span>
                  {dest.isHiddenGemNearby && (
                    <span className="text-[9px] text-amber-300 font-bold" title="Hidden Gem Nearby">
                      💎
                    </span>
                  )}
                </div>

                {/* Floating tooltip on hover */}
                {hoveredPin?.id === dest.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-40 px-3 py-1.5 rounded-xl bg-stone-900/95 backdrop-blur-md border border-white/20 text-white shadow-2xl pointer-events-none whitespace-nowrap text-center animate-in fade-in">
                    <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1">
                      <span>💎</span>
                      <span>{dest.name}</span>
                    </div>
                    <div className="text-[10px] text-stone-300">
                      {dest.stateOrRegion}, {activeCountry.name}
                    </div>
                    <div className="text-[9px] text-stone-400 mt-0.5">Click to view details &amp; itinerary</div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Hover Country Tooltip */}
        {hoveredCountry && (
          <div className="absolute top-4 left-4 z-40 px-3.5 py-1.5 rounded-xl bg-stone-900/95 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xl pointer-events-none animate-in fade-in">
            📍 {hoveredCountry} • Click to explore
          </div>
        )}

        {/* Bottom Left Quick Help Banner */}
        {/* Instruction Banner at lower-left */}
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-950/80 backdrop-blur-md border border-white/10 text-[11px] text-stone-400 pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Left-click + drag to pan • Mouse wheel or pinch to zoom</span>
        </div>

        {/* ========================================================
            3. PROFESSIONAL MAP CONTROLS (+, −, ⌂) IN LOWER-RIGHT
        ======================================================== */}
        <div className="absolute right-4 bottom-4 z-40 flex flex-col items-center bg-stone-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden divide-y divide-white/10 select-none">
          {/* Zoom Level Indicator */}
          <div className="px-2.5 py-1 text-[9px] font-black uppercase text-emerald-400 bg-stone-950/80 text-center tracking-wider min-w-[44px]">
            {Math.round(zoom * 100)}%
          </div>

          {/* Zoom In (+) */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-3 text-stone-300 hover:text-emerald-400 hover:bg-white/10 transition-colors flex items-center justify-center active:scale-90"
            aria-label="Zoom In"
            title="Zoom In (+)"
          >
            <Plus className="w-4 h-4 font-bold" />
          </button>

          {/* Zoom Out (−) */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-3 text-stone-300 hover:text-emerald-400 hover:bg-white/10 transition-colors flex items-center justify-center active:scale-90"
            aria-label="Zoom Out"
            title="Zoom Out (−)"
          >
            <Minus className="w-4 h-4 font-bold" />
          </button>

          {/* Reset / Home (⌂) */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-3 text-stone-300 hover:text-emerald-400 hover:bg-white/10 transition-colors flex items-center justify-center active:scale-90"
            aria-label="Reset Map View"
            title="Reset to World View (⌂)"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            4. RESPONSIVE RIGHT-SIDE DESTINATION PANEL
        ======================================================== */}
        {/* Minimized floating button when panel is collapsed */}
        {isPanelCollapsed && (
          <button
            type="button"
            onClick={() => setIsPanelCollapsed(false)}
            className="absolute top-3 right-3 z-30 px-3.5 py-2 rounded-2xl bg-stone-950/90 backdrop-blur-2xl border border-emerald-500/40 text-white shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="text-lg">{activeCountry.flag}</span>
            <div className="text-left">
              <span className="text-xs font-black block text-emerald-400">{activeCountry.name}</span>
              <span className="text-[10px] text-stone-300">
                {displayedDestinations.length} Destinations • Show Panel ▾
              </span>
            </div>
          </button>
        )}

        <AnimatePresence>
          {!isPanelCollapsed && activeCountry && (
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="absolute top-3 right-3 bottom-36 sm:bottom-36 w-80 sm:w-92 max-w-[calc(100%-1.5rem)] bg-stone-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden text-white"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
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
                    type="button"
                    onClick={() => setIsPanelCollapsed(true)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-400 hover:text-white transition-colors"
                    title="Minimize Panel"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* State selector tabs for India exploration */}
                {activeCountry.states && (
                  <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar pt-1">
                    <button
                      type="button"
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
                        type="button"
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

              {/* Destinations Scrollable List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {displayedDestinations.map((dest) => {
                  const isCurrentlyActive =
                    dest.slug === selectedDestinationSlug || selectedPinSlug === dest.slug;

                  return (
                    <div
                      key={dest.id}
                      onClick={() => handleSelectMarker(dest)}
                      className={`group p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isCurrentlyActive
                          ? 'bg-emerald-950/50 border-emerald-500/80 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-500/40'
                          : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-20 h-20 rounded-xl object-cover border border-white/15 shrink-0 group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{dest.icon}</span>
                            <h4 className="font-bold text-white text-xs truncate">
                              {dest.name}
                            </h4>
                            {isCurrentlyActive && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 shrink-0">
                                Active Pin
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
                          {dest.isAvailableInApp ? '✓ Full AI Itinerary' : 'Global Discovery'}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectMarker(dest);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all ${
                            isCurrentlyActive
                              ? 'bg-emerald-500 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                          }`}
                        >
                          <span>{isCurrentlyActive ? 'Focus Map' : 'Explore'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Panel Footer */}
              <div className="p-3 border-t border-white/10 bg-stone-900/60 text-center shrink-0">
                <span className="text-[10px] text-stone-400 block">
                  Click destination to focus map &amp; update journey
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
