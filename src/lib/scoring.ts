import {
  HiddenGem,
  UserPreferences,
  Destination,
  CrowdData,
  RecommendationScore,
  ScoreBreakdown,
} from '@/types';
import { DESTINATIONS } from './data/seed';

/**
 * Deterministic, explainable recommendation engine for HiddenGem AI.
 * Weight Distribution:
 * - Interest Match: 30%
 * - Travel Time: 20%
 * - Crowd + Capacity Headroom: 20%
 * - Rating: 10%
 * - Availability: 10%
 * - Budget Fit: 10%
 * Total = 100%
 */
export function calculateHiddenGemScore(
  userPreferences: UserPreferences,
  destination: Destination,
  hiddenGem: HiddenGem,
  crowdOverride?: CrowdData,
  availabilityOverride?: boolean,
  budgetOverride?: number
): RecommendationScore {
  const reasons: string[] = [];
  const crowd = crowdOverride || hiddenGem.crowdData;
  const isOpen = availabilityOverride !== undefined ? availabilityOverride : hiddenGem.isOpenToday;
  const maxTravelTime = userPreferences.maxTravelTimeMinutes || 90;
  const maxDistance = userPreferences.maxDistanceKm || 50;
  const userInterests = userPreferences.interests || [];
  const companion = userPreferences.companionType || userPreferences.travelType || 'Friends';
  const crowdPref = userPreferences.crowdPreference || 'low';

  // 1. Interest Match (30 pts max)
  let interestMatch = 0;
  const categoryMatched = userInterests.some(
    (ui) => ui.toLowerCase() === hiddenGem.category.toLowerCase()
  );
  const matchingTags = hiddenGem.tags.filter((tag) =>
    userInterests.some((ui) => ui.toLowerCase() === tag.toLowerCase())
  );

  if (userInterests.length === 0) {
    interestMatch = 22;
    reasons.push('Curated off-beat exploration profile');
  } else if (categoryMatched) {
    interestMatch = 24 + Math.min(6, matchingTags.length * 3);
    reasons.push(`${hiddenGem.category} interest match ✓`);
  } else if (matchingTags.length > 0) {
    interestMatch = 16 + Math.min(8, matchingTags.length * 4);
    reasons.push(`Matches ${matchingTags.slice(0, 2).join(' & ')} interests ✓`);
  } else {
    interestMatch = 8;
  }

  // Companion fit bonus/penalty within interest weight
  let companionFitLabel = '';
  if (companion === 'Family') {
    if (hiddenGem.companionSuitability?.familyFriendly || hiddenGem.accessibility?.childFriendly) {
      interestMatch = Math.min(30, interestMatch + 2);
      companionFitLabel = 'Family Friendly ✓';
      reasons.push('Safe & accessible for family');
    }
  } else if (companion === 'Friends') {
    if (hiddenGem.companionSuitability?.friendsAdventure || hiddenGem.tags.includes('Adventure') || hiddenGem.tags.includes('Friends')) {
      interestMatch = Math.min(30, interestMatch + 2);
      companionFitLabel = 'Friends Adventure Vibe ✓';
      reasons.push('Great for friends & photography');
    }
  } else if (companion === 'Couple') {
    companionFitLabel = 'Scenic Couple Spot ✓';
  } else if (companion === 'Seniors') {
    companionFitLabel = 'Senior Gentle Access ✓';
  } else {
    companionFitLabel = 'Solo Explorer ✓';
  }

  interestMatch = Math.min(30, Math.max(0, interestMatch));

  // 2. Travel Time & Distance (20 pts max)
  let travelTimeScore = 0;
  const tTime = hiddenGem.travelTimeMinutes;
  const dist = hiddenGem.distanceFromMainKm;

  const isOvernight = userPreferences.isOvernightWilling ?? true;

  if (tTime <= 20) {
    travelTimeScore = 20;
    reasons.push(`Only ${tTime} min away (${dist} km)`);
  } else if (tTime <= 45) {
    travelTimeScore = 17;
    reasons.push(`Quick ${tTime} min drive (${dist} km)`);
  } else if (tTime <= maxTravelTime || (isOvernight && tTime <= 180)) {
    const ratio = Math.max(0, (maxTravelTime - tTime) / (maxTravelTime || 60));
    travelTimeScore = Math.round(10 + Math.max(0, ratio * 7));
    if (isOvernight && tTime > maxTravelTime) {
      reasons.push(`Overnight travel radius (${tTime} min)`);
    } else {
      reasons.push(`Within your radius (${tTime} min, ${dist} km)`);
    }
  } else {
    travelTimeScore = Math.max(3, Math.round(10 - ((tTime - maxTravelTime) / 20) * 3));
  }
  travelTimeScore = Math.min(20, Math.max(0, travelTimeScore));

  // 3. Crowd + Capacity Headroom (20 pts max)
  let crowdHeadroomScore = 0;
  const occupancy = crowd.occupancyPercent;
  const headroom = Math.max(0, 100 - occupancy);
  let crowdMatch = false;

  if (crowdPref === 'low') {
    if (crowd.level === 'low') {
      crowdHeadroomScore = Math.round(16 + (headroom / 100) * 4);
      crowdMatch = true;
      reasons.push(`Low crowd (${occupancy}% capacity) — matches preference ✓`);
    } else if (crowd.level === 'moderate') {
      crowdHeadroomScore = Math.round(11 + (headroom / 100) * 3);
    } else {
      crowdHeadroomScore = Math.max(2, Math.round(4 + (headroom / 100) * 2));
    }
  } else if (crowdPref === 'moderate') {
    if (crowd.level === 'moderate' || crowd.level === 'low') {
      crowdHeadroomScore = Math.round(15 + (headroom / 100) * 4);
      crowdMatch = true;
      reasons.push('Comfortable balanced crowd ✓');
    } else {
      crowdHeadroomScore = Math.round(8 + (headroom / 100) * 2);
    }
  } else {
    // High crowd tolerance
    crowdHeadroomScore = Math.round(14 + (headroom / 100) * 4);
    crowdMatch = true;
  }
  crowdHeadroomScore = Math.min(20, Math.max(0, crowdHeadroomScore));

  // 4. Rating (10 pts max)
  const ratingScore = Math.round(((hiddenGem.rating || 4.0) / 5.0) * 10 * 10) / 10;
  if (hiddenGem.rating >= 4.6) {
    reasons.push(`Top-rated (${hiddenGem.rating}★ from ${hiddenGem.reviewCount} reviews)`);
  }

  // 5. Availability & Opening Hours (10 pts max)
  let availabilityScore = 0;
  if (isOpen) {
    availabilityScore = 10;
    reasons.push(`Open now (${hiddenGem.openingHours || 'All day'}) ✓`);
  } else {
    availabilityScore = 2;
    reasons.push('Closed during selected window');
  }

  // 6. Budget Fit (10 pts max)
  let budgetFitScore = 0;
  const budgetTarget = budgetOverride || userPreferences.totalBudgetInr || 10000;
  const perPersonTarget = budgetTarget / Math.max(1, userPreferences.groupSize || 1);
  const cost = hiddenGem.estimatedCostInr;

  if (cost === 0) {
    budgetFitScore = 10;
    reasons.push('Free entry experience');
  } else if (cost <= perPersonTarget * 0.15) {
    budgetFitScore = 10;
    reasons.push(`Fits budget comfortably (₹${cost})`);
  } else if (cost <= perPersonTarget * 0.3) {
    budgetFitScore = 8;
    reasons.push(`Affordable excursion (₹${cost})`);
  } else if (cost <= perPersonTarget * 0.5) {
    budgetFitScore = 6;
  } else {
    budgetFitScore = 4;
  }

  // Total Score (Strictly 100% max)
  const breakdown: ScoreBreakdown = {
    interestMatch: Math.round(interestMatch * 10) / 10,
    travelTimeScore: Math.round(travelTimeScore * 10) / 10,
    crowdHeadroomScore: Math.round(crowdHeadroomScore * 10) / 10,
    ratingScore: Math.round(ratingScore * 10) / 10,
    availabilityScore: Math.round(availabilityScore * 10) / 10,
    budgetFitScore: Math.round(budgetFitScore * 10) / 10,
    total: 0,
  };

  const rawTotal =
    breakdown.interestMatch +
    breakdown.travelTimeScore +
    breakdown.crowdHeadroomScore +
    breakdown.ratingScore +
    breakdown.availabilityScore +
    breakdown.budgetFitScore;

  const totalScore = Math.min(100, Math.max(10, Math.round(rawTotal)));
  breakdown.total = totalScore;

  const matchedInterests = userInterests.filter((ui) =>
    hiddenGem.tags.some((t) => t.toLowerCase() === ui.toLowerCase()) ||
    hiddenGem.category.toLowerCase() === ui.toLowerCase()
  );

  const explanation = `Matches your ${matchedInterests.slice(0, 2).join(' and ') || 'curated'} interests, stays within ${userPreferences.maxDistanceKm || 50} km, features ${crowd.level} crowd, and is suitable for ${companion}.`;

  return {
    score: totalScore,
    breakdown,
    reasons,
    explanation,
    matchedPreferences: {
      interests: matchedInterests,
      companionFit: companionFitLabel,
      crowdMatch,
      distanceFit: hiddenGem.distanceFromMainKm <= (userPreferences.maxDistanceKm || 50),
      timeFit: hiddenGem.travelTimeMinutes <= (userPreferences.maxTravelTimeMinutes || 90),
      overnightFit: isOvernight,
      openNow: hiddenGem.isOpenNow ?? true,
    },
  };
}

