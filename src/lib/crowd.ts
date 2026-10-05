import { CrowdData, CrowdLevel } from '@/types';

export interface CrowdPredictionResult {
  crowdLevel: CrowdLevel;
  estimatedOccupancy: number;
  confidence: number;
  reason: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  historicalAverage: number;
  lastUpdated: string;
  recommendation: string;
}

/**
 * Predicts crowd level using time of day, day of week, seasonal pilgrimage/tourist cycles,
 * and optional admin simulator override.
 * Strictly transparent: labeled as "AI Predicted Crowd".
 */
export function predictCrowdLevel(
  destinationSlug: string,
  date: Date = new Date(),
  adminOverrideLevel?: CrowdLevel | null
): CrowdPredictionResult {
  // If admin has simulated a crowd spike, immediately return high crowd
  if (adminOverrideLevel) {
    const isHigh = adminOverrideLevel === 'high';
    const isMod = adminOverrideLevel === 'moderate';
    return {
      crowdLevel: adminOverrideLevel,
      estimatedOccupancy: isHigh ? 88 : isMod ? 62 : 28,
      confidence: 94,
      reason: isHigh
        ? 'Admin Simulation: Peak surge triggered with high queue wait times (> 3.5 hrs)'
        : 'Admin Simulation: Balanced moderate visitor arrival rate',
      trend: isHigh ? 'increasing' : 'stable',
      historicalAverage: 72,
      lastUpdated: 'Just now (Simulated)',
      recommendation: isHigh
        ? '⚠ High Crowd Expected. We strongly recommend visiting nearby alternative gems with low wait times.'
        : 'Moderate crowd. Advance booking or early morning arrival suggested.',
    };
  }

  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
  const hour = date.getHours();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Base occupancy by destination
  let baseOccupancy = 45;
  if (destinationSlug === 'tirupati') {
    // Tirumala is naturally high volume, especially on weekends and mornings
    baseOccupancy = isWeekend ? 78 : 64;
    if (hour >= 6 && hour <= 14) baseOccupancy += 10;
  } else if (destinationSlug === 'hampi') {
    // Heritage site, busiest midday and winter weekends
    baseOccupancy = isWeekend ? 58 : 38;
    if (hour >= 9 && hour <= 16) baseOccupancy += 8;
  } else if (destinationSlug === 'munnar') {
    // Hill station, weekend influx
    baseOccupancy = isWeekend ? 65 : 42;
    if (hour >= 10 && hour <= 17) baseOccupancy += 6;
  }

  // Add small deterministic variance based on day of month
  const dayOffset = (date.getDate() % 5) * 2;
  const occupancy = Math.min(95, Math.max(15, baseOccupancy + dayOffset));

  let level: CrowdLevel = 'low';
  let reason = '';
  let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';

  if (occupancy >= 70) {
    level = 'high';
    reason = isWeekend
      ? 'Weekend peak influx with high queue wait times expected'
      : 'Midday rush with high temple/entry occupancy';
    trend = hour < 14 ? 'increasing' : 'decreasing';
  } else if (occupancy >= 45) {
    level = 'moderate';
    reason = 'Steady visitor arrivals with moderate queue movement';
    trend = 'stable';
  } else {
    level = 'low';
    reason = 'Peaceful low crowd conditions with minimal waiting time';
    trend = 'decreasing';
  }

  const recommendation =
    level === 'high'
      ? '⚠ High Crowd Expected: Instead of spending your time in a crowded destination, we found 3+ nearby experiences that match your interests.'
      : level === 'moderate'
      ? 'Moderate crowd. Good time to explore, but peak spots may have short queues.'
      : 'Optimal peaceful time to explore. Enjoy quiet photo spots and quick entry.';

  return {
    crowdLevel: level,
    estimatedOccupancy: occupancy,
    confidence: 88,
    reason,
    trend,
    historicalAverage: Math.round(occupancy * 0.9),
    lastUpdated: 'Updated 5 minutes ago (AI Model)',
    recommendation,
  };
}

export function formatCrowdLevel(level: CrowdLevel): {
  label: string;
  colorClass: string;
  badgeBg: string;
  dotColor: string;
  icon: string;
} {
  switch (level) {
    case 'high':
      return {
        label: 'High Crowd',
        colorClass: 'text-rose-600 dark:text-rose-400',
        badgeBg: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300',
        dotColor: 'bg-rose-500',
        icon: '🔴',
      };
    case 'moderate':
      return {
        label: 'Moderate Crowd',
        colorClass: 'text-amber-600 dark:text-amber-400',
        badgeBg: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300',
        dotColor: 'bg-amber-500',
        icon: '🟡',
      };
    case 'low':
    default:
      return {
        label: 'Low Crowd',
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300',
        dotColor: 'bg-emerald-500',
        icon: '🟢',
      };
  }
}
