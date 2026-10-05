export type CrowdLevel = 'low' | 'moderate' | 'high';

export type Category = 
  | 'Divine' 
  | 'Spirituality'
  | 'Waterfalls' 
  | 'Beaches' 
  | 'Mountains' 
  | 'Nature' 
  | 'Heritage' 
  | 'History'
  | 'Adventure' 
  | 'Food' 
  | 'Photography' 
  | 'Shopping';

export type TravelStyle = 'Budget' | 'Standard' | 'Premium' | 'Luxury';
export type TravelType = 'Solo' | 'Friends' | 'Family' | 'Couple' | 'Seniors' | 'Children';
export type PlanningMode = 'near_me' | 'fixed_destination';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CrowdData {
  level: CrowdLevel;
  occupancyPercent: number;
  confidence: number;
  reason: string;
  trend: 'increasing' | 'stable' | 'decreasing';
  historicalAverage: number;
  lastUpdated: string;
}

export interface ScoreBreakdown {
  interestMatch: number;        // max 30
  travelTimeScore: number;      // max 20
  crowdHeadroomScore: number;  // max 20
  ratingScore: number;          // max 10
  availabilityScore: number;    // max 10
  budgetFitScore: number;       // max 10
  total: number;                // max 100
}

export interface RecommendationScore {
  score: number; // 0 - 100
  breakdown: ScoreBreakdown;
  reasons: string[];
  explanation: string;
  matchedPreferences: {
    interests: string[];
    companionFit: string;
    crowdMatch: boolean;
    distanceFit: boolean;
    timeFit: boolean;
    overnightFit: boolean;
    openNow: boolean;
  };
}

export interface HiddenGem {
  id: string;
  destinationSlug: string;
  name: string;
  subtitle: string;
  category: Category;
  tags: string[];
  coordinates: Coordinates;
  distanceFromMainKm: number;
  travelTimeMinutes: number;
  rating: number;
  reviewCount: number;
  crowdData: CrowdData;
  capacityMax: number;
  currentVisitorsEstimated: number;
  isOpenToday: boolean;
  isOpenNow: boolean;
  openingHours: string;
  openingTime: string;
  closingTime: string;
  daysOpen: string[];
  bestTimeToVisit: string;
  estimatedCostInr: number;
  ecoScore: number; // 0 - 100
  images: string[];
  description: string;
  whyVisit: string[];
  highlights: string[];
  companionSuitability: {
    familyFriendly: boolean;
    friendsAdventure: boolean;
    coupleRomantic: boolean;
    seniorGentle: boolean;
  };
  accessibility: {
    wheelchairFriendly: boolean;
    lowWalking: boolean;
    seniorFriendly: boolean;
    childFriendly: boolean;
    accessibleToilets: boolean;
  };
  safety: {
    rating: number;
    nearestHospitalKm: number;
    policeContact: string;
    trekDifficulty: 'Easy' | 'Moderate' | 'Challenging' | 'None';
    connectivity: '4G/5G' | 'Spotty' | 'None';
  };
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  state: string;
  country: string;
  coordinates: Coordinates;
  mainAttractionName: string;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: string[];
  defaultCrowd: CrowdData;
  openingHours: string;
  bestTravelTime: string;
  mainAttractionDetails: {
    name: string;
    openingHours: string;
    expectedCrowd: CrowdData;
    summary: string;
  };
  weather: {
    temperatureC: number;
    condition: string;
    rainProbability: number;
    humidity: number;
    bestTravelWindow: string;
  };
  localCuisine: Array<{
    name: string;
    isVeg: boolean;
    priceRange: string;
    description: string;
    image: string;
  }>;
  hiddenGems: HiddenGem[];
}

export interface Hotel {
  id: string;
  destinationSlug: string;
  name: string;
  type: 'Hotel' | 'Homestay' | 'Resort' | 'Villa';
  rating: number;
  pricePerNightInr: number;
  distanceFromCenterKm: number;
  image: string;
  amenities: string[];
  isAiRecommended?: boolean;
  isBestValue?: boolean;
  verified: boolean;
}

export interface Restaurant {
  id: string;
  destinationSlug: string;
  name: string;
  cuisine: string;
  rating: number;
  priceForTwoInr: number;
  isVeg: boolean;
  distanceKm: number;
  image: string;
  specialty: string;
  openNow: boolean;
}

export interface LocalGuide {
  id: string;
  destinationSlug: string;
  name: string;
  photo: string;
  rating: number;
  languages: string[];
  experienceYears: number;
  pricePerDayInr: number;
  verified: boolean;
  specialty: string;
  available: boolean;
  phone?: string;
}

export interface TransportOption {
  id: string;
  type: 'Bus' | 'Train' | 'Cab' | 'Flight';
  provider: string;
  priceInr: number;
  durationHours: number;
  rating: number;
  co2Kg: number;
  verified: boolean;
  frequency: string;
}