/**
 * Filter, score, and rank nearby hidden gems for a destination and preferences.
 * Applies hard constraints (max distance, travel time, companion, overnight willingness),
 * weather hazards, crowd relief boosts, and safety filter disqualifications.
 */
export function rankHiddenGems(
  destination: Destination,
  preferences: UserPreferences,
  adminHighCrowd = false,
  weatherForecast?: { isHighRain?: boolean; rainProbability?: number },
  unsafeGemsMap?: Record<string, boolean>
): Array<{ gem: HiddenGem; score: RecommendationScore }> {
  let gems = destination.hiddenGems || [];

  const maxDistance = preferences.maxDistanceKm || 50;
  const maxTime = preferences.maxTravelTimeMinutes || 90;
  const isOvernight = preferences.isOvernightWilling ?? true;

  // Filter based on maximum distance and travel time constraints
  // If user is willing to stay overnight, distance/time can flex by up to 2.5x
  const distThreshold = isOvernight ? Math.max(maxDistance, 100) : maxDistance * 1.15;
  const timeThreshold = isOvernight ? Math.max(maxTime, 120) : maxTime * 1.15;

  let filtered = gems.filter((g) => {
    return g.distanceFromMainKm <= distThreshold && g.travelTimeMinutes <= timeThreshold;
  });

  // If strict filtering left too few, fallback gracefully so user is never left with an empty screen
  if (filtered.length === 0) {
    filtered = gems;
  }

  const scored = filtered.map((gem) => {
    const isUnsafe = Boolean(unsafeGemsMap && unsafeGemsMap[gem.id]);
    const score = calculateHiddenGemScore(preferences, destination, gem);

    // Weather Awareness (TEST 4: Heavy rain reduces outdoor waterfalls, elevates indoor cultural gems)
    if (weatherForecast?.isHighRain) {
      if (gem.category === 'Waterfalls' || gem.safety?.trekDifficulty === 'Challenging') {
        score.score = Math.max(10, score.score - 28);
        score.reasons.unshift('🌧️ Heavy Rain Alert: Outdoor trails demoted for safety');
      } else if (gem.category === 'Heritage' || gem.category === 'History' || gem.category === 'Spirituality') {
        score.score = Math.min(100, score.score + 12);
        score.reasons.unshift('🏛️ Weather Alternative: Covered cultural haven prioritized during rain');
      }
    }

    // High Crowd Alert Awareness (TEST 3: Main crowd is HIGH -> boost uncrowded hidden gems)
    if (adminHighCrowd || destination.defaultCrowd?.level === 'high') {
      if (gem.crowdData.occupancyPercent <= 45) {
        score.score = Math.min(100, score.score + 8);
        score.reasons.unshift('⚡ Low-Crowd Sanctuary: Recommended relief from main peak queue wait times');
      }
    }

    // Safety Filter (TEST 5: Unsafe gems CANNOT appear as primary recommendations)
    if (isUnsafe) {
      score.score = 0;
      score.reasons = ['🚫 DO NOT RECOMMEND: Conditions may be unsafe'];
      score.explanation =
        'This location matches your interests but is currently not recommended because conditions may be unsafe.';
    }

    return { gem, score };
  });

  // Sort descending by score
  return scored.sort((a, b) => b.score.score - a.score.score);
}

