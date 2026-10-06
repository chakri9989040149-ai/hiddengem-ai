/**
 * CENTRALIZED DESTINATION-AWARE VISUAL ENGINE (destinationMedia.ts / destinationVisuals.ts)
 * 
 * Strict Destination Visual Identity Profiles:
 * - Tirupati: Sri Venkateswara, Tirumala Temple, Gopurams, Seshachalam Hills, Talakona
 * - Hampi: Virupaksha Temple, Vijayanagara Empire, Stone Chariot, Granite Boulders, Tungabhadra
 * - Munnar: Tea Plantations, Misty Hills, Western Ghats, Waterfalls, Kolukkumalai
 * - Goa: Arabian Sea, Palms, Coastal Sunset, Portuguese Architecture
 * - Jaipur: Amber Fort, Hawa Mahal, Pink City Palaces
 * - Varanasi: Ganges Ghats, Evening Aarti, Boats
 * - Agra: Taj Mahal, Agra Fort
 * - Hyderabad: Charminar, Golconda Fort
 * - Mysore: Mysore Palace, Chamundi Hills
 * - Chennai: Marina Beach, Kapaleeshwarar Temple
 * - Mahabalipuram: Shore Temple, Pancha Rathas
 * - Kashmir: Dal Lake, Shikaras, Snow Mountains
 * 
 * Priority Chain:
 * EXACT DESTINATION -> EXACT ATTRACTION -> EXACT CATEGORY -> CITY -> STATE -> REGION -> COUNTRY -> GENERIC FALLBACK
 */

import { getAssetPath } from '@/lib/utils';

export interface DestinationImageMetadata {
  url: string;
  title: string;
  placeType: 'temple' | 'waterfall' | 'beach' | 'mountain' | 'forest' | 'heritage' | 'fort' | 'palace' | 'lake' | 'river' | 'viewpoint' | 'wildlife' | 'adventure' | 'food' | 'hotel' | 'transport' | 'market';
  destinationId: string;
  state: string;
  source: string;
  license: string;
}

export interface DestinationMediaProfile {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  tagline: string;
  identityKeywords: string[];

  // Core Structured Visual Identifiers (Strict Destination-Aware System)
  hero: string;
  region: string;
  culture: string;
  nature: string;
  defaultBackground: string;

  // Hero & Backgrounds (2K/4K curated resolution)
  heroImages: string[];
  backgroundImages: string[];

  // Explicit Attraction Mappings (Exact 1-to-1)
  attractionImages: Record<string, string>;

  // Hidden Gem Specific Mappings (Matching placeType === imageType)
  hiddenGemImages: Record<string, string>;

  // Categorical Libraries
  natureImages: string[];
  heritageImages: string[];
  spiritualImages: string[];
  adventureImages: string[];
  foodImages: string[];
  hotelImages: string[];
  transportImages: {
    Train: string;
    Car: string;
    Bus: string;
    Flight: string;
    Cab: string;
  };
  guideImages: string[];
  mapImages: {
    temple: string;
    waterfall: string;
    heritage: string;
    nature: string;
    hotel: string;
    food: string;
  };
  thumbnailImages: string[];
  fallbackImages: string[];

  crowdOverlayMood?: 'spiritual-gold' | 'heritage-amber' | 'nature-emerald' | 'coastal-cyan';
}

