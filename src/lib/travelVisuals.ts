/**
 * CENTRALIZED GLOBAL CONTEXT-AWARE TRAVEL VISUALS SYSTEM
 * 
 * INDIA-FIRST TOURISM VISUAL IDENTITY
 * High-Resolution (2K / 4K) curated royalty-free travel photography (Unsplash)
 * Authentically capturing:
 * - Indian Railways (Nilgiri mountain train, Vande Bharat, Konkan rail bridges, Western Ghats tracks)
 * - Indian Road Trips (Western Ghats ghat roads, Kerala tea-estate highways, Tamil Nadu mountain roads)
 * - Indian Tourist Buses (Scenic valley travel coaches)
 * - Indian Destinations (Tirupati Seshachalam hills & temples, Hampi UNESCO ruins, Munnar tea hills)
 * - Authentic Regional Cuisine (Andhra banana-leaf thali, Dosa, Tirupati Laddu, Kerala Sadya, Pesarattu)
 * - Indian Travelers (Families, Groups of Friends, Couples, Solo Backpackers, Seniors)
 * - Indian Heritage & Nature (Dravidian Gopurams, Ancient Citadels, Prehistoric Rock Arches, Cascades)
 */

import { getAssetPath } from '@/lib/utils';

export type TravelCountryMode = 'Domestic' | 'International';

export interface TravelImageQuery {
  country?: string;
  state?: string;
  destination?: string;
  category?: string;
  transport?: 'Train' | 'Car' | 'Cab' | 'Bus' | 'Flight' | string;
  travellerType?: 'Solo' | 'Friends' | 'Family' | 'Couple' | 'Seniors' | 'Children' | string;
  companionType?: 'Solo' | 'Friends' | 'Family' | 'Couple' | 'Seniors' | 'Children' | string;
  interest?: string;
  activity?: string;
  accommodation?: 'Hotel' | 'Resort' | 'Villa' | 'Homestay' | string;
  mood?: 'peaceful' | 'adventure' | 'luxury' | 'romantic' | 'fun' | 'spiritual' | string;
}

export type TravelVisualCriteria = TravelImageQuery;

