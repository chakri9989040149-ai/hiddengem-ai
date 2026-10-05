import { HiddenGem } from '@/types';
import { DESTINATIONS } from '@/lib/data/seed';
import { getAssetPath } from '@/lib/utils';

// ========================================================
// 1. DATA TYPES & INTERFACES FOR ALL 10 TRAVEL MODES
// ========================================================

export type TravelToolMode =
  | 'flights'
  | 'trains'
  | 'buses'
  | 'roadtrips'
  | 'hotels'
  | 'homestays'
  | 'guides'
  | 'trekking'
  | 'beaches'
  | 'heritage';

// FLIGHTS
export interface FlightSearchRequest {
  from: string;
  to: string;
  journeyDate: string;
  returnDate?: string;
  travellers: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  tripType: 'One Way' | 'Round Trip';
}

export interface FlightOption {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  logo: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  priceInr: number;
  baggage: string;
  cabinClass: string;
  seatsLeft: number;
  co2Kg: number;
  isDemoData: boolean;
  isBestValue?: boolean;
}

// TRAINS
export interface TrainSearchRequest {
  from: string;
  to: string;
  journeyDate: string;
  passengers: number;
  trainClass: 'General' | 'Sleeper' | '3A' | '2A' | '1A' | 'Chair Car' | 'Executive Chair Car';
  quota: 'General' | 'Tatkal' | 'Ladies' | 'Senior Citizen';
}

export interface TrainOption {
  id: string;
  trainName: string;
  trainNumber: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string;
  classes: Array<{
    className: string;
    fareInr: number;
    availability: string;
    status: 'AVAILABLE' | 'RAC' | 'WL';
  }>;
  pantryAvailable: boolean;
  isDemoData: boolean;
  isRecommended?: boolean;
}

// BUSES
export interface BusSearchRequest {
  from: string;
  to: string;
  travelDate: string;
  passengers: number;
  busType: 'All' | 'AC' | 'Non-AC' | 'Sleeper' | 'Semi-Sleeper' | 'Volvo Multi-Axle' | 'Government Bus';
  departureWindow: 'Any Time' | 'Morning' | 'Afternoon' | 'Evening' | 'Night';
}

export interface BusOption {
  id: string;
  operator: string;
  busType: string;
  fromLocation: string;
  toLocation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  priceInr: number;
  rating: number;
  seatsAvailable: number;
  amenities: string[];
  isGovtBus: boolean;
  isDemoData: boolean;
}

// ROAD TRIPS
export interface RoadTripRequest {
  startLocation: string;
  destination: string;
  travelDate: string;
  people: number;
  budgetInr: number;
  travelStyle: 'Scenic' | 'Fastest' | 'Hidden Gems' | 'Adventure' | 'Family' | 'Photography';
}

export interface RoadTripPlan {
  id: string;
  routeTitle: string;
  origin: string;
  destination: string;
  totalDistanceKm: number;
  drivingTimeFormatted: string;
  fuelEstimateInr: number;
  tollEstimateInr: number;
  recommendedVehicle: string;
  highwayNames: string[];
  foodStops: Array<{ name: string; specialty: string; kmMarker: number }>;
  restStops: Array<{ name: string; facilities: string; kmMarker: number }>;
  viewpoints: Array<{ name: string; highlight: string; kmMarker: number }>;
  hiddenGemsAlongRoute: HiddenGem[];
  interactiveWaypoints: Array<{ lat: number; lng: number; title: string }>;
  totalTripTransitCostInr: number;
  isDemoData: boolean;
}

// HOTELS & STAYS
export interface HotelSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  budgetMin: number;
  budgetMax: number;
  stayType: 'All' | 'Hotel' | 'Resort' | 'Budget' | 'Luxury' | 'Family' | 'Couple' | 'Near Destination' | 'Near Transport';
}

export interface HotelOption {
  id: string;
  name: string;
  destinationSlug: string;
  type: 'Hotel' | 'Resort' | 'Budget' | 'Luxury';
  rating: number;
  reviewCount: number;
  distanceFromAttractionKm: number;
  roomType: string;
  pricePerNightInr: number;
  amenities: string[];
  image: string;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  isDemoData: boolean;
  isAiRecommended?: boolean;
}

// HOMESTAYS
export interface HomestaySearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  budgetInr: number;
  propertyType: 'All' | 'Heritage Courtyard' | 'Plantation Cottage' | 'Organic Farmstead' | 'Village Haven';
}

export interface HomestayOption {
  id: string;
  name: string;
  hostName: string;
  destinationSlug: string;
  propertyType: string;
  rating: number;
  reviewCount: number;
  location: string;
  distanceKm: number;
  pricePerNightInr: number;
  amenities: string[];
  image: string;
  localExperience: string;
  aiWhyRecommended: string;
  isDemoData: boolean;
}

// LOCAL GUIDES
export interface GuideSearchRequest {
  destination: string;
  date: string;
  duration: '2 hours' | 'Half Day (4 hrs)' | 'Full Day (8 hrs)';
  language: string;
  specialization: string;
}

export interface GuideOption {
  id: string;
  name: string;
  destinationSlug: string;
  photo: string;
  verified: boolean;
  languages: string[];
  experienceYears: number;
  specialization: string;
  rating: number;
  reviewCount: number;
  priceInr: number;
  duration: string;
  availability: string;
  phone?: string;
  isDemoData: boolean;
}

// TREKKING
export interface TrekSearchRequest {
  destination: string;
  date: string;
  difficulty: 'All' | 'Easy' | 'Moderate' | 'Hard' | 'Extreme';
  duration: 'All' | '<2 hours' | '2–4 hours' | '4–8 hours' | 'Full Day';
  preference: 'All' | 'Waterfall' | 'Mountain' | 'Forest' | 'Sunrise' | 'Photography' | 'Adventure';
}

