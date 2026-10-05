import { Destination, HiddenGem } from '@/types';
import { DESTINATIONS, RESTAURANTS_SEED, GUIDES_SEED } from './data/seed';

export interface TouristHelpAction {
  id: string;
  label: string;
  icon: string;
  category: string;
  description: string;
}

export const TOURIST_QUICK_ACTIONS: TouristHelpAction[] = [
  { id: 'emergency', label: 'Emergency 112', icon: '🆘', category: 'Safety', description: 'Immediate police & ambulance dispatch' },
  { id: 'hospital', label: 'Hospital', icon: '🏥', category: 'Medical', description: 'Nearest verified emergency trauma & clinics' },
  { id: 'restroom', label: 'Restrooms', icon: '🚻', category: 'Amenities', description: 'Clean public and paid toilet complexes' },
  { id: 'food', label: 'Pure Veg Food', icon: '🍴', category: 'Dining', description: 'Hygienic local dining & breakfast joints' },
  { id: 'atm', label: 'ATM Cash', icon: '🏧', category: 'Banking', description: 'Nationalized bank ATMs with 24/7 power' },
  { id: 'fuel', label: 'Fuel Station', icon: '⛽', category: 'Transit', description: 'Petrol pumps & EV fast charging points' },
  { id: 'parking', label: 'Parking Lot', icon: '🅿️', category: 'Transit', description: 'Designated vehicle parking grounds' },
  { id: 'network', label: 'Network Info', icon: '📶', category: 'Connectivity', description: 'Cellular signals (Jio/Airtel/BSNL) status' },
  { id: 'transport', label: 'Local Bus / Cab', icon: '🚕', category: 'Transit', description: 'RTC bus stands, pre-paid autos & taxis' },
  { id: 'guide', label: 'Local Guide', icon: '🧑‍🏫', category: 'Assistance', description: 'Verified multilingual certified guides' },
  { id: 'translator', label: 'Translator', icon: '🌐', category: 'Language', description: 'Real-time interstate voice translation' },
  { id: 'pharmacy', label: 'Pharmacy', icon: '💊', category: 'Medical', description: '24-hour medical stores with first aid' },
];

interface DestinationHelpKnowledge {
  policeContact: string;
  hospitals: string[];
  pharmacies: string[];
  restrooms: string[];
  atms: string[];
  busStand: string;
  parking: string;
  connectivity: string;
  vegFood: string[];
  vehicleRentals: string;
  guideRequirement: string;
  visitingHours: string;
  packingList: string;
}