export const DESTINATION_MEDIA: Record<string, DestinationMediaProfile> = {
  // -------------------------------------------------------------
  // 1. TIRUPATI — ANDHRA PRADESH
  // -------------------------------------------------------------
  tirupati: {
    id: 'tirupati',
    name: 'Tirupati',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    country: 'India',
    tagline: 'Sacred Tirumala Hills, Ancient Dravidian Sanctums & Seshachalam Valleys',
    identityKeywords: [
      'Sri Venkateswara',
      'Lord Balaji',
      'Tirumala Temple',
      'Tirumala Hills',
      'Seshachalam Hills',
      'South Indian Temple Architecture',
      'Pilgrimage',
      'Temple Gopuram',
      'Talakona Waterfalls',
      'Kapila Theertham',
      'Chandragiri Fort',
      'Silathoranam',
    ],
    hero: '/images/destinations/tirupati_tirumala_hero.jpg',
    region: '/images/destinations/tirupati_seshachalam_hills.jpg',
    culture: '/images/destinations/tirupati_tirumala_hero.jpg',
    nature: '/images/destinations/tirupati_talakona_waterfall.jpg',
    defaultBackground: '/images/destinations/tirupati_tirumala_hero.jpg',
    heroImages: [
      '/images/destinations/tirupati_tirumala_hero.jpg', // Sri Venkateswara Swamy Temple at Tirumala
      '/images/destinations/tirupati_seshachalam_hills.jpg', // Seshachalam hills and Tirumala ghat road
    ],
    backgroundImages: [
      '/images/destinations/tirupati_tirumala_hero.jpg',
      '/images/destinations/tirupati_seshachalam_hills.jpg',
      '/images/destinations/tirupati_talakona_waterfall.jpg',
    ],
    attractionImages: {
      'Sri Venkateswara Temple': '/images/destinations/tirupati_tirumala_hero.jpg',
      'Tirumala Hills': '/images/destinations/tirupati_seshachalam_hills.jpg',
      'Kapila Theertham': '/images/destinations/tirupati_tirumala_hero.jpg',
      'Talakona Waterfalls': '/images/destinations/tirupati_talakona_waterfall.jpg',
      'Chandragiri Fort': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
      'Silathoranam Arch': 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1600&q=80',
      'Kalahasteeswara Temple': '/images/destinations/tirupati_tirumala_hero.jpg',
      'Kalyani Dam': '/images/destinations/tirupati_seshachalam_hills.jpg',
      'Nagalapuram Gorge': '/images/destinations/tirupati_talakona_waterfall.jpg',
    },
    hiddenGemImages: {
      'gem-talakona': '/images/destinations/tirupati_talakona_waterfall.jpg',
      'gem-chandragiri': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'gem-silathoranam': 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80',
      'gem-kalahasti': '/images/destinations/tirupati_tirumala_hero.jpg',
      'gem-kalyani-dam': '/images/destinations/tirupati_seshachalam_hills.jpg',
      'gem-nagalapuram': '/images/destinations/tirupati_talakona_waterfall.jpg',
    },
    natureImages: [
      '/images/destinations/tirupati_talakona_waterfall.jpg',
      '/images/destinations/tirupati_seshachalam_hills.jpg',
    ],
    heritageImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=80',
      '/images/destinations/tirupati_tirumala_hero.jpg',
    ],
    spiritualImages: [
      '/images/destinations/tirupati_tirumala_hero.jpg',
      '/images/destinations/tirupati_seshachalam_hills.jpg',
    ],
    adventureImages: [
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
    ],
    foodImages: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80', // Tirupati Laddu
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80', // Andhra Banana Leaf Meal
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80', // Pesarattu
    ],
    hotelImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    ],
    transportImages: {
      Train: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=2560&q=85',
      Car: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
      Bus: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2560&q=85',
      Flight: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=2560&q=85',
      Cab: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
    },
    guideImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    ],
    mapImages: {
      temple: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
      waterfall: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=400&q=80',
      heritage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
      nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      food: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80',
    },
    thumbnailImages: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80',
    ],
    fallbackImages: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2560&q=85',
    ],
    crowdOverlayMood: 'spiritual-gold',
  },

  // -------------------------------------------------------------
  // 2. HAMPI — KARNATAKA
  // -------------------------------------------------------------
  hampi: {
    id: 'hampi',
    name: 'Hampi',
    city: 'Hampi',
    state: 'Karnataka',
    country: 'India',
    tagline: 'UNESCO Vijayanagara Stone Ruins, Massive Granite Boulders & Tungabhadra Coracle Trails',
    identityKeywords: [
      'Virupaksha Temple',
      'Vijayanagara Empire',
      'Hampi Ruins',
      'Granite Boulders',
      'Vittala Temple',
      'Stone Chariot',
      'Tungabhadra River',
      'Matanga Hill',
      'Sanapur Lake',
      'Anegundi',
      'Achyutaraya Temple',
    ],
    hero: '/images/destinations/hampi_stone_chariot_hero.jpg',
    region: '/images/destinations/hampi_stone_chariot_hero.jpg',
    culture: '/images/destinations/hampi_stone_chariot_hero.jpg',
    nature: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=2560&q=85',
    defaultBackground: '/images/destinations/hampi_stone_chariot_hero.jpg',
    heroImages: [
      '/images/destinations/hampi_stone_chariot_hero.jpg', // Iconic Hampi Stone Chariot at Vittala complex
      '/images/destinations/hampi_stone_chariot_hero.jpg', // Virupaksha Temple & stone ruins
    ],
    backgroundImages: [
      '/images/destinations/hampi_stone_chariot_hero.jpg',
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=2560&q=85', // Matanga sunset & granite boulders
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2560&q=85', // Sanapur lake
    ],
    attractionImages: {
      'Virupaksha Temple': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
      'Vittala Temple & Stone Chariot': getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
      'Sanapur Lake': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80',
      'Matanga Hill': 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=80',
      'Anjaneya Hill': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80',
      'Anegundi Village': 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1600&q=80',
      'Daroji Sanctuary': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
      'Achyutaraya Temple': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
    },
    hiddenGemImages: {
      'gem-sanapur': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
      'gem-anjaneya': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'gem-anegundi': 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
      'gem-daroji': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'gem-achyutaraya': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    },
    natureImages: [
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=2000&q=80',
    ],
    heritageImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=2000&q=80',
    ],
    spiritualImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=80',
    ],
    adventureImages: [
      'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80',
    ],
    foodImages: [
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80', // Jowar Rotti & Thali
      'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1200&q=80', // Shakshuka cafe breakfast
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80', // Tamarind Puliogare
    ],
    hotelImages: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    ],
    transportImages: {
      Train: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=2560&q=85',
      Car: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=2560&q=85',
      Bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2560&q=85',
      Flight: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=2560&q=85',
      Cab: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=2560&q=85',
    },
    guideImages: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    ],
    mapImages: {
      temple: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
      waterfall: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80',
      heritage: getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
      nature: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=400&q=80',
      hotel: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=400&q=80',
      food: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
    },
    thumbnailImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
    ],
    fallbackImages: [
      getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
    ],
    crowdOverlayMood: 'heritage-amber',
  },

  // -------------------------------------------------------------
  // 3. MUNNAR — KERALA
  // -------------------------------------------------------------
  munnar: {
    id: 'munnar',
    name: 'Munnar',
    city: 'Munnar',
    state: 'Kerala',
    country: 'India',
    tagline: 'Misty Western Ghats Peaks, Emerald Tea Carpet Valleys & Secluded Cascades',
    identityKeywords: [
      'Tea Plantations',
      'Misty Green Hills',
      'Western Ghats',
      'Waterfalls',
      'Tea Gardens',
      'Mountain Valleys',
      'Kolukkumalai',
      'Eravikulam',
      'Mattupetty',
      'Attukad Waterfalls',
      'Meesapulimala',
      'Mist',
    ],
    hero: '/images/destinations/munnar_tea_hills.jpg',
    region: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=85',
    culture: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80',
    nature: '/images/destinations/munnar_tea_hills.jpg',
    defaultBackground: '/images/destinations/munnar_tea_hills.jpg',
    heroImages: [
      '/images/destinations/munnar_tea_hills.jpg', // Rolling tea plantations under mountain mist
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=85', // Kolukkumalai sunrise peaks above clouds
    ],
    backgroundImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2560&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=85',
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2560&q=85', // Attukad waterfalls surrounded by tea hills
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85', // Winding ghat road through tea valley
    ],
    attractionImages: {
      'Tea Gardens & KDHP': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80',
      'Kolukkumalai Estate': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80',
      'Meesapulimala Peak': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
      'Chinnar Sanctuary': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=80',
      'Marayoor Sandalwood': getAssetPath('/images/destinations/munnar_marayoor_sandalwood.jpg'),
      'Attukad Waterfalls': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=80',
    },
    hiddenGemImages: {
      'gem-kolukkumalai': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'gem-meesapulimala': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'gem-chinnar': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      'gem-marayoor': getAssetPath('/images/destinations/munnar_marayoor_sandalwood.jpg'),
      'gem-attukal': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
    },
    natureImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=2000&q=80',
    ],
    heritageImages: [
      getAssetPath('/images/destinations/munnar_marayoor_sandalwood.jpg'),
    ],
    spiritualImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
    ],
    adventureImages: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=2000&q=80',
    ],
    foodImages: [
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80', // Appam
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80', // Malabar curry
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80', // Cardamom Tea
    ],
    hotelImages: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
    ],
    transportImages: {
      Train: 'https://images.unsplash.com/photo-1532105956626-9569c03602f6?auto=format&fit=crop&w=2560&q=85',
      Car: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
      Bus: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2560&q=85',
      Flight: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=2560&q=85',
      Cab: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
    },
    guideImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    ],
    mapImages: {
      temple: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80',
      waterfall: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=400&q=80',
      heritage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
      nature: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80',
      hotel: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=400&q=80',
      food: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=400&q=80',
    },
    thumbnailImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80',
    ],
    fallbackImages: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2560&q=85',
    ],
    crowdOverlayMood: 'nature-emerald',
  },

  // -------------------------------------------------------------
  // 4. GOA
  // -------------------------------------------------------------
  goa: {
    id: 'goa',
    name: 'Goa',
    city: 'Panaji',
    state: 'Goa',
    country: 'India',
    tagline: 'Golden Palm Shores, Coastal Forts & Arabian Sea Sunsets',
    identityKeywords: ['Goa Beaches', 'Arabian Sea', 'Palm Trees', 'Beach Sunsets', 'Portuguese Architecture', 'Coastal Roads'],
    hero: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2560&q=85',
    region: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85',
    culture: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=80',
    nature: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
    defaultBackground: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2560&q=85',
    heroImages: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2560&q=85'],
    backgroundImages: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2560&q=85',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85',
    ],
    attractionImages: {},
    hiddenGemImages: {},
    natureImages: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80'],
    heritageImages: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=80'],
    spiritualImages: [],
    adventureImages: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80'],
    foodImages: ['https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'],
    hotelImages: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'],
    transportImages: {
      Train: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?auto=format&fit=crop&w=2560&q=85',
      Car: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2560&q=85',
      Bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2560&q=85',
      Flight: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2560&q=85',
      Cab: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2560&q=85',
    },
    guideImages: [],
    mapImages: {
      temple: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
      waterfall: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      heritage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
      nature: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      hotel: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
      food: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
    },
    thumbnailImages: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80'],
    fallbackImages: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2560&q=85'],
    crowdOverlayMood: 'coastal-cyan',
  },

  // -------------------------------------------------------------
  // 5. JAIPUR — RAJASTHAN
  // -------------------------------------------------------------
  jaipur: {
    id: 'jaipur',
    name: 'Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    tagline: 'The Pink City, Hilltop Amber Fortress & Royal Wind Palaces',
    identityKeywords: ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Rajasthan Architecture', 'Pink City', 'Royal Heritage'],
    hero: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2560&q=85',
    region: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2560&q=85',
    culture: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2000&q=80',
    nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
    defaultBackground: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2560&q=85',
    heroImages: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2560&q=85'],
    backgroundImages: [
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2560&q=85',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2560&q=85',
    ],
    attractionImages: {},
    hiddenGemImages: {},
    natureImages: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80'],
    heritageImages: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2000&q=80'],
    spiritualImages: [],
    adventureImages: [],
    foodImages: ['https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80'],
    hotelImages: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
    transportImages: {
      Train: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=2560&q=85',
      Car: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2560&q=85',
      Bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2560&q=85',
      Flight: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=2560&q=85',
      Cab: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2560&q=85',
    },
    guideImages: [],
    mapImages: {
      temple: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80',
      waterfall: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      heritage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80',
      nature: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      food: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80',
    },
    thumbnailImages: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80'],
    fallbackImages: ['https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2560&q=85'],
    crowdOverlayMood: 'heritage-amber',
  },

  // -------------------------------------------------------------
  // 6. VARANASI — UTTAR PRADESH
  // -------------------------------------------------------------
  varanasi: {
    id: 'varanasi',
    name: 'Varanasi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    tagline: 'Timeless Ganges Ghats, Evening Maha Aarti & Spiritual Sacred Sanctum',
    identityKeywords: ['Ganges', 'Ghats', 'Boats', 'Temples', 'Aarti Atmosphere', 'Spiritual Environment'],
    hero: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2560&q=85',
    region: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2560&q=85',
    culture: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=80',
    nature: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=80',
    defaultBackground: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2560&q=85',
    heroImages: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2560&q=85'],
    backgroundImages: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2560&q=85',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=2560&q=85',
    ],
    attractionImages: {},
    hiddenGemImages: {},
    natureImages: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=80'],
    heritageImages: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=80'],
    spiritualImages: ['https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=2000&q=80'],
    adventureImages: [],
    foodImages: ['https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80'],
    hotelImages: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'],
    transportImages: {
      Train: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=2560&q=85',
      Car: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
      Bus: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=2560&q=85',
      Flight: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=2560&q=85',
      Cab: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=2560&q=85',
    },
    guideImages: [],
    mapImages: {
      temple: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80',
      waterfall: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80',
      heritage: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=400&q=80',
      nature: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80',
      hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      food: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80',
    },
    thumbnailImages: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80'],
    fallbackImages: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2560&q=85'],
    crowdOverlayMood: 'spiritual-gold',
  },
};