export interface TrekOption {
  id: string;
  trekName: string;
  location: string;
  destinationSlug: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Extreme';
  distanceKm: number;
  durationHours: number;
  elevationGainM: number;
  bestTime: string;
  weatherCondition: string;
  crowdLevel: 'low' | 'moderate' | 'high';
  safetyStatus: string;
  isSafeToday: boolean;
  safetyReason?: string;
  guideRequired: boolean;
  estimatedCostInr: number;
  image: string;
  highlights: string[];
  isDemoData: boolean;
}

// BEACHES
export interface BeachSearchRequest {
  destination: string;
  date: string;
  travelRadiusKm: number;
  crowdPreference: 'All' | 'Low' | 'Moderate' | 'High';
  activity: string;
}

export interface BeachOption {
  id: string;
  beachName: string;
  nearestCity: string;
  destinationSlug: string;
  distanceKm: number;
  travelTimeFormatted: string;
  crowdLevel: 'low' | 'moderate' | 'high';
  weather: string;
  activities: string[];
  safety: string;
  bestTime: string;
  rating: number;
  image: string;
  isOceanBeach: boolean;
  inlandNote?: string;
  isDemoData: boolean;
}

// HERITAGE
export interface HeritageSearchRequest {
  destination: string;
  date: string;
  interest: 'All' | 'Temples' | 'Forts' | 'Palaces' | 'Ancient Ruins' | 'Museums' | 'Architecture' | 'Archaeology' | 'Local Culture';
}

export interface HeritageOption {
  id: string;
  name: string;
  destinationSlug: string;
  category: string;
  image: string;
  historicalPeriod: string;
  distanceKm: number;
  travelTimeFormatted: string;
  openingHours: string;
  crowdLevel: 'low' | 'moderate' | 'high';
  rating: number;
  entryFeeInr: number;
  guideAvailable: boolean;
  unescoStatus?: string;
  description: string;
  isDemoData: boolean;
}

// ========================================================
// 2. DESTINATION HUBS & AIRPORT/STATION DICTIONARY
// ========================================================

export const DESTINATION_TRANSIT_HUBS: Record<
  string,
  {
    name: string;
    state: string;
    airport: string;
    airportCode: string;
    railStation: string;
    railCode: string;
    busStand: string;
    nearbyBeachesNote: string;
  }
> = {
  tirupati: {
    name: 'Tirupati',
    state: 'Andhra Pradesh',
    airport: 'Tirupati International Airport (Renigunta)',
    airportCode: 'TIR',
    railStation: 'Tirupati Main Junction',
    railCode: 'TPTY',
    busStand: 'Tirupati Central Bus Station (APSRTC)',
    nearbyBeachesNote:
      'Tirupati is situated inland in the sacred Seshachalam hill biosphere. The closest coastal beach is Mypadu Beach near Nellore (115 km away, Bay of Bengal). Alternatively, experience pristine freshwater waterfall lagoons at Talakona.',
  },
  hampi: {
    name: 'Hampi',
    state: 'Karnataka',
    airport: 'Jindal Vidyanagar Airport (VDY) / Hubli (HBX)',
    airportCode: 'VDY',
    railStation: 'Hosapete Junction (Hampi)',
    railCode: 'HPT',
    busStand: 'Hampi Bazaar KSRTC Terminal',
    nearbyBeachesNote:
      'Hampi is located inland in the UNESCO Tungabhadra granite plateau. Unique boulder-flanked river beaches exist at Hippie Island & Sanapur Lake. The nearest ocean coast is Gokarna (310 km).',
  },
  munnar: {
    name: 'Munnar',
    state: 'Kerala',
    airport: 'Cochin International Airport',
    airportCode: 'COK',
    railStation: 'Aluva / Ernakulam Junction',
    railCode: 'AWY',
    busStand: 'Munnar Central KSRTC Depot',
    nearbyBeachesNote:
      'Munnar is an elevated mountain sanctuary at 1,600m in the Western Ghats. Nearest ocean coast is Marari Beach / Fort Kochi (125 km away, Arabian Sea).',
  },
  goa: {
    name: 'Goa',
    state: 'Goa',
    airport: 'Goa Dabolim / Manohar International Mopa',
    airportCode: 'GOI',
    railStation: 'Madgaon Junction / Thivim',
    railCode: 'MAO',
    busStand: 'Panaji KTC Bus Stand',
    nearbyBeachesNote:
      'Goa offers expansive golden Arabian Sea coastlines with secluded gems like Butterfly Beach, Cola Beach, and Galgibaga Turtle Sanctuary.',
  },
  jaipur: {
    name: 'Jaipur',
    state: 'Rajasthan',
    airport: 'Jaipur International Airport (Sanganer)',
    airportCode: 'JAI',
    railStation: 'Jaipur Junction',
    railCode: 'JP',
    busStand: 'Sindhi Camp Central Bus Stand',
    nearbyBeachesNote:
      'Jaipur is surrounded by the Aravalli mountain ranges in Rajasthan. No ocean beaches exist. Secluded lakes like Chandlai Lake and Sambhar Salt Lake offer scenic water vistas.',
  },
  varanasi: {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    airport: 'Lal Bahadur Shastri International Airport',
    airportCode: 'VNS',
    railStation: 'Varanasi Junction / Banaras',
    railCode: 'BSB',
    busStand: 'Varanasi Cantt Roadways Depot',
    nearbyBeachesNote:
      'Varanasi sits along the sacred Ganges river. Riverside sandy banks (Ganga Ghats & Ramnagar sands) provide tranquil dawn vistas.',
  },
};