const DESTINATION_HELP: Record<string, DestinationHelpKnowledge> = {
  tirupati: {
    policeContact: '100 / 112 / Tirumala Hill Security: 0877-2263777',
    hospitals: ['SVIMS Sri Venkateswara Institute of Medical Sciences (Alipiri Road)', 'RUIA Government General Hospital (Tirupati Central)'],
    pharmacies: ['Apollo Pharmacy 24/7 (Railway Station Road)', 'MedPlus (Bhavani Nagar)'],
    restrooms: ['Sulabh Complex at Alipiri Checkpost', 'Tirumala PAC 1 & 2 Restroom complex', 'Talakona Forest Entrance complex'],
    atms: ['SBI 24/7 ATM (Alipiri Circle)', 'HDFC ATM (Tirupati Railway Road)', 'Andhra Bank ATM at Tirumala'],
    busStand: 'APSRTC Central Bus Station (Tirupati) - Express buses to Talakona, Chandragiri, Kalahasti every 20 mins',
    parking: 'Alipiri Multi-level Parking (Car: ₹50/day) & Chandragiri Fort visitor parking ground (₹30)',
    connectivity: 'Strong 5G in Tirupati city & Tirumala; Spotty in Talakona deep forest canopy (BSNL/Jio works near entrance)',
    vegFood: ['Hotel Mayura Pure Veg (RTC Bus Stand)', 'Bhimas Deluxe Veg (Railway Road)', 'Sri Balaji Woodlands (Alipiri)'],
    vehicleRentals: 'Self-drive cars & bike rentals near Tirupati Railway Station (₹400/day bike, ₹1,800/day sedan). Pre-paid auto stand at bus terminal.',
    guideRequirement: 'Recommended for Chandragiri Fort light & sound show and Talakona botanical reserve trek. Not required for general darshan lines.',
    visitingHours: 'City attractions: 06:00 AM – 09:00 PM. Talakona forest falls checkpost closes at 05:00 PM for safety.',
    packingList: 'Light cotton attire, slip-on shoes for temple steps, water bottle, modest clothing, rain poncho during monsoon.',
  },
  hampi: {
    policeContact: '100 / 112 / Hampi Tourism Police Booth: 08394-241241',
    hospitals: ['Primary Health Center (Kamalapur, 4 km)', 'Hospet Government Hospital (12 km - 24/7 Emergency trauma center)'],
    pharmacies: ['Kamalapur Medical Stores', 'Hospet 24hr Druggists (Station Road)'],
    restrooms: ['Hampi Bazaar ASI Restroom Complex', 'Kamalapur Archaeological Museum Toilets', 'Sanapur Lake Cafe Restrooms'],
    atms: ['SBI ATM (Kamalapur Market)', 'Canara Bank ATM (Near Virupaksha Temple Bazaar)'],
    busStand: 'KSRTC Kamalapur Bus Stand & Hospet KSRTC Central Depot (Buses every 30 mins to Kamalapur/Hampi)',
    parking: 'Main ASI Parking near Virupaksha Bazaar & Vittala Temple Electric Shuttle base (Car: ₹50)',
    connectivity: 'Good 4G in Kamalapur and main bazaar; Boulders cause signal drops at Sanapur Lake (Airtel/Jio best)',
    vegFood: ['Mango Tree Restaurant (Near Riverbank)', 'Udupi Sri Krishna Bhavan (Kamalapur)', 'Gouthami Pure Veg Corner'],
    vehicleRentals: 'Moped and bicycle rentals widely available at Hampi Bazaar & Anegundi (₹150/day cycle, ₹350/day moped).',
    guideRequirement: 'Highly recommended! Certified ASI guides unpack Vijayanagara architecture and musical pillars at Vittala Temple.',
    visitingHours: 'Monuments open sunrise to sunset (06:00 AM – 06:00 PM). Coracle boats operate till 05:30 PM.',
    packingList: 'Sturdy walking shoes for boulders, broad-brimmed sun hat, sunglasses, 2L water, cash for local coracle rides.',
  },
  munnar: {
    policeContact: '100 / 112 / Munnar Police Station: 04865-230321',
    hospitals: ['Tata General Hospital (Munnar High Range, 04865-230222)', 'Government Adimali Taluk Hospital (24/7)'],
    pharmacies: ['Highland Medicals 24/7 (Town Center)', 'Neethi Medical Store (Old Munnar)'],
    restrooms: ['KDHP Tea Museum Restrooms', 'Munnar Town DTPC Tourist Facilitation Center', 'Mattupetty Dam Sulabh Complex'],
    atms: ['SBI ATM (Munnar Main Bazaar)', 'Federal Bank ATM (Near KSRTC Stand)'],
    busStand: 'KSRTC Munnar Bus Station (Old Munnar) - Frequent buses to Devikulam, Mattupetty & Marayoor',
    parking: 'DTPC Munnar Town Parking & Tea Museum dedicated visitor lot (Car: ₹40)',
    connectivity: 'Good 4G in Munnar town and KDHP; No cellular signal on Kolukkumalai upper 4x4 trail',
    vegFood: ['Saravana Bhavan Pure Veg (MG Road)', 'Hotel SN Pure Veg Restaurant', 'Rapsy Pure Local Dining'],
    vehicleRentals: '4x4 Jeep hire stands near Munnar central circle for Kolukkumalai/Chinnakanal routes (₹2,200/trip). Scooters at ₹500/day.',
    guideRequirement: 'Essential for high-altitude shola grassland treks and Meesapulimala trails; optional for town tea museums.',
    visitingHours: 'Tea plantations & viewpoints: 06:30 AM – 05:30 PM. Tea Museum: 09:00 AM – 04:00 PM (Closed Mondays).',
    packingList: 'Warm fleece jacket (evenings drop to 12°C), waterproof umbrella/poncho, non-slip hiking shoes, insect repellent.',
  },
  goa: {
    policeContact: '100 / 112 / Tourist Police Helpline: 0832-2428522',
    hospitals: ['Goa Medical College Hospital (Bambolim - 24/7 Tertiary Care)', 'Asilo District Hospital (Mapusa)'],
    pharmacies: ['Wellness Forever 24/7 (Panaji & Calangute)', 'Apollo Pharmacy (Candolim)'],
    restrooms: ['GTDC Tourist Pavilions at Miramar, Calangute, and Colva beaches', 'Divar Island Ferry point facilities'],
    atms: ['HDFC & Axis Bank ATMs in Panaji Church Square, Calangute, and Margao'],
    busStand: 'Kadamba Transport Central Bus Station (Panaji & Margao) - Intercity air-conditioned shuttles',
    parking: 'Designated pay-and-park lots at major beaches and Basilica of Bom Jesus (₹40 - ₹80)',
    connectivity: 'Strong 5G across all coastal zones; slight attenuation in dense Mollem wildlife sanctuary',
    vegFood: ['Navtara Pure Veg (Panaji, Calangute, Mapusa)', 'Bhojan Traditional Thali (Panaji)', 'Rasoi Pure Veg'],
    vehicleRentals: 'Self-drive cars and scooters on every major road (₹350/day scooter, ₹1,500/day hatchback). Valid DL required.',
    guideRequirement: 'Helpful for Old Goa UNESCO churches, Latin Quarter heritage walk (Fontainhas), and spice plantations.',
    visitingHours: 'Churches: 07:30 AM – 06:00 PM. Forts: 08:30 AM – 05:30 PM. Beaches accessible 24/7 (no swimming after dark).',
    packingList: 'Lightweight linen, sunscreen SPF 50, beach towel, flip-flops, sunglasses, waterproof phone case.',
  },
  jaipur: {
    policeContact: '100 / 112 / Tourist Police Station: 0141-2601728',
    hospitals: ['Sawai Man Singh (SMS) Hospital (JL Marg - 24/7 Trauma)', 'Santokba Durlabhji Memorial Hospital'],
    pharmacies: ['Apollo Pharmacy 24/7 (MI Road)', 'MedPlus (Raja Park)'],
    restrooms: ['Hawa Mahal tourist complex', 'City Palace visitor courtyards', 'Amber Fort multi-level conveniences'],
    atms: ['SBI & ICICI ATMs along MI Road, Johari Bazaar, and near Bapu Bazaar'],
    busStand: 'Sindhi Camp Inter-State Bus Terminal (Jaipur Central) & Jaipur City Low-Floor AC Buses',
    parking: 'Underground parking at Ramniwas Bagh & Amber Fort visitor ground (₹50)',
    connectivity: 'Superb 5G throughout Jaipur metro region and fort perimeters',
    vegFood: ['LMB (Laxmi Mishthan Bhandar) Johari Bazaar', 'Rawat Mishthan Bhandar (Kachori & Thali)', 'Natraj Pure Veg (MI Road)'],
    vehicleRentals: 'Pre-paid autos, app cabs (Uber/Ola), and auto-rickshaws available everywhere outside railway station.',
    guideRequirement: 'Recommended at Amber Fort and Jantar Mantar to decipher historical astronomical instruments.',
    visitingHours: 'Forts and palaces: 09:00 AM – 05:00 PM. Night tourism at Amber & Hawa Mahal: 06:30 PM – 09:30 PM.',
    packingList: 'Breathable cottons, comfortable walking footwear for fort stone ramps, sun scarf, cash for bazaar artisans.',
  },
  varanasi: {
    policeContact: '100 / 112 / Tourism Police (Dashashwamedh Ghat): 0542-2390100',
    hospitals: ['Sir Sunderlal Hospital (IMS-BHU - 24/7 Tertiary Trauma)', 'Heritage Hospital (Lanka)'],
    pharmacies: ['Apollo Pharmacy 24/7 (Godowlia)', 'BHU Medical Centre Dispensary'],
    restrooms: ['Kashi Vishwanath Corridor facilities (Modern, Clean)', 'Assi Ghat public amenities', 'Dashashwamedh plaza'],
    atms: ['SBI ATM (Godowlia Crossing)', 'Bank of Baroda ATM (Lanka Crossing)'],
    busStand: 'UPSRTC Cantt Bus Depot (Opposite Varanasi Junction) & Electric AC city buses',
    parking: 'Godowlia Multi-level Parking (Walk from here to Ghats, vehicle restricted zone in core alleys)',
    connectivity: 'Excellent 5G in city and ghats; slight interference deep inside ancient narrow gallis',
    vegFood: ['Keshari Restaurant (Godowlia)', 'Aflatoon Banarasi Thali (Assi Ghat)', 'Deena Chaat Bhandar (Pure Veg Street Snacks)'],
    vehicleRentals: 'E-rickshaws and cycle-rickshaws are best for narrow streets. Taxis available at railway station.',
    guideRequirement: 'Recommended for evening Ganga Aarti boat narrative and walking through 3,000-year-old Vedic gallis.',
    visitingHours: 'Ghats accessible 24/7. Ganga Aarti: 06:45 PM (Summer) / 06:00 PM (Winter). Kashi Vishwanath: 03:00 AM – 11:00 PM.',
    packingList: 'Modest traditional or casual clothing, easy-slip footwear for ghat steps, light shawl for evening river breeze.',
  },
};

