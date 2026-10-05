'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Destination, HiddenGem, Coordinates } from '@/types';
import { useAppStore } from '@/lib/store';
import { optimizeRouteStops, OptimizedRouteResult } from '@/lib/route-optimizer';
import { formatCurrency, formatTime } from '@/lib/utils';
import { Navigation, Route, Sparkles, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface TravelMapProps {
  destination: Destination;
  highlightGemId?: string;
  onSelectGem?: (gem: HiddenGem) => void;
  showRouteOptimizer?: boolean;
}

export function TravelMap({
  destination,
  highlightGemId,
  onSelectGem,
  showRouteOptimizer = true,
}: TravelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  const { selectedGems, addGemToTrip, removeGemFromTrip } = useAppStore();
  const [selectedPin, setSelectedPin] = useState<HiddenGem | null>(null);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRouteResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically load leaflet and its CSS
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css' as any),
    ]).then(([leafletModule]) => {
      if (!isMounted || !mapContainerRef.current) return;
      const L = leafletModule.default || leafletModule;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapContainerRef.current, {
        center: [destination.coordinates.lat, destination.coordinates.lng],
        zoom: 11,
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      // Base OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;

      // Custom DivIcon generator
      const createCustomIcon = (type: 'main' | 'gem' | 'selected', label: string, color: string) => {
        return L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              background-color: ${color};
              color: white;
              padding: 4px 8px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 700;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              gap: 4px;
              white-space: nowrap;
              border: 2px solid white;
              transform: translate(-50%, -50%);
              cursor: pointer;
            ">
              <span>${type === 'main' ? '⭐' : '💎'}</span>
              <span>${label}</span>
            </div>
          `,
          iconSize: [100, 30],
          iconAnchor: [50, 15],
        });
      };

      // 1. Add Main Destination Marker
      const mainMarker = L.marker([destination.coordinates.lat, destination.coordinates.lng], {
        icon: createCustomIcon('main', destination.mainAttractionName.split(' ')[0], '#dc2626'),
      }).addTo(markersGroup);

      mainMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; max-width: 200px;">
          <strong style="color: #1c2826;">${destination.mainAttractionName}</strong>
          <p style="margin: 4px 0; color: #dc2626; font-weight: 600;">Main Destination (Predicted High Crowd)</p>
          <span style="font-size: 10px; color: #666;">Explore surrounding gems for lower wait times</span>
        </div>
      `);

      // 2. Add Hidden Gems Markers
      destination.hiddenGems.forEach((gem) => {
        const isSelected = selectedGems.some((g) => g.id === gem.id);
        const color = isSelected ? '#0284c7' : '#10b981';

        const marker = L.marker([gem.coordinates.lat, gem.coordinates.lng], {
          icon: createCustomIcon('gem', gem.name.split(' ')[0], color),
        }).addTo(markersGroup);

        marker.on('click', () => {
          setSelectedPin(gem);
          if (onSelectGem) onSelectGem(gem);
        });
      });

      // Fit bounds if multiple points
      const allCoords: [number, number][] = [
        [destination.coordinates.lat, destination.coordinates.lng],
        ...destination.hiddenGems.map((g): [number, number] => [g.coordinates.lat, g.coordinates.lng]),
      ];
      map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [destination, selectedGems, onSelectGem]);

  // Handle Route Optimization Trigger
  const handleOptimizeRoute = async () => {
    setIsOptimizing(true);
    const gemsToRoute = selectedGems.length > 0 ? selectedGems : destination.hiddenGems.slice(0, 3);
    const result = optimizeRouteStops(destination.coordinates, gemsToRoute);
    setOptimizedRoute(result);

    // Draw Polyline on map
    if (mapInstanceRef.current) {
      const L = await import('leaflet');
      if (routePolylineRef.current) {
        mapInstanceRef.current.removeLayer(routePolylineRef.current);
      }

      const points: [number, number][] = [
        [destination.coordinates.lat, destination.coordinates.lng],
        ...result.orderedGems.map((g): [number, number] => [g.coordinates.lat, g.coordinates.lng]),
        [destination.coordinates.lat, destination.coordinates.lng], // return loop
      ];

      const polyline = L.polyline(points, {
        color: '#10b981',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.85,
      }).addTo(mapInstanceRef.current);

      routePolylineRef.current = polyline;
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [60, 60] });
    }

    setTimeout(() => {
      setIsOptimizing(false);
    }, 400);
  };

  return (
    <div className="relative w-full h-[500px] lg:h-[620px] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg flex flex-col">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full relative" />

      {/* Floating Route Optimizer Controls */}
      {showRouteOptimizer && (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <button
            onClick={handleOptimizeRoute}
            disabled={isOptimizing}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
          >
            <Route className="w-4 h-4 text-emerald-200" />
            <span>{isOptimizing ? 'Calculating Optimal Paths...' : '⚡ Optimize My Route'}</span>
          </button>

          {optimizedRoute && (
            <div className="bg-stone-900/90 backdrop-blur-md text-white border border-emerald-500/40 p-3 rounded-xl shadow-2xl text-xs max-w-xs animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between font-bold text-emerald-400 mb-1.5">
                <span>Optimal Route Found</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Backtracking eliminated! Saved <strong>{optimizedRoute.distanceSavedKm} km</strong> and approx{' '}
                <strong>{optimizedRoute.timeSavedMinutes} minutes</strong> of travel time.
              </p>
              <div className="mt-2 pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                <span>Total: {optimizedRoute.totalDistanceKm} km</span>
                <span>Est: {formatTime(optimizedRoute.totalTravelMinutes)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200 dark:border-stone-800 px-3 py-2 rounded-xl text-[11px] flex items-center gap-3 shadow-md">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
          <span className="font-medium text-stone-700 dark:text-stone-300">Main Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-stone-700 dark:text-stone-300">Hidden Gem</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span className="font-medium text-stone-700 dark:text-stone-300">Selected</span>
        </div>
      </div>

      {/* Selected Gem Flyout Card */}
      {selectedPin && (
        <div className="absolute bottom-4 right-4 z-20 max-w-sm w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                {selectedPin.category}
              </span>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-1">
                {selectedPin.name}
              </h4>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs p-1"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1.5">
            {selectedPin.description}
          </p>

          <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-stone-100 dark:border-stone-800 text-[11px]">
            <div>
              <span className="text-stone-400 block text-[9px] uppercase">Travel Time</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {formatTime(selectedPin.travelTimeMinutes)}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[9px] uppercase">Crowd</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                {selectedPin.crowdData.level} ({selectedPin.crowdData.occupancyPercent}%)
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[9px] uppercase">Cost</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {selectedPin.estimatedCostInr === 0 ? 'Free' : formatCurrency(selectedPin.estimatedCostInr)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedGems.some((g) => g.id === selectedPin.id) ? (
              <button
                onClick={() => removeGemFromTrip(selectedPin.id)}
                className="flex-1 py-1.5 rounded-lg border border-rose-300 text-rose-700 dark:text-rose-400 dark:border-rose-900 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Remove from Trip
              </button>
            ) : (
              <button
                onClick={() => addGemToTrip(selectedPin)}
                className="flex-1 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 shadow"
              >
                + Add to My Itinerary
              </button>
            )}
            <button
              onClick={() => {
                if (onSelectGem) onSelectGem(selectedPin);
              }}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