// ========================================================
// 3. SERVICE FUNCTIONS (API-READY WITH DEMO DATA)
// ========================================================

/**
 * ✈️ FLIGHTS SEARCH SERVICE
 */
export function searchFlights(req: FlightSearchRequest): {
  results: FlightOption[];
  aiRecommendation: string;
} {
  const toClean = req.to.toLowerCase();
  const isTirupati = toClean.includes('tirupati') || toClean.includes('tir');
  const isMunnar = toClean.includes('munnar') || toClean.includes('cok');
  const isHampi = toClean.includes('hampi') || toClean.includes('vdy');

  const destinationLabel = isTirupati ? 'Tirupati (TIR)' : isMunnar ? 'Cochin/Munnar (COK)' : isHampi ? 'Jindal/Hampi (VDY)' : req.to;

  const mockFlights: FlightOption[] = [
    {
      id: 'fl-1',
      airline: 'IndiGo',
      airlineCode: '6E',
      flightNumber: '6E-7124',
      logo: '✈️',
      fromAirport: req.from || 'Bengaluru (BLR)',
      toAirport: destinationLabel,
      departureTime: '07:15 AM',
      arrivalTime: '08:20 AM',
      duration: '1h 05m',
      stops: 'Non-stop',
      priceInr: req.cabinClass === 'Business' ? 9500 : 3850,
      baggage: '15 kg check-in + 7 kg cabin',
      cabinClass: req.cabinClass,
      seatsLeft: 7,
      co2Kg: 58,
      isDemoData: true,
      isBestValue: true,
    },
    {
      id: 'fl-2',
      airline: 'Air India Express',
      airlineCode: 'IX',
      flightNumber: 'IX-492',
      logo: '✈️',
      fromAirport: req.from || 'Hyderabad (HYD)',
      toAirport: destinationLabel,
      departureTime: '11:45 AM',
      arrivalTime: '12:55 PM',
      duration: '1h 10m',
      stops: 'Non-stop',
      priceInr: req.cabinClass === 'Business' ? 8900 : 4200,
      baggage: '15 kg check-in + 7 kg cabin',
      cabinClass: req.cabinClass,
      seatsLeft: 4,
      co2Kg: 62,
      isDemoData: true,
    },
    {
      id: 'fl-3',
      airline: 'Alliance Air (Regional ATR)',
      airlineCode: '9I',
      flightNumber: '9I-882',
      logo: '✈️',
      fromAirport: req.from || 'Chennai (MAA)',
      toAirport: destinationLabel,
      departureTime: '04:10 PM',
      arrivalTime: '05:05 PM',
      duration: '55m',
      stops: 'Non-stop',
      priceInr: req.cabinClass === 'Business' ? 7800 : 3250,
      baggage: '15 kg check-in + 7 kg cabin',
      cabinClass: req.cabinClass,
      seatsLeft: 9,
      co2Kg: 42,
      isDemoData: true,
    },
    {
      id: 'fl-4',
      airline: 'SpiceJet',
      airlineCode: 'SG',
      flightNumber: 'SG-1048',
      logo: '✈️',
      fromAirport: req.from || 'Mumbai (BOM)',
      toAirport: destinationLabel,
      departureTime: '06:30 PM',
      arrivalTime: '08:15 PM',
      duration: '1h 45m',
      stops: 'Non-stop',
      priceInr: req.cabinClass === 'Business' ? 11200 : 5400,
      baggage: '15 kg check-in + 7 kg cabin',
      cabinClass: req.cabinClass,
      seatsLeft: 3,
      co2Kg: 78,
      isDemoData: true,
    },
  ];

  return {
    results: mockFlights,
    aiRecommendation: `🤖 AI Travel Insight: Flight 6E-7124 offers the highest on-time reliability (94%) and arrives early at 08:20 AM, maximizing daylight hours to explore uncrowded sanctuaries before standard afternoon queues form.`,
  };
}

/**
 * 🚆 TRAINS SEARCH SERVICE
 */