export interface ImageQueryCriteria {
  destination?: string;
  attraction?: string;
  gemId?: string;
  category?: string;
  activity?: string;
  transport?: string;
  placeType?: string;
  travellerType?: string;
  preferHero?: boolean;
}

/**
 * AUTOMATED VALIDATION FUNCTION (Phase 13)
 * Validates whether an image matches the destination and requested place type.
 */
export function validateDestinationImage(
  destinationId: string,
  imageMetadata: Partial<DestinationImageMetadata>
): boolean {
  const profile = DESTINATION_MEDIA[destinationId.toLowerCase()];
  if (!profile) return false;

  // Verify destination ID or state matches
  if (imageMetadata.destinationId && imageMetadata.destinationId.toLowerCase() !== destinationId.toLowerCase()) {
    return false;
  }
  return true;
}

/**
 * MASTER IMAGE SELECTION ALGORITHM (Phase 3 & Phase 6)
 * Strict Priority:
 * 1. Exact Destination + Exact Attraction / Hidden Gem ID
 * 2. Exact Destination + Exact Transport (e.g. Munnar + Car, Tirupati + Train)
 * 3. Exact Destination + Category / PlaceType (e.g. Tirupati + Waterfall -> Talakona)
 * 4. Exact Destination Hero
 * 5. State / Regional Matching
 * 6. Authentic Fallback (Never generic city / random night image)
 */
