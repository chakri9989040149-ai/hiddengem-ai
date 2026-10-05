import { HiddenGem, UserPreferences, QualityGateResult, WeatherDayForecast } from '@/types';

/**
 * HIDDENGEM QUALITY GATE SYSTEM
 * 
 * CORE PRINCIPLE:
 * "Less discovered + safe + accessible + enjoyable + relevant + available = potential HiddenGem."
 * 
 * Places failing critical safety, accessibility fit, or active weather warnings
 * are disqualified or flagged with explicit warnings.
 */
export function evaluateQualityGate(
  gem: HiddenGem,
  preferences?: Partial<UserPreferences>,
  currentWeather?: WeatherDayForecast,
  isManuallyUnsafe?: boolean
): QualityGateResult {
  const companion = preferences?.companionType || preferences?.travelType || 'Friends';
  const accessibility = gem.accessibility || {};
  const safety = gem.safety || { rating: 4.5, trekDifficulty: 'Easy', connectivity: '4G/5G' };

  let isSafe = !isManuallyUnsafe;
  let isReachable = true;
  let isRelevant = true;
  let isAvailable = gem.isOpenToday !== false;
  let isWellReviewed = (gem.reviewCount || 0) >= 5 && (gem.rating || 0) >= 3.8;
  let weatherSuitable = true;
  let flagReason: string | undefined = isManuallyUnsafe
    ? 'Marked unsafe by local tourism administration / hazard alert'
    : undefined;
  let warningNotice: string | undefined;
  let rejectionNotice: string | undefined;

  // Compute visitor satisfaction (e.g. 92%)
  const satisfactionScore = Math.round(((gem.rating || 4.5) / 5) * 100);

  // 1. Limited Information Check
  const isLimitedInformation = (gem.reviewCount || 0) < 5;
  if (isLimitedInformation) {
    warningNotice = '⚠️ Limited information — verify conditions locally before venturing out.';
  }

  // 2. Closed / Restricted Areas & Capacity Limits
  if (gem.isOpenToday === false) {
    isAvailable = false;
    flagReason = 'Location currently closed or under seasonal restriction';
  } else if (gem.crowdData && gem.crowdData.occupancyPercent >= 92) {
    isAvailable = false;
    flagReason = 'Safe visitor capacity limit exceeded';
  }

  // 3. Accessibility & Low-Mobility / Senior Checks
  if (companion === 'Seniors' || preferences?.accessibilityFilters?.seniorFriendly || preferences?.accessibilityFilters?.lowWalking) {
    if (safety.trekDifficulty === 'Challenging' || !accessibility.seniorFriendly) {
      isSafe = false;
      flagReason = 'Steep boulder terrain / challenging trek unsuitable for senior travellers';
    }
  }

  if (companion === 'Family') {
    if (safety.trekDifficulty === 'Challenging' && !accessibility.childFriendly) {
      warningNotice = 'Challenging scramble - adult supervision required for younger children';
    }
  }

  // 4. Extreme Weather / Flood Risk / Landslide Risk Check
  if (currentWeather) {
    if (currentWeather.isHighRain) {
      if (gem.category === 'Waterfalls' || safety.trekDifficulty === 'Challenging') {
        isSafe = false;
        weatherSuitable = false;
        flagReason = 'Flash flood / slippery trail hazard during heavy rainfall';
        warningNotice = `Heavy rain forecast (${currentWeather.rainProbability}%) — outdoor cascade unsafe`;
      }
    }
    if (currentWeather.temperatureC >= 41 && safety.trekDifficulty !== 'None') {
      warningNotice = 'Extreme midday heat (>40°C) — schedule visit only during dawn or sunset';
    }
  }

  // 5. Visitor Satisfaction Check
  if (satisfactionScore < 70) {
    isWellReviewed = false;
    flagReason = 'Visitor satisfaction rating below HiddenGem standards';
  }

  // Safety Rejection Statement as strictly mandated
  if (!isSafe) {
    rejectionNotice =
      'This location matches your interests but is currently not recommended because conditions may be unsafe.';
  }

  const qualityPassed = isSafe && isReachable && isRelevant && isAvailable && weatherSuitable;

  return {
    isSafe,
    isReachable,
    isRelevant,
    isAvailable,
    isWellReviewed,
    weatherSuitable,
    satisfactionScore,
    isLimitedInformation,
    qualityPassed,
    flagReason,
    warningNotice,
    rejectionNotice,
  };
}

/**
 * Filter gems by Quality Gate criteria
 */
export function filterByQualityGate(
  gems: HiddenGem[],
  preferences?: Partial<UserPreferences>,
  currentWeather?: WeatherDayForecast,
  unsafeGemsMap?: Record<string, boolean>
): HiddenGem[] {
  return gems.filter((gem) => {
    const isUnsafe = Boolean(unsafeGemsMap && unsafeGemsMap[gem.id]);
    const gate = evaluateQualityGate(gem, preferences, currentWeather, isUnsafe);
    return gate.qualityPassed;
  });
}
