import { WeatherDayForecast } from '@/types';

/**
 * DESTINATION-AWARE WEATHER INTELLIGENCE SERVICE
 * Provides multi-day weather forecasts & advice for travel decisions.
 */

interface WeatherProfile {
  baseTemp: number;
  condition: string;
  rainProbability: number;
  windKmh: number;
  visibilityKm: number;
  icon: string;
}

const DESTINATION_WEATHER: Record<string, WeatherProfile> = {
  tirupati: {
    baseTemp: 28,
    condition: 'Pleasant & Breezy',
    rainProbability: 15,
    windKmh: 12,
    visibilityKm: 10,
    icon: '☀️',
  },
  hampi: {
    baseTemp: 27,
    condition: 'Sunny & Golden',
    rainProbability: 5,
    windKmh: 14,
    visibilityKm: 10,
    icon: '🌤️',
  },
  munnar: {
    baseTemp: 18,
    condition: 'Misty Highland Fog',
    rainProbability: 35,
    windKmh: 18,
    visibilityKm: 6,
    icon: '🌫️',
  },
  goa: {
    baseTemp: 31,
    condition: 'Sunny & Tropical',
    rainProbability: 20,
    windKmh: 16,
    visibilityKm: 10,
    icon: '🏖️',
  },
  jaipur: {
    baseTemp: 29,
    condition: 'Warm & Clear',
    rainProbability: 5,
    windKmh: 10,
    visibilityKm: 10,
    icon: '☀️',
  },
  varanasi: {
    baseTemp: 26,
    condition: 'Brisk Morning Mist',
    rainProbability: 10,
    windKmh: 8,
    visibilityKm: 8,
    icon: '🌅',
  },
};

export function getDestinationWeatherForecast(
  destinationSlug: string,
  daysCount: number = 3,
  rainOverride?: number
): WeatherDayForecast[] {
  const slug = destinationSlug.toLowerCase().trim();
  const profile = DESTINATION_WEATHER[slug] || DESTINATION_WEATHER.tirupati;

  const dayNames = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
  const today = new Date();

  return Array.from({ length: Math.min(daysCount, 5) }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const rainProb =
      rainOverride !== undefined && i === 1
        ? rainOverride
        : Math.min(95, Math.max(0, profile.rainProbability + (i % 2 === 1 ? 15 : -5)));

    const isHighRain = rainProb >= 60;
    const temp = profile.baseTemp + (i === 1 ? -1 : 1);

    let condition = profile.condition;
    let icon = profile.icon;
    let advice = 'Great conditions for uncrowded waterfalls and outdoor vistas.';

    if (isHighRain) {
      condition = 'Heavy Mountain Showers';
      icon = '🌧️';
      advice =
        'High rain forecast — cascade trails may be slippery. Indoor cultural sanctuaries & covered heritage pavilions are recommended.';
    } else if (temp >= 38) {
      condition = 'Intense Daytime Heat';
      icon = '🔥';
      advice = 'High temperatures expected midday. Schedule outdoor walks for early dawn or sunset.';
    } else if (rainProb >= 35) {
      condition = 'Passing Mountain Drizzle';
      icon = '🌦️';
      advice = 'Light intermittent drizzle. Wonderful for tea valleys and lush photo shoots.';
    }

    const crowdOutlook: 'low' | 'moderate' | 'high' =
      i === 0 ? 'moderate' : i === 1 ? (isHighRain ? 'low' : 'high') : 'low';

    const availabilityOutlook: 'available' | 'limited' | 'packed' =
      crowdOutlook === 'high' ? 'limited' : 'available';

    return {
      dayName: dayNames[i],
      dateStr: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      temperatureC: temp,
      rainProbability: rainProb,
      condition,
      icon,
      windKmh: profile.windKmh,
      visibilityKm: profile.visibilityKm,
      crowdOutlook,
      availabilityOutlook,
      isSafeForTreks: !isHighRain,
      isHighRain,
      advice,
    };
  });
}