export function searchTrains(req: TrainSearchRequest): {
  results: TrainOption[];
  aiRecommendation: string;
} {
  const toClean = req.to.toLowerCase();
  const isTirupati = toClean.includes('tirupati') || toClean.includes('tpty');
  const isHampi = toClean.includes('hampi') || toClean.includes('hpt') || toClean.includes('hosapete');

  const mockTrains: TrainOption[] = [
    {
      id: 'tr-1',
      trainName: isTirupati ? 'Saptagiri Express' : isHampi ? 'Hampi Express' : 'Intercity Superfast Express',
      trainNumber: isTirupati ? '16057' : isHampi ? '16591' : '12678',
      fromStation: req.from || 'KSR Bengaluru (SBC)',
      toStation: isTirupati ? 'Tirupati Main (TPTY)' : isHampi ? 'Hosapete Jn (HPT)' : req.to,
      departureTime: '06:10 AM',
      arrivalTime: '11:35 AM',
      duration: '5h 25m',
      runsOn: 'Daily • M T W T F S S',
      classes: [
        { className: 'CC (Chair Car)', fareInr: 485, availability: 'AVAILABLE - 28 Seats', status: 'AVAILABLE' },
        { className: '2S (Second Seating)', fareInr: 165, availability: 'AVAILABLE - 64 Seats', status: 'AVAILABLE' },
      ],
      pantryAvailable: true,
      isDemoData: true,
      isRecommended: true,
    },
    {
      id: 'tr-2',
      trainName: isTirupati ? 'Tirupati Vande Bharat Express' : isHampi ? 'Vijayapura Express' : 'Shatabdi Express',
      trainNumber: isTirupati ? '20701' : isHampi ? '11304' : '12007',
      fromStation: req.from || 'Secunderabad / Kacheguda',
      toStation: isTirupati ? 'Tirupati Main (TPTY)' : isHampi ? 'Hosapete Jn (HPT)' : req.to,
      departureTime: '06:00 AM',
      arrivalTime: '02:30 PM',
      duration: '8h 30m',
      runsOn: 'Except Tue • M W T F S S',
      classes: [
        { className: 'CC (AC Chair Car)', fareInr: 1680, availability: 'AVAILABLE - 14 Seats', status: 'AVAILABLE' },
        { className: 'EC (Exec Chair Car)', fareInr: 3080, availability: 'AVAILABLE - 4 Seats', status: 'AVAILABLE' },
      ],
      pantryAvailable: true,
      isDemoData: true,
    },
    {
      id: 'tr-3',
      trainName: isTirupati ? 'Rayalaseema Express' : isHampi ? 'Amaravathi Express' : 'Mail Express',
      trainNumber: isTirupati ? '12794' : isHampi ? '17226' : '11014',
      fromStation: req.from || 'Nizamabad / Hyderabad',
      toStation: isTirupati ? 'Tirupati Main (TPTY)' : isHampi ? 'Hosapete Jn (HPT)' : req.to,
      departureTime: '05:30 PM',
      arrivalTime: '06:15 AM (Next Day)',
      duration: '12h 45m',
      runsOn: 'Daily • M T W T F S S',
      classes: [
        { className: '3A (3-Tier AC)', fareInr: 960, availability: 'AVAILABLE - 36 Seats', status: 'AVAILABLE' },
        { className: '2A (2-Tier AC)', fareInr: 1380, availability: 'AVAILABLE - 12 Seats', status: 'AVAILABLE' },
        { className: 'SL (Sleeper)', fareInr: 360, availability: 'RAC 06', status: 'RAC' },
      ],
      pantryAvailable: true,
      isDemoData: true,
    },
  ];

  return {
    results: mockTrains,
    aiRecommendation: `🤖 AI Travel Recommendation: For your journey, train ${mockTrains[0].trainNumber} (${mockTrains[0].trainName}) is recommended. It eliminates night travel, offers confirmed Chair Car seats for ₹${mockTrains[0].classes[0].fareInr}, and leaves maximum budget for hidden gem experiences.`,
  };
}

/**
 * 🚌 BUSES SEARCH SERVICE
 */
export function searchBuses(req: BusSearchRequest): {
  results: BusOption[];
  aiRecommendation: string;
} {
  const toClean = req.to.toLowerCase();
  const isTirupati = toClean.includes('tirupati');

  const mockBuses: BusOption[] = [
    {
      id: 'bus-1',
      operator: isTirupati ? 'APSRTC Garuda Plus (Multi-Axle Scania)' : 'KSRTC Airavat Club Class',
      busType: 'AC Sleeper / Semi-Sleeper (2+1)',
      fromLocation: req.from || 'Bengaluru Shanthinagar / Majestic',
      toLocation: isTirupati ? 'Tirupati Central Bus Station' : req.to,
      departureTime: '07:30 AM',
      arrivalTime: '12:15 PM',
      duration: '4h 45m',
      priceInr: 640,
      rating: 4.8,
      seatsAvailable: 19,
      amenities: ['Live Tracking', 'Water Bottle', 'Charging Point', 'Emergency SOS', 'AC'],
      isGovtBus: true,
      isDemoData: true,
    },
    {
      id: 'bus-2',
      operator: 'IntrCity SmartBus (Electric Green Line)',
      busType: 'AC Luxury Sleeper',
      fromLocation: req.from || 'Chennai CMBT / Koyambedu',
      toLocation: isTirupati ? 'Tirupati Alipiri Stand' : req.to,
      departureTime: '10:00 PM',
      arrivalTime: '02:45 AM',
      duration: '4h 45m',
      priceInr: 890,
      rating: 4.7,
      seatsAvailable: 8,
      amenities: ['Wi-Fi', 'Blanket', 'Reading Light', 'CCTV', 'Snack Pack'],
      isGovtBus: false,
      isDemoData: true,
    },
    {
      id: 'bus-3',
      operator: 'Orange Travels Super Luxury',
      busType: 'Volvo AC Semi-Sleeper (2+2)',
      fromLocation: req.from || 'Hyderabad MGBS',
      toLocation: isTirupati ? 'Tirupati Central Stand' : req.to,
      departureTime: '09:30 PM',
      arrivalTime: '06:45 AM (Next Day)',
      duration: '9h 15m',
      priceInr: 1150,
      rating: 4.6,
      seatsAvailable: 14,
      amenities: ['Emergency Exit', 'Luggage Assistance', 'Pillow', 'AC'],
      isGovtBus: false,
      isDemoData: true,
    },
  ];

  return {
    results: mockBuses,
    aiRecommendation: `🤖 AI Transit Insight: The morning State Transport service (${mockBuses[0].operator}) saves ₹${mockBuses[2].priceInr - mockBuses[0].priceInr} per person compared to private night buses, and drops you directly at the foothills before peak traffic.`,
  };
}

/**
 * 🚗 ROAD TRIPS PLANNER SERVICE
 */