/**
 * SIMILAR DESTINATIONS ENGINE (Section 6 & 5)
 * Discovers gems across other destinations sharing the same interests, activities, or vibe
 */
export function findSimilarDestinations(
  currentDestinationSlug: string,
  preferences: UserPreferences
): Array<{ gem: HiddenGem; score: RecommendationScore; destinationName: string }> {
  const otherDestinations = DESTINATIONS.filter((d) => d.slug !== currentDestinationSlug);
  const allSimilarGems: Array<{ gem: HiddenGem; score: RecommendationScore; destinationName: string }> = [];

  otherDestinations.forEach((dest) => {
    dest.hiddenGems.forEach((gem) => {
      // Check if gem matches any user interest or current destination themes
      const matchesInterest = preferences.interests.some(
        (ui) =>
          ui.toLowerCase() === gem.category.toLowerCase() ||
          gem.tags.some((t) => t.toLowerCase() === ui.toLowerCase())
      );

      if (matchesInterest || gem.rating >= 4.8) {
        const score = calculateHiddenGemScore(preferences, dest, gem);
        allSimilarGems.push({
          gem,
          score,
          destinationName: dest.name,
        });
      }
    });
  });

  return allSimilarGems.sort((a, b) => b.score.score - a.score.score).slice(0, 4);
}