export function answerTouristQuery(query: string, destinationSlug: string): string {
  const q = query.toLowerCase().trim();
  const slug = destinationSlug.toLowerCase();
  const data = DESTINATION_HELP[slug] || DESTINATION_HELP.tirupati;
  const destName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // 1. Restroom
  if (q.includes('restroom') || q.includes('toilet') || q.includes('washroom')) {
    return `🚻 Clean Restroom Facilities near ${destName}:\n• ${data.restrooms.join('\n• ')}\n\nTip: Carry wet wipes for remote forest/mountain paths.`;
  }

  // 2. Vegetarian Food
  if (q.includes('veg') || q.includes('food') || q.includes('breakfast') || q.includes('dinner') || q.includes('restaurant')) {
    return `🍴 Pure Vegetarian & Verified Dining in ${destName}:\n• ${data.vegFood.join('\n• ')}\n\nAll options serve fresh local cuisine on clean banana leaves / traditional thalis.`;
  }

  // 3. ATM
  if (q.includes('atm') || q.includes('cash') || q.includes('money')) {
    return `🏧 Operational ATMs in ${destName}:\n• ${data.atms.join('\n• ')}\n\nTip: UPI is widely accepted in town, but carry cash for remote waterfall/forest tickets.`;
  }

  // 4. Bus stand / Reach
  if (q.includes('reach') || q.includes('bus stand') || q.includes('bus') || (q.includes('stand') && !q.includes('restroom'))) {
    return `🚌 Transit & Bus Stand in ${destName}:\n• ${data.busStand}\n\n🅿️ Parking: ${data.parking}`;
  }

  // 5. Packing list
  if (q.includes('carry') || q.includes('pack') || q.includes('bring')) {
    return `🎒 What to carry for ${destName}:\n• ${data.packingList}`;
  }

  // 6. Child suitability
  if (q.includes('child') || q.includes('kid')) {
    return `👶 Child Suitability for ${destName}:\n• Family-friendly parks, paved temple plazas, and scenic lakes are great for children.\n• For rocky waterfall scrambles, carry child carriers and avoid high bouldering edges.`;
  }

  // 7. Parking
  if (q.includes('parking') || q.includes('park my vehicle') || q.includes('car park')) {
    return `🅿️ Parking Availability in ${destName}:\n• ${data.parking}`;
  }

  // 8. Elderly accessibility
  if (q.includes('elder') || q.includes('senior') || q.includes('old people') || q.includes('wheelchair') || q.includes('accessibility')) {
    return `👴 Accessibility Advice for Elderly Travellers (${destName}):\n• Wheelchair ramps & battery carts available at major shrines/museums.\n• Low-gradient walking paths available.\n• Note: Deep forest waterfalls have rock steps; consider viewpoint gazebos instead.`;
  }

  // 9. Rain / Weather
  if (q.includes('rain') || q.includes('weather') || q.includes('storm')) {
    return `🌦️ Rain Protocols for ${destName}:\n• If it rains: Avoid slippery waterfall plunges and open high peaks.\n• Move to covered cultural centers, museums, and indoor temple courtyards.\n• Carry a compact waterproof poncho and shoes with rubber traction.`;
  }

  // 10. Hospital / Emergency
  if (q.includes('hospital') || q.includes('doctor') || q.includes('medical') || q.includes('emergency')) {
    return `🏥 Nearest Hospitals for ${destName}:\n• ${data.hospitals.join('\n• ')}\n\n🆘 Police & Emergency: ${data.policeContact}\n💊 24/7 Pharmacy: ${data.pharmacies.join(', ')}`;
  }

  // 11. Can I visit now / Opening hours
  if (q.includes('visit') && (q.includes('now') || q.includes('time') || q.includes('open') || q.includes('hours'))) {
    return `🕐 Visiting Hours for ${destName}:\n• ${data.visitingHours}\n• Note: Entry to remote eco-reserves closes before dark (around 05:00 PM).`;
  }

  // 12. Mobile network
  if (q.includes('network') || q.includes('signal') || q.includes('mobile') || q.includes('wifi') || q.includes('connectivity')) {
    return `📶 Cellular Network Coverage in ${destName}:\n• ${data.connectivity}`;
  }

  // 13. Guide requirement
  if (q.includes('guide') && (q.includes('need') || q.includes('require') || q.includes('hire'))) {
    return `🧑‍🏫 Guide Advice for ${destName}:\n• ${data.guideRequirement}\n\nYou can hire certified verified guides directly via the HiddenGem Guide portal!`;
  }

  // 14. Rent vehicle
  if (q.includes('rent') || q.includes('scooter') || q.includes('bike hire') || q.includes('car hire')) {
    return `🚗 Vehicle Rentals in ${destName}:\n• ${data.vehicleRentals}`;
  }

  // Fallback as strictly required by prompt
  return `Information unavailable — please verify locally.`;
}