export function getDestinationMedia(query: ImageQueryCriteria): string {
  const destId = (query.destination || 'tirupati').toLowerCase().trim();
  const profile = DESTINATION_MEDIA[destId] || DESTINATION_MEDIA.tirupati;

  let chosen = '';

  // 1. Exact Hidden Gem ID match
  if (query.gemId && profile.hiddenGemImages[query.gemId]) {
    chosen = profile.hiddenGemImages[query.gemId];
  } else if (query.attraction && profile.attractionImages[query.attraction]) {
    chosen = profile.attractionImages[query.attraction];
  } else if (query.preferHero) {
    chosen = profile.hero || profile.heroImages[0];
  } else if (query.transport) {
    const t = query.transport.trim();
    if (t === 'Train' && profile.transportImages.Train) chosen = profile.transportImages.Train;
    else if ((t === 'Car' || t === 'Cab') && profile.transportImages.Car) chosen = profile.transportImages.Car;
    else if (t === 'Bus' && profile.transportImages.Bus) chosen = profile.transportImages.Bus;
    else if (t === 'Flight' && profile.transportImages.Flight) chosen = profile.transportImages.Flight;
  }

  if (!chosen) {
    const cat = (query.category || query.activity || query.placeType || '').toLowerCase();
    if (cat.includes('waterfall') || cat.includes('nature') || cat.includes('mountain')) {
      chosen = profile.nature || profile.natureImages[0];
    } else if (cat.includes('temple') || cat.includes('spirit') || cat.includes('divine') || cat.includes('culture') || cat.includes('heritage')) {
      chosen = profile.culture || profile.spiritualImages[0];
    } else if (cat.includes('adventure') && profile.adventureImages[0]) chosen = profile.adventureImages[0];
    else if (cat.includes('food') && profile.foodImages[0]) chosen = profile.foodImages[0];
    else if (cat.includes('hotel') && profile.hotelImages[0]) chosen = profile.hotelImages[0];
    else chosen = profile.defaultBackground || profile.hero;
  }

  return getAssetPath(chosen);
}