export function planRoadTrip(req: RoadTripRequest): {
  plan: RoadTripPlan;
  aiRecommendation: string;
} {
  const destSlug = req.destination.toLowerCase().includes('hampi')
    ? 'hampi'
    : req.destination.toLowerCase().includes('munnar')
    ? 'munnar'
    : 'tirupati';

  const destObj = DESTINATIONS.find((d) => d.slug === destSlug) || DESTINATIONS[0];

  const plan: RoadTripPlan = {
    id: `rt-${Date.now()}`,
    routeTitle: `${req.startLocation} to ${destObj.name} Scenic Exploration Highway`,
    origin: req.startLocation || 'Bengaluru / Regional Hub',
    destination: destObj.name,
    totalDistanceKm: destSlug === 'munnar' ? 360 : destSlug === 'hampi' ? 340 : 255,
    drivingTimeFormatted: destSlug === 'munnar' ? '7h 15m' : destSlug === 'hampi' ? '6h 30m' : '4h 45m',
    fuelEstimateInr: Math.round((destSlug === 'munnar' ? 360 : 255) * 6.5),
    tollEstimateInr: 320,
    recommendedVehicle: req.people > 4 ? '7-Seater Innova / XUV' : 'Sedan / Compact SUV (Petrol/EV)',
    highwayNames: ['NH-716 Expressway', 'Eastern Ghats Foothill Bypass', 'State Highway 61'],
    foodStops: [
      { name: 'Woody’s Highway Heritage Diner', specialty: 'Ghee Podi Thatte Idli & Filter Coffee', kmMarker: 65 },
      { name: 'Nandi Valley Farm Kitchen', specialty: 'Clay-Pot Andhra Banana Leaf Meals', kmMarker: 140 },
    ],
    restStops: [
      { name: 'Highway Oasis Clean Restroom Plaza', facilities: 'Clean Restrooms, EV Fast Charger, First Aid', kmMarker: 110 },
      { name: 'Valley Fuel & Refreshment Point', facilities: 'Fuel, ATM, Tyre Pressure, Café', kmMarker: 195 },
    ],
    viewpoints: [
      { name: 'Seshachalam Dawn Escarpment', highlight: 'Golden hour vista overlooking misty Eastern Ghats ridges', kmMarker: 215 },
    ],
    hiddenGemsAlongRoute: destObj.hiddenGems.slice(0, 3),
    interactiveWaypoints: [
      { lat: 13.0827, lng: 80.2707, title: 'Starting Point' },
      { lat: 13.4, lng: 79.3, title: 'Scenic Foothills Pass' },
      { lat: destObj.coordinates.lat, lng: destObj.coordinates.lng, title: `${destObj.name} Hub` },
    ],
    totalTripTransitCostInr: Math.round((destSlug === 'munnar' ? 360 : 255) * 6.5) + 320,
    isDemoData: true,
  };

  return {
    plan,
    aiRecommendation: `🤖 AI Road Trip Optimizer: Taking the NH-716 Scenic Foothill route bypasses 2 heavy toll bottlenecks and brings you within 20 minutes of ${destObj.hiddenGems[0]?.name || 'Talakona Waterfall'}, allowing you to explore the uncrowded cascade before even checking into your hotel.`,
  };
}

/**
 * 🏨 HOTELS SEARCH SERVICE
 */
