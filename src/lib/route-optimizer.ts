import { Coordinates, HiddenGem } from '@/types';

/**
 * Calculates Euclidean distance between two geographic coordinates in km (Haversine formula)
 */
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface OptimizedRouteResult {
  orderedGems: HiddenGem[];
  totalDistanceKm: number;
  totalTravelMinutes: number;
  distanceSavedKm: number;
  timeSavedMinutes: number;
  waypoints: Array<{ name: string; lat: number; lng: number }>;
}

/**
 * Optimizes a list of stops to minimize distance and eliminate circular backtracking
 * using Nearest Neighbor TSP heuristic.
 */
export function optimizeRouteStops(
  startPoint: Coordinates,
  gems: HiddenGem[]
): OptimizedRouteResult {
  if (gems.length <= 1) {
    const dist = gems.length === 1 ? calculateDistanceKm(startPoint, gems[0].coordinates) : 0;
    return {
      orderedGems: gems,
      totalDistanceKm: dist,
      totalTravelMinutes: Math.round(dist * 1.5),
      distanceSavedKm: 0,
      timeSavedMinutes: 0,
      waypoints: gems.map((g) => ({ name: g.name, lat: g.coordinates.lat, lng: g.coordinates.lng })),
    };
  }

  // Calculate unoptimized sequence distance
  let originalDistance = 0;
  let curr = startPoint;
  for (const g of gems) {
    originalDistance += calculateDistanceKm(curr, g.coordinates);
    curr = g.coordinates;
  }

  // Nearest Neighbor algorithm
  const unvisited = [...gems];
  const ordered: HiddenGem[] = [];
  let currentPos = startPoint;
  let optimizedDistance = 0;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const d = calculateDistanceKm(currentPos, unvisited[i].coordinates);
      if (d < minDistance) {
        minDistance = d;
        nearestIdx = i;
      }
    }

    const nextStop = unvisited.splice(nearestIdx, 1)[0];
    ordered.push(nextStop);
    optimizedDistance += minDistance;
    currentPos = nextStop.coordinates;
  }

  const distanceSaved = Math.max(0, Math.round((originalDistance - optimizedDistance) * 10) / 10);
  const timeSaved = Math.round(distanceSaved * 1.6);

  return {
    orderedGems: ordered,
    totalDistanceKm: Math.round(optimizedDistance * 10) / 10,
    totalTravelMinutes: Math.round(optimizedDistance * 1.5),
    distanceSavedKm: distanceSaved,
    timeSavedMinutes: timeSaved,
    waypoints: ordered.map((g) => ({
      name: g.name,
      lat: g.coordinates.lat,
      lng: g.coordinates.lng,
    })),
  };
}