export const INDIAN_TRAVEL_VISUALS = {
  // 1. Authentic Indian Transport Photography
  transport: {
    Train: [
      // Nilgiri mountain railway passing through lush green Western Ghats
      'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=2560&q=85',
      // Mountain passenger train in morning mist (Himalayan / South Indian foothills)
      'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=2560&q=85',
      // Scenic Indian rail journey through countryside & bridges
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=2560&q=85',
      // Golden hour rail tracks through South Indian palm groves
      'https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&w=2560&q=85',
    ],
    Car: [
      // Scenic winding Western Ghats ghat road through lush mountains
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
      // Kerala tea-estate mountain highway road trip
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2560&q=85',
      // Scenic Indian highway with open sky and mountain background
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=2560&q=85',
      // Open road expedition through scenic Indian terrain
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2560&q=85',
    ],
    Cab: [
      // Scenic road transit through South Indian hill stations
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
      'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=2560&q=85',
    ],
    Bus: [
      // Indian travel coach navigating green mountain valleys
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2560&q=85',
      // Scenic tourist bus on highway journey
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2560&q=85',
    ],
    Flight: [
      // Aerial view over Indian mountain ranges and golden clouds
      'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=2560&q=85',
      // Airplane wing over coastline
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2560&q=85',
    ],
  },

  // 2. Indian Accommodation & Stays
  accommodation: {
    Hotel: [
      // South Indian heritage courtyard hotel
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80',
    ],
    Resort: [
      // Western Ghats tea-valley eco resort overlooking mist
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=80',
    ],
    Villa: [
      // Traditional stone heritage villa in Karnataka/Andhra
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80',
    ],
    Homestay: [
      // Authentic Kerala plantation wooden cottage homestay
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2000&q=80',
    ],
  },

  // 3. Indian Nature & Landforms
  nature: {
    waterfall: [
      // Talakona waterfall cascade nestled in Seshachalam biosphere
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2000&q=80',
      // Chinnakanal forest waterfall pool in Munnar
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2000&q=80',
      // Western Ghats hidden stream cascade
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=2000&q=80',
    ],
    mountain: [
      // Kolukkumalai & Western Ghats sunrise peaks above clouds
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
      // Seshachalam hill ridge in Eastern Ghats
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
      // Starry sky over Indian hills
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80',
    ],
    forest: [
      // Shola evergreen reserve forest in Kerala
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80',
      // Seshachalam red sanders natural forest canopy
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80',
    ],
    beach: [
      // Serene South Indian coastal beach with coconut trees
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
      // Coastal cliffs and golden sunset in Goa / Malabar
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2000&q=80',
    ],
    lake: [
      // Sanapur Lake boulders and coracle waters in Hampi
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80',
    ],
  },

  // 4. Indian Culture, Temples & Heritage
  culture: {
    temple: [
      // Majestic Dravidian temple gopuram towers at sunrise
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2560&q=85',
      // Prehistoric natural stone arch (Silathoranam) holy sanctum
      'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=2000&q=80',
      // Sacred temple corridor with sculpted granite pillars
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80',
    ],
    heritage: [
      // UNESCO World Heritage Hampi Vijayanagara stone chariot and ruins
      getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
      // Monolithic stone pillars of royal enclosure
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=80',
    ],
    history: [
      // 11th-century Chandragiri stone fortress & palace near Tirupati
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=80',
    ],
  },

  // 5. Authentic Regional Indian Food
  food: {
    localFood: [
      // Authentic South Indian feast served on fresh green banana leaf
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=2000&q=80',
      // Crispy golden Masala Dosa with coconut and tomato chutneys
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=2000&q=80',
      // Tirupati Laddu & traditional Indian festive confections
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=2000&q=80',
      // South Indian morning breakfast with piping hot filter coffee
      'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=2000&q=80',
    ],
    restaurant: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80',
    ],
  },

  // 6. Indian Travelers (Realistic & Natural)
  people: {
    friends: [
      // Group of Indian friends laughing atop scenic mountain summit
      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=2000&q=80',
      // Friends on road trip with open windows and scenic views
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=80',
    ],
    family: [
      // Multi-generation Indian family walking in nature meadow
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=2000&q=80',
      // Family exploring nature park together
      'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=2000&q=80',
    ],
    couple: [
      // Couple watching golden sunrise over Western Ghats viewpoint
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=2000&q=80',
    ],
    solo: [
      // Solo backpacker with trekking gear overlooking valley
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
    ],
    seniors: [
      // Senior travellers relaxing in peaceful heritage garden
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=2000&q=80',
    ],
    children: [
      // Children exploring gentle stream in nature
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=2000&q=80',
    ],
  },

  // 7. Destination Specific Collections
  destinations: {
    tirupati: {
      hero: getAssetPath('/images/destinations/tirupati_tirumala_hero.jpg'),
      mainAttraction: getAssetPath('/images/destinations/tirupati_tirumala_hero.jpg'),
      nature: getAssetPath('/images/destinations/tirupati_talakona_waterfall.jpg'), // Talakona waterfall
      waterfall: getAssetPath('/images/destinations/tirupati_talakona_waterfall.jpg'),
      history: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=80', // Chandragiri fort
      spirituality: getAssetPath('/images/destinations/tirupati_tirumala_hero.jpg'),
      food: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1600&q=80', // Tirupati laddu & Andhra feast
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
      // Authentic South Indian rail journey through Eastern Ghats
      transportTrain: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=2560&q=85',
      // Scenic Andhra hill road trip
      transportCar: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
      sunset: getAssetPath('/images/destinations/tirupati_seshachalam_hills.jpg'),
    },
    hampi: {
      hero: getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
      mainAttraction: getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
      nature: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80',
      adventure: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=2000&q=80', // Sanapur bouldering
      history: getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
      food: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1600&q=80', // South Indian breakfast & thali
      hotel: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1600&q=80',
      // Indian train along Tungabhadra corridor
      transportTrain: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=2560&q=85',
      // Karnataka heritage highway
      transportCar: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=2560&q=85',
      sunset: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80',
    },
    munnar: {
      hero: getAssetPath('/images/destinations/munnar_tea_hills.jpg'),
      mainAttraction: getAssetPath('/images/destinations/munnar_tea_hills.jpg'),
      mountains: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
      waterfall: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2000&q=80',
      nature: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2000&q=80',
      adventure: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=80',
      food: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1600&q=80', // Kerala sadya on banana leaf
      hotel: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1600&q=80', // Tea plantation cottage
      // Nilgiri / Munnar mountain rail passing through tea valleys
      transportTrain: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=2560&q=85',
      // Ghat road drive through tea gardens
      transportCar: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
      sunset: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
    },
  },

  // 8. Activities
  activities: {
    adventure: [
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=80',
    ],
    trekking: [
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=2000&q=80',
    ],
    photography: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=2000&q=80',
    ],
    sightseeing: [
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=2000&q=80',
    ],
  },

  // 9. Standard Category Mappings
  categories: {
    Waterfalls: [getAssetPath('/images/destinations/tirupati_talakona_waterfall.jpg')],
    Mountains: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80'],
    Nature: ['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80'],
    History: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=80'],
    Heritage: [getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg')],
    Spirituality: [getAssetPath('/images/destinations/tirupati_tirumala_hero.jpg')],
    Divine: ['https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=2000&q=80'],
    Adventure: ['https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=2000&q=80'],
    Photography: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80'],
    Food: ['https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=2000&q=80'],
    Beaches: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80'],
    Shopping: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=2000&q=80'],
  },

  // 10. Day-by-Day Visual Itinerary
  itinerary: {
    Arrival: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=1200&q=80',
    Dining: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    Photography: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    Stay: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    Waterfalls: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    Mountains: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    Heritage: getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
    Spirituality: getAssetPath('/images/destinations/tirupati_tirumala_hero.jpg'),
    Adventure: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80',
    Return: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80',
  },

  // 11. Panoramic Master Composition (Indian Western Ghats & Heritage)
  panoramicMaster: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2560&q=85',
  welcomeHero: getAssetPath('/images/destinations/tirupati_tirumala_hero.jpg'),
};