export function searchHotels(req: HotelSearchRequest): {
  results: HotelOption[];
  aiRecommendation: string;
} {
  const destSlug = req.destination.toLowerCase().includes('hampi')
    ? 'hampi'
    : req.destination.toLowerCase().includes('munnar')
    ? 'munnar'
    : 'tirupati';

  const mockHotels: HotelOption[] = [
    {
      id: 'ht-1',
      name: destSlug === 'tirupati' ? 'Seshachalam Foothills Eco Retreat' : destSlug === 'hampi' ? 'Heritage Boulders Courtyard Resort' : 'Munnar Shola Mist Tea Valley Resort',
      destinationSlug: destSlug,
      type: 'Resort',
      rating: 4.8,
      reviewCount: 312,
      distanceFromAttractionKm: 4.2,
      roomType: 'Deluxe Forest View Cottage',
      pricePerNightInr: 2850,
      amenities: ['Free Wi-Fi', 'Complimentary Pure Veg Breakfast', 'Swimming Pool', 'EV Charging', 'Ayurvedic Spa'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      freeCancellation: true,
      breakfastIncluded: true,
      isDemoData: true,
      isAiRecommended: true,
    },
    {
      id: 'ht-2',
      name: destSlug === 'tirupati' ? 'Grand Balaji Pilgrims Haven' : destSlug === 'hampi' ? 'Vijayanagara Riverside Hotel' : 'Silver Clouds Valley Hotel',
      destinationSlug: destSlug,
      type: 'Hotel',
      rating: 4.6,
      reviewCount: 480,
      distanceFromAttractionKm: 2.1,
      roomType: 'Superior King Suite',
      pricePerNightInr: 2100,
      amenities: ['Air Conditioning', 'Free Parking', 'Room Service', 'Temple Shuttle', 'Family Rooms'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      freeCancellation: true,
      breakfastIncluded: false,
      isDemoData: true,
    },
    {
      id: 'ht-3',
      name: destSlug === 'tirupati' ? 'Alipiri Heritage Budget Inn' : destSlug === 'hampi' ? 'Anegundi Rock Garden Stay' : 'Highland Green Backpacker Inn',
      destinationSlug: destSlug,
      type: 'Budget',
      rating: 4.4,
      reviewCount: 195,
      distanceFromAttractionKm: 1.5,
      roomType: 'Standard Air-Cooled Room',
      pricePerNightInr: 950,
      amenities: ['Free Wi-Fi', '24/7 Hot Water', 'Luggage Storage', 'Power Backup'],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      freeCancellation: false,
      breakfastIncluded: false,
      isDemoData: true,
    },
  ];

  return {
    results: mockHotels,
    aiRecommendation: `🤖 AI Budget & Proximity Match: '${mockHotels[0].name}' keeps your family within 15 minutes of uncrowded nature trails and includes complimentary breakfast, preserving ₹${req.budgetMax - mockHotels[0].pricePerNightInr * 2} of your planned trip allowance.`,
  };
}

/**
 * 🏡 HOMESTAYS SEARCH SERVICE
 */
export function searchHomestays(req: HomestaySearchRequest): {
  results: HomestayOption[];
  aiRecommendation: string;
} {
  const destSlug = req.destination.toLowerCase().includes('hampi')
    ? 'hampi'
    : req.destination.toLowerCase().includes('munnar')
    ? 'munnar'
    : 'tirupati';

  const mockHomestays: HomestayOption[] = [
    {
      id: 'home-1',
      name: destSlug === 'tirupati' ? 'Venkata Nivasam Heritage Farm Homestay' : destSlug === 'hampi' ? 'Shanthi Banana Grove Heritage Homestay' : 'Rose Gardens Spice Plantation Homestay',
      hostName: 'Subba Rao & Family',
      destinationSlug: destSlug,
      propertyType: 'Organic Farmstead',
      rating: 4.9,
      reviewCount: 142,
      location: destSlug === 'tirupati' ? 'Chandragiri Valley, Tirupati' : 'Anegundi Village, Hampi',
      distanceKm: 8.5,
      pricePerNightInr: 1650,
      amenities: ['Authentic Home-Cooked Meals', 'Organic Mango Orchard Stroll', 'Kitchen Access', 'High-Speed Wi-Fi', 'Elder-Friendly Ground Floor'],
      image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
      localExperience: 'Enjoy hot Rayalaseema ragi sangati and fresh cow milk ghee prepared right in the traditional wood-fired family kitchen.',
      aiWhyRecommended: '100% genuine local host hospitality with zero commercial hotel markups, located midway between Chandragiri fort and Talakona waterfall.',
      isDemoData: true,
    },
    {
      id: 'home-2',
      name: destSlug === 'tirupati' ? 'Ananda Nilayam Courtyard Cottage' : 'Tungabhadra Heritage Stone Homestay',
      hostName: 'Lakshmi Narayana',
      destinationSlug: destSlug,
      propertyType: 'Heritage Courtyard',
      rating: 4.7,
      reviewCount: 98,
      location: 'Srinivasa Mangapuram Outskirts',
      distanceKm: 6.2,
      pricePerNightInr: 1400,
      amenities: ['Verandah Garden', 'Pure Veg Kitchen', 'Bicycle Rentals', 'Quiet Countryside Environment'],
      image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      localExperience: 'Wake up to the devotional chants echoing across mango orchards and watch peacocks in the backyard.',
      aiWhyRecommended: 'Provides peaceful isolation from high-decibel pilgrim transit hubs while ensuring immediate road access to uncrowded sanctums.',
      isDemoData: true,
    },
  ];

  return {
    results: mockHomestays,
    aiRecommendation: `🤖 AI Host Selection: '${mockHomestays[0].name}' rated 4.9/5 by 142 verified travellers. Features farm-fresh breakfast and costs 45% less than commercial resorts.`,
  };
}

/**
 * 🧭 LOCAL GUIDES SEARCH SERVICE
 */
export function searchGuides(req: GuideSearchRequest): {
  results: GuideOption[];
  aiRecommendation: string;
} {
  const destSlug = req.destination.toLowerCase().includes('hampi')
    ? 'hampi'
    : req.destination.toLowerCase().includes('munnar')
    ? 'munnar'
    : 'tirupati';

  const mockGuides: GuideOption[] = [
    {
      id: 'g-ravi',
      name: 'Ravi Kumar',
      destinationSlug: 'tirupati',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      verified: true,
      languages: ['English', 'Telugu', 'Hindi', 'Tamil'],
      experienceYears: 12,
      specialization: 'Heritage, History, Seshachalam Flora & Ancient Dravidian Inscriptions',
      rating: 4.9,
      reviewCount: 168,
      priceInr: req.duration === '2 hours' ? 800 : req.duration === 'Half Day (4 hrs)' ? 1200 : 2200,
      duration: req.duration,
      availability: 'Available (Certified AP Tourism Guide)',
      phone: '+91 94401 23456',
      isDemoData: true,
    },
    {
      id: 'g-kavitha',
      name: 'Dr. Kavitha Reddy',
      destinationSlug: 'tirupati',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      verified: true,
      languages: ['English', 'Telugu', 'Kannada'],
      experienceYears: 8,
      specialization: 'Silathoranam Prehistoric Geology & Chandragiri Archaeology',
      rating: 4.8,
      reviewCount: 94,
      priceInr: req.duration === '2 hours' ? 950 : 1500,
      duration: req.duration,
      availability: 'Available Today',
      phone: '+91 98480 98765',
      isDemoData: true,
    },
    {
      id: 'g-manjunath',
      name: 'Manjunath Gowda',
      destinationSlug: 'hampi',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      verified: true,
      languages: ['English', 'Kannada', 'Hindi', 'Telugu'],
      experienceYears: 14,
      specialization: 'Vijayanagara Empire Architecture & Tungabhadra Bouldering Routes',
      rating: 4.9,
      reviewCount: 220,
      priceInr: req.duration === '2 hours' ? 900 : 1600,
      duration: req.duration,
      availability: 'Available (UNESCO Certified Guide)',
      isDemoData: true,
    },
  ];

  const filtered = mockGuides.filter(
    (g) => g.destinationSlug === destSlug || destSlug === 'tirupati'
  );

  return {
    results: filtered,
    aiRecommendation: `🤖 AI Guide Match: Ravi Kumar speaks your preferred language (Telugu/English), holds an official AP Tourism certification, and specializes in explaining hidden boulder carvings and zero-crowd viewpoints.`,
  };
}

/**
 * 🥾 TREKKING SEARCH SERVICE
 */
export function searchTreks(req: TrekSearchRequest, isWeatherRainy: boolean = false): {
  results: TrekOption[];
  aiRecommendation: string;
} {
  const destSlug = req.destination.toLowerCase().includes('hampi')
    ? 'hampi'
    : req.destination.toLowerCase().includes('munnar')
    ? 'munnar'
    : 'tirupati';

  const mockTreks: TrekOption[] = [
    {
      id: 'trek-1',
      trekName: destSlug === 'tirupati' ? 'Talakona Deep Forest Canopy Trek' : destSlug === 'hampi' ? 'Matanga Hill Sunrise Ridge Trail' : 'Meesapulimala Cloud Valley Trek',
      location: destSlug === 'tirupati' ? 'Seshachalam Biosphere Reserve' : 'Hampi Heritage Perimeter',
      destinationSlug: destSlug,
      difficulty: 'Moderate',
      distanceKm: 4.8,
      durationHours: 3.5,
      elevationGainM: 280,
      bestTime: '06:30 AM – 10:30 AM (Cool morning shade)',
      weatherCondition: isWeatherRainy ? '🌧️ Heavy Rain Alert (Slippery Granite)' : '☀️ Clear & Breezy',
      crowdLevel: 'low',
      safetyStatus: isWeatherRainy ? '🚫 Caution: Wet boulders / Landslip risk' : '✓ Safe & Clear',
      isSafeToday: !isWeatherRainy,
      safetyReason: isWeatherRainy ? 'Conditions not recommended today due to heavy precipitation on steep waterfall steps' : undefined,
      guideRequired: false,
      estimatedCostInr: 150,
      image: getAssetPath('/images/destinations/tirupati_talakona_waterfall.jpg'),
      highlights: ['Suspended canopy skywalk', 'Perennial plunge pool', 'Medicinal forest flora'],
      isDemoData: true,
    },
    {
      id: 'trek-2',
      trekName: destSlug === 'tirupati' ? 'Silathoranam Geotrail & Geological Arch' : 'Anjaneya Hill Boulder Stairway',
      location: 'Tirumala Ridge Forest',
      destinationSlug: destSlug,
      difficulty: 'Easy',
      distanceKm: 2.2,
      durationHours: 1.5,
      elevationGainM: 80,
      bestTime: 'Early Morning or Twilight',
      weatherCondition: isWeatherRainy ? '🌧️ Intermittent Drizzle' : '☀️ Pleasant',
      crowdLevel: 'low',
      safetyStatus: '✓ Safe & Well-Paved Steps',
      isSafeToday: true,
      guideRequired: false,
      estimatedCostInr: 50,
      image: getAssetPath('/images/destinations/tirupati_seshachalam_hills.jpg'),
      highlights: ['Prehistoric 2.5-billion-year-old rock arch', 'Paved family-friendly trail', 'Bird watching'],
      isDemoData: true,
    },
  ];

  return {
    results: mockTreks,
    aiRecommendation: isWeatherRainy
      ? `⚠️ AI Weather Alert: Due to heavy rain forecast, the steep '${mockTreks[0].trekName}' is not recommended today for safety. We recommend the paved, gentle '${mockTreks[1].trekName}' or covered indoor cultural heritage sites.`
      : `🤖 AI Trail Recommendation: '${mockTreks[0].trekName}' offers the most pristine nature immersion with low crowd density, crystal-clear mountain pools, and safe morning weather conditions.`,
  };
}

/**
 * 🏖️ BEACHES SEARCH SERVICE
 */
export function searchBeaches(req: BeachSearchRequest): {
  results: BeachOption[];
  inlandDisclaimer?: string;
  aiRecommendation: string;
} {
  const destSlug = req.destination.toLowerCase().includes('goa') ? 'goa' : 'tirupati';

  if (destSlug === 'goa') {
    const goaBeaches: BeachOption[] = [
      {
        id: 'b-1',
        beachName: 'Butterfly Beach (Secret Cove)',
        nearestCity: 'Palolem, South Goa',
        destinationSlug: 'goa',
        distanceKm: 34,
        travelTimeFormatted: '55m',
        crowdLevel: 'low',
        weather: '☀️ 29°C Sunny',
        activities: ['Dolphin Watching', 'Kayaking', 'Sunset Photography'],
        safety: 'Lifeguard Monitored, Gentle Surf',
        bestTime: '04:00 PM – 06:45 PM',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        isOceanBeach: true,
        isDemoData: true,
      },
      {
        id: 'b-2',
        beachName: 'Galgibaga Olive Ridley Turtle Sanctuary Beach',
        nearestCity: 'Canacona, South Goa',
        destinationSlug: 'goa',
        distanceKm: 42,
        travelTimeFormatted: '1h 10m',
        crowdLevel: 'low',
        weather: '☀️ 29°C Clear Coast',
        activities: ['Quiet Walks', 'Turtle Conservation Insights', 'Pine Forest Picnics'],
        safety: 'Pristine, Protected Bio-Zone',
        bestTime: 'Early Morning / Sunset',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
        isOceanBeach: true,
        isDemoData: true,
      },
    ];

    return {
      results: goaBeaches,
      aiRecommendation: `🤖 AI Coastal Discovery: Butterfly Beach is accessible only by boat or forest trek, ensuring 80% fewer tourists than Baga or Calangute while boasting crystalline waters.`,
    };
  }

  // Tirupati / Inland Destinations Logic
  const nearbyInlandWaterOptions: BeachOption[] = [
    {
      id: 'b-mypadu',
      beachName: 'Mypadu Beach (Bay of Bengal)',
      nearestCity: 'Nellore Coastal District',
      destinationSlug: 'tirupati',
      distanceKm: 115,
      travelTimeFormatted: '2h 20m via NH-71',
      crowdLevel: 'low',
      weather: '☀️ 30°C Coastal Breeze',
      activities: ['Golden Sand Strolls', 'Fresh Seacoast Cuisine', 'Sea Shell Collecting'],
      safety: 'Lifeguards on duty during daylight hours',
      bestTime: '04:00 PM – 06:30 PM',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      isOceanBeach: true,
      inlandNote: 'Closest ocean beach to Tirupati (115 km east)',
      isDemoData: true,
    },
    {
      id: 'b-kalyani',
      beachName: 'Kalyani Dam Reservoir Freshwater Shore',
      nearestCity: 'Rangampeta, Tirupati',
      destinationSlug: 'tirupati',
      distanceKm: 18,
      travelTimeFormatted: '28 minutes',
      crowdLevel: 'low',
      weather: '🌿 26°C Forest Breeze',
      activities: ['Waterside Birdwatching', 'Scenic Sunset Vistas', 'Nature Photography'],
      safety: 'Calm freshwater banks, scenic boundary',
      bestTime: '04:30 PM – 06:15 PM',
      rating: 4.6,
      image: getAssetPath('/images/destinations/tirupati_seshachalam_hills.jpg'),
      isOceanBeach: false,
      inlandNote: 'Local freshwater sanctuary inside Seshachalam foothills',
      isDemoData: true,
    },
  ];

  return {
    results: nearbyInlandWaterOptions,
    inlandDisclaimer: `📍 Destination Geographical Note: Tirupati is situated inland among the sacred Seshachalam hills. The closest true sea beach is Mypadu Beach (115 km away on the Bay of Bengal). For instant waterside tranquility nearby, we have also included the serene Kalyani Dam freshwater shores (only 18 km away).`,
    aiRecommendation: `🤖 AI Waterside Insight: For a 2-day Tirupati trip, visiting Kalyani Dam reservoir shores gives you waterside peace without spending 5 hours travelling to the coast.`,
  };
}

/**
 * 🏛️ HERITAGE DISCOVERY SERVICE
 */
export function searchHeritage(req: HeritageSearchRequest): {
  results: HeritageOption[];
  aiRecommendation: string;
} {
  const destSlug = req.destination.toLowerCase().includes('hampi')
    ? 'hampi'
    : req.destination.toLowerCase().includes('munnar')
    ? 'munnar'
    : 'tirupati';

  const mockHeritage: HeritageOption[] = [
    {
      id: 'her-1',
      name: destSlug === 'tirupati' ? 'Chandragiri 11th-Century Vijayanagara Fort & Raja Mahal' : destSlug === 'hampi' ? 'Vittala Temple Complex & Stone Chariot' : 'Marayoor Prehistoric Dolmens & Sandalwood Heritage',
      destinationSlug: destSlug,
      category: destSlug === 'tirupati' ? 'Forts' : 'Ancient Ruins',
      image: destSlug === 'tirupati' ? 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1600100397608-f010e42e47e8?auto=format&fit=crop&w=800&q=80',
      historicalPeriod: destSlug === 'tirupati' ? '11th Century CE (Yadava Rayas & Vijayanagara Empire)' : '15th Century CE (King Devaraya II)',
      distanceKm: destSlug === 'tirupati' ? 14 : 3.5,
      travelTimeFormatted: destSlug === 'tirupati' ? '22 minutes' : '8 minutes',
      openingHours: '08:00 AM – 06:00 PM',
      crowdLevel: 'low',
      rating: 4.7,
      entryFeeInr: 45,
      guideAvailable: true,
      unescoStatus: destSlug === 'hampi' ? 'UNESCO World Heritage Monument' : 'Protected Archaeological Monument of India',
      description: destSlug === 'tirupati'
        ? 'Imposing granite citadel built on a 183-meter high monolithic rock. The Raja Mahal palace was constructed without timber using only stone, brick, and lime mortar.'
        : 'Iconic monolithic stone shrine carved in the form of a celestial chariot with rotating granite wheels.',
      isDemoData: true,
    },
    {
      id: 'her-2',
      name: destSlug === 'tirupati' ? 'Silathoranam Prehistoric Natural Rock Arch' : 'Achyutaraya Temple & Courtesans Street',
      destinationSlug: destSlug,
      category: destSlug === 'tirupati' ? 'Archaeology' : 'Temples',
      image: destSlug === 'tirupati' ? getAssetPath('/images/destinations/tirupati_seshachalam_hills.jpg') : 'https://images.unsplash.com/photo-1599818816829-9e8c47494a86?auto=format&fit=crop&w=800&q=80',
      historicalPeriod: 'Prehistoric Precambrian Era (2.5 Billion Years Old)',
      distanceKm: 1.8,
      travelTimeFormatted: '10 minutes',
      openingHours: '06:00 AM – 06:30 PM',
      crowdLevel: 'low',
      rating: 4.8,
      entryFeeInr: 0,
      guideAvailable: true,
      unescoStatus: 'National Geological Monument of India',
      description: 'One of only three naturally formed geological arches in the world, with unique spiritual and scientific significance.',
      isDemoData: true,
    },
  ];

  return {
    results: mockHeritage,
    aiRecommendation: `🤖 AI Heritage Discovery: '${mockHeritage[0].name}' is only 22 minutes from town, has 75% fewer visitors than main temple queue zones, and preserves genuine 11th-century Vijayanagara royal architecture.`,
  };
}