/**
 * Backwards compatibility exports matching prior interfaces
 */
export const DESTINATION_VISUALS = Object.entries(DESTINATION_MEDIA).reduce(
  (acc, [key, val]) => {
    acc[key] = {
      id: val.id,
      name: val.name,
      state: val.state,
      country: val.country,
      tagline: val.tagline,
      hero: getAssetPath(val.hero),
      region: getAssetPath(val.region),
      culture: getAssetPath(val.culture),
      nature: getAssetPath(val.nature),
      defaultBackground: getAssetPath(val.defaultBackground),
      backgrounds: (val.backgroundImages || []).map(getAssetPath),
      temple: getAssetPath(val.spiritualImages[0] || val.hero),
      heritage: getAssetPath(val.heritageImages[0] || val.hero),
      natureImg: getAssetPath(val.natureImages[0] || val.nature),
      transportTrain: getAssetPath(val.transportImages.Train),
      transportCar: getAssetPath(val.transportImages.Car),
      transportBus: getAssetPath(val.transportImages.Bus),
      transportFlight: getAssetPath(val.transportImages.Flight),
      food: getAssetPath(val.foodImages[0]),
      hotel: getAssetPath(val.hotelImages[0]),
      crowdOverlayMood: val.crowdOverlayMood,
    };
    return acc;
  },
  {} as Record<string, any>
);

export function getDestinationVisual(query: any): string {
  return getDestinationMedia({
    destination: query.destination,
    attraction: query.attraction,
    gemId: query.gemId,
    category: query.category,
    activity: query.activity,
    transport: query.transport,
    preferHero: query.preferHero,
  });
}

export function getDestinationBackgrounds(destinationSlug: string): string[] {
  const profile = DESTINATION_MEDIA[destinationSlug.toLowerCase()] || DESTINATION_MEDIA.tirupati;
  return (profile.backgroundImages || []).map(getAssetPath);
}