export const TRAVEL_VISUALS = INDIAN_TRAVEL_VISUALS;

/**
 * Intelligent Image Search System
 * Supports Domestic (India) and International modes.
 * Evaluates country, state, destination, category, transport, travellerType, activity.
 */
import {
  DESTINATION_MEDIA,
  DESTINATION_VISUALS,
  getDestinationVisual,
  getDestinationMedia,
  getDestinationBackgrounds,
  validateDestinationImage,
} from './destinationVisuals';
export {
  DESTINATION_MEDIA,
  DESTINATION_VISUALS,
  getDestinationVisual,
  getDestinationMedia,
  getDestinationBackgrounds,
  validateDestinationImage,
};

/**
 * Intelligent Image Search System
 * Supports Domestic (India) and International modes.
 * Evaluates country, state, destination, category, transport, travellerType, activity.
 */
export function getTravelImage(query: TravelImageQuery): string {
  const destSlug = (query.destination || '').toLowerCase().trim();

  // 1. Destination Specific Match (Absolute Highest Priority)
  // When a destination is chosen, the image MUST represent that destination's real visual identity
  if (destSlug && DESTINATION_VISUALS[destSlug]) {
    return getDestinationVisual({
      destination: destSlug,
      state: query.state,
      category: query.category || query.interest,
      activity: query.activity,
      transport: query.transport,
      travellerType: query.travellerType || query.companionType,
    });
  }

  const transportKey = query.transport || '';
  const categoryKey = (query.category || query.interest || '').toLowerCase();
  const companionKey = (query.travellerType || query.companionType || '').toLowerCase();
  const accommodationKey = query.accommodation || '';

  // 2. Transport Priority (Authentic Indian Transport)
  if (transportKey && INDIAN_TRAVEL_VISUALS.transport[transportKey as keyof typeof INDIAN_TRAVEL_VISUALS.transport]) {
    const list = INDIAN_TRAVEL_VISUALS.transport[transportKey as keyof typeof INDIAN_TRAVEL_VISUALS.transport];
    return list[0];
  }

  // 3. Category Priority
  if (categoryKey.includes('waterfall')) return INDIAN_TRAVEL_VISUALS.nature.waterfall[0];
  if (categoryKey.includes('mountain')) return INDIAN_TRAVEL_VISUALS.nature.mountain[0];
  if (categoryKey.includes('beach')) return INDIAN_TRAVEL_VISUALS.nature.beach[0];
  if (categoryKey.includes('forest') || categoryKey.includes('nature')) return INDIAN_TRAVEL_VISUALS.nature.forest[0];
  if (categoryKey.includes('temple') || categoryKey.includes('spirit') || categoryKey.includes('divine')) return INDIAN_TRAVEL_VISUALS.culture.temple[0];
  if (categoryKey.includes('history')) return INDIAN_TRAVEL_VISUALS.culture.history[0];
  if (categoryKey.includes('heritage')) return INDIAN_TRAVEL_VISUALS.culture.heritage[0];
  if (categoryKey.includes('food')) return INDIAN_TRAVEL_VISUALS.food.localFood[0];

  // 4. Companion Priority
  if (companionKey && INDIAN_TRAVEL_VISUALS.people[companionKey as keyof typeof INDIAN_TRAVEL_VISUALS.people]) {
    const list = INDIAN_TRAVEL_VISUALS.people[companionKey as keyof typeof INDIAN_TRAVEL_VISUALS.people];
    return list[0];
  }

  // 5. Accommodation Priority
  if (accommodationKey && INDIAN_TRAVEL_VISUALS.accommodation[accommodationKey as keyof typeof INDIAN_TRAVEL_VISUALS.accommodation]) {
    const list = INDIAN_TRAVEL_VISUALS.accommodation[accommodationKey as keyof typeof INDIAN_TRAVEL_VISUALS.accommodation];
    return list[0];
  }

  // Fallback: Tirumala / Tirupati authentic landmark
  return DESTINATION_VISUALS.tirupati.hero;
}

export function getContextualTravelImage(criteria: TravelVisualCriteria): string {
  return getTravelImage(criteria);
}

export function getTransportVisual(transport: string): string {
  const tKey = transport as keyof typeof INDIAN_TRAVEL_VISUALS.transport;
  const list = INDIAN_TRAVEL_VISUALS.transport[tKey] || INDIAN_TRAVEL_VISUALS.transport.Train;
  return list[0];
}

export function getAccommodationVisual(type: string): string {
  const aKey = type as keyof typeof INDIAN_TRAVEL_VISUALS.accommodation;
  const list = INDIAN_TRAVEL_VISUALS.accommodation[aKey] || INDIAN_TRAVEL_VISUALS.accommodation.Hotel;
  return list[0];
}

export function getCompanionVisual(companion: string): string {
  const cKey = companion.toLowerCase() as keyof typeof INDIAN_TRAVEL_VISUALS.people;
  const list = INDIAN_TRAVEL_VISUALS.people[cKey] || INDIAN_TRAVEL_VISUALS.people.friends;
  return list[0];
}