export interface UserPreferences {
  destinationSlug: string;
  planningMode: PlanningMode;
  userCurrentLocation?: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  travelType: TravelType;
  companionType: TravelType;
  groupSize: number;
  durationDays: number;
  totalBudgetInr: number;
  travelStyle: TravelStyle;
  maxDistanceKm: number;
  maxTravelTimeMinutes: number;
  isOvernightWilling: boolean;
  crowdPreference: CrowdLevel;
  interests: Category[];
  startDate?: string;
  startLocation?: string;
  transportPreference?: 'Bus' | 'Train' | 'Car' | 'Cab' | 'Flight';
  accommodationPreference?: 'Hotel' | 'Resort' | 'Villa' | 'Homestay';
  accessibilityFilters?: {
    wheelchair?: boolean;
    lowWalking?: boolean;
    seniorFriendly?: boolean;
    childFriendly?: boolean;
  };
}

export interface ItineraryItem {
  id: string;
  dayNumber: number;
  timeSlot: string; // e.g. "08:30"
  title: string;
  description: string;
  locationName: string;
  category: Category | 'Logistics' | 'Dining' | 'Stay';
  estimatedDurationHours: number;
  estimatedCostInr: number;
  isCustom?: boolean;
  gemId?: string;
  coordinates?: Coordinates;
}

export interface DayPlan {
  dayNumber: number;
  dateStr?: string;
  theme: string;
  items: ItineraryItem[];
  dayEcoScore: number;
  estimatedDayCostInr: number;
}

export interface CompleteTrip {
  id: string;
  title: string;
  destination: Destination;
  preferences: UserPreferences;
  days: DayPlan[];
  selectedGems: HiddenGem[];
  budget: {
    totalBudget: number;
    estimatedCost: number;
    remainingBudget: number;
    costPerPerson: number;
    breakdown: {
      transport: number;
      stay: number;
      food: number;
      localTransport: number;
      guide: number;
      activities: number;
      emergencyBuffer: number;
    };
  };
  overallEcoScore: number;
  createdAt: string;
  status: 'planned' | 'saved' | 'completed';
}

export interface PassportBadge {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  unlockedAt?: string;
  criteria: string;
  points: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  category: 'Stay' | 'Food' | 'Transport' | 'Tickets' | 'Misc';
  splitAmong: string[];
}

export interface VisitorReview {
  id: string;
  gemId: string;
  destinationSlug: string;
  tripId?: string;
  bookingId?: string;
  authorName: string;
  authorLocation?: string;
  rating: number; // 1 - 5
  writtenReview: string;
  visitDate: string;
  crowdExperience: 'very_low' | 'moderate' | 'very_high';
  safetyExperience: 'excellent' | 'good' | 'average' | 'poor';
  accessibilityExperience: 'easy' | 'moderate' | 'challenging';
  valueForMoney: 'great' | 'fair' | 'overpriced';
  wouldRecommend: boolean;
  isVerifiedVisitor: boolean;
  createdAt: string;
}

export interface QualityGateResult {
  isSafe: boolean;
  isReachable: boolean;
  isRelevant: boolean;
  isAvailable: boolean;
  isWellReviewed: boolean;
  weatherSuitable: boolean;
  satisfactionScore?: number;
  isLimitedInformation?: boolean;
  qualityPassed: boolean;
  flagReason?: string;
  warningNotice?: string;
  rejectionNotice?: string;
}

export interface WeatherDayForecast {
  dayName: string;
  dateStr: string;
  temperatureC: number;
  rainProbability: number;
  condition: string;
  icon: string;
  windKmh: number;
  visibilityKm: number;
  crowdOutlook: 'low' | 'moderate' | 'high';
  availabilityOutlook: 'available' | 'limited' | 'packed';
  isSafeForTreks: boolean;
  isHighRain: boolean;
  advice: string;
}

export interface DiscoveryParams {
  startLocation: string;
  budgetInr: number;
  travellersCount: number;
  durationDays: number;
  travelDate?: string;
  selectedInterests?: string[];
  companionType?: TravelType;
}

export interface ComparisonData {
  famousName: string;
  famousCrowd: string;
  famousWaitHours: number;
  famousCostTier: string;
  hiddenName: string;
  hiddenCrowd: string;
  hiddenTravelTimeMins: number;
  hiddenCostTier: string;
  benefitMessage: string;
}

export interface DiscoveryResult {
  id: string;
  destination: Destination;
  params: DiscoveryParams;
  hiddenGems: Array<{
    gem: HiddenGem;
    score: number;
    breakdown: ScoreBreakdown;
    recommendationReason: string;
    satisfactionScore: number;
    qualityGate: QualityGateResult;
  }>;
  comparison: ComparisonData;
  weatherForecast: WeatherDayForecast[];
  estimatedTotalCost: number;
  surpriseGem?: HiddenGem;
}