/**
 * "Not what you expected?" alternative generator
 * Options: 'nearby' | 'similar' | 'quieter' | 'adventurous' | 'scenic' | 'family'
 */
export function getAlternativeRecommendations(
  destination: Destination,
  preferences: UserPreferences,
  mode: 'all' | 'nearby' | 'similar' | 'quieter' | 'adventurous' | 'scenic' | 'family'
): Array<{ gem: HiddenGem; score: RecommendationScore }> {
  let gems = destination.hiddenGems || [];

  if (mode === 'quieter') {
    gems = gems.filter((g) => g.crowdData.level === 'low');
  } else if (mode === 'adventurous') {
    gems = gems.filter((g) => g.category === 'Adventure' || g.tags.includes('Adventure'));
  } else if (mode === 'scenic') {
    gems = gems.filter(
      (g) => g.category === 'Waterfalls' || g.category === 'Mountains' || g.tags.includes('Photography')
    );
  } else if (mode === 'family') {
    gems = gems.filter((g) => g.companionSuitability?.familyFriendly);
  } else if (mode === 'nearby') {
    gems = [...gems].sort((a, b) => a.distanceFromMainKm - b.distanceFromMainKm);
  }

  if (gems.length === 0) gems = destination.hiddenGems;

  return gems
    .map((gem) => ({
      gem,
      score: calculateHiddenGemScore(preferences, destination, gem),
    }))
    .sort((a, b) => b.score.score - a.score.score);
}
