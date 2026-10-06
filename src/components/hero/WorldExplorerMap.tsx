'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  Compass,
  ArrowRight,
  Plus,
  Minus,
  Home,
  Globe2,
  X,
  Minimize2,
  Maximize2,
  ExternalLink,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { getAssetPath } from '@/lib/utils';

export interface MapDestination {
  id: string;
  slug?: string;
  name: string;
  stateOrRegion: string;
  country: string;
  countryCode: string;
  flag: string;
  lat: number;
  lng: number;
  subtitle: string;
  image: string;
  isAvailableInApp: boolean;
  hiddenGemHighlight?: string;
  tags?: string[];
}

export const REAL_WORLD_DESTINATIONS: MapDestination[] = [
  // INDIA HUBS & DESTINATIONS
  {
    id: 'tirupati',
    slug: 'tirupati',
    name: 'Tirupati',
    stateOrRegion: 'Andhra Pradesh',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 13.6288,
    lng: 79.4192,
    subtitle: 'Sacred Hill City & Eastern Ghats Hidden Valleys',
    image: getAssetPath('/images/destinations/tirupati_tirumala_hero.jpg'),
    isAvailableInApp: true,
    hiddenGemHighlight: 'Talakona Waterfall & Silathoranam Prehistoric Arch',
    tags: ['Temples', 'Waterfalls', 'Biosphere'],
  },
  {
    id: 'hampi',
    slug: 'hampi',
    name: 'Hampi',
    stateOrRegion: 'Karnataka',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 15.335,
    lng: 76.46,
    subtitle: 'UNESCO Vijayanagara Stone Ruins & Boulder Rivers',
    image: getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg'),
    isAvailableInApp: true,
    hiddenGemHighlight: 'Sanapur Lake Coracle & Anegundi Ancient Citadels',
    tags: ['Ruins', 'Bouldering', 'Heritage'],
  },
  {
    id: 'munnar',
    slug: 'munnar',
    name: 'Munnar',
    stateOrRegion: 'Kerala',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 10.0889,
    lng: 77.0595,
    subtitle: 'Misty High-Altitude Tea Valleys & Western Ghats Peaks',
    image: getAssetPath('/images/destinations/munnar_tea_hills.jpg'),
    isAvailableInApp: true,
    hiddenGemHighlight: 'Kolukkumalai Tea Sunrise & Marayoor Sandalwood Forests',
    tags: ['Tea Hills', 'Clouds', 'Trekking'],
  },
  {
    id: 'goa',
    slug: 'goa',
    name: 'Goa',
    stateOrRegion: 'Goa',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 15.2993,
    lng: 74.124,
    subtitle: 'Secluded Coastal Shores, Estuaries & Portuguese Chapels',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: true,
    hiddenGemHighlight: 'Butterfly Secret Beach & Galgibaga Olive Ridley Sanctuary',
    tags: ['Beaches', 'Portuguese Heritage', 'Estuaries'],
  },
  {
    id: 'jaipur',
    slug: 'jaipur',
    name: 'Jaipur',
    stateOrRegion: 'Rajasthan',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 26.9124,
    lng: 75.7873,
    subtitle: 'Pink City Citadel Forts & Royal Astrological Observatories',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: true,
    hiddenGemHighlight: 'Panna Meena Stepwell & Nahargarh Hidden Bastions',
    tags: ['Forts', 'Stepwells', 'Royal History'],
  },
  {
    id: 'varanasi',
    slug: 'varanasi',
    name: 'Varanasi',
    stateOrRegion: 'Uttar Pradesh',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 25.3176,
    lng: 82.9739,
    subtitle: 'Eternal Ganges Ghats, Morning Boat Aarti & Silk Alleys',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: true,
    hiddenGemHighlight: 'Chunar Sandstone Fortress & Hidden Ashram Ghats',
    tags: ['Ghats', 'Spirituality', 'Silk Heritage'],
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    stateOrRegion: 'Telangana',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 17.385,
    lng: 78.4867,
    subtitle: 'City of Pearls, Qutb Shahi Tombs & Golconda Fortress',
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Gandikota Grand Canyon & Paigah Intricate Tombs',
    tags: ['Heritage', 'Biryani', 'Palaces'],
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    stateOrRegion: 'Karnataka',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 12.9716,
    lng: 77.5946,
    subtitle: 'Garden City Ridges, Bannerghatta & Deccan Plateau',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Nandi Hills Dawn Trail & Shivagange Monolith Peak',
    tags: ['Parks', 'Highlands', 'Plateau'],
  },
  {
    id: 'chennai',
    name: 'Chennai',
    stateOrRegion: 'Tamil Nadu',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 13.0827,
    lng: 80.2707,
    subtitle: 'Coromandel Coast, Classical Arts & Dravidian Sanctuaries',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Mahabalipuram Monolith Shore Temples & Pulicat Lagoon',
    tags: ['Coast', 'Dravidian Temples', 'Flamingos'],
  },
  {
    id: 'delhi',
    name: 'Delhi',
    stateOrRegion: 'NCR',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 28.6139,
    lng: 77.209,
    subtitle: 'Historic Imperial Capital, Mughal Citadels & Baolis',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Mehrauli Archaeological Forest & Agrasen ki Baoli',
    tags: ['History', 'Stepwells', 'Mughal Architecture'],
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    stateOrRegion: 'Maharashtra',
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    lat: 19.076,
    lng: 72.8777,
    subtitle: 'Arabian Sea Shorelines, Victorian Gothic & Coastal Forts',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Kanheri Basalt Rock Caves & Banganga Sacred Tank',
    tags: ['Coastal', 'Rock Caves', 'Harbour'],
  },

  // INTERNATIONAL DESTINATIONS
  {
    id: 'tokyo',
    name: 'Tokyo',
    stateOrRegion: 'Kanto',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    lat: 35.6762,
    lng: 139.6503,
    subtitle: 'Futuristic Megacity, Ancient Shinto Shrines & Cherry Blossoms',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Yanaka Edo-Era Old Quarter & Todoroki Bamboo Ravine',
    tags: ['Culture', 'Edo Heritage', 'Bamboo Gardens'],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    stateOrRegion: 'Kansai',
    country: 'Japan',
    countryCode: 'JP',
    flag: '🇯🇵',
    lat: 35.0116,
    lng: 135.7681,
    subtitle: 'Ancient Imperial Capital, Thousand Pagodas & Bamboo Groves',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Kurama-Kibune Cedar Mountain Path & Otagi 1,200 Statues',
    tags: ['Zen Temples', 'Mountains', 'Forests'],
  },
  {
    id: 'paris',
    name: 'Paris',
    stateOrRegion: 'Île-de-France',
    country: 'France',
    countryCode: 'FR',
    flag: '🇫🇷',
    lat: 48.8566,
    lng: 2.3522,
    subtitle: 'City of Lights, Historic Louvre & Romantic Seine Riverbanks',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Coulée Verte Elevated Garden Promenade & Canal Saint-Martin',
    tags: ['Architecture', 'Seine', 'Gardens'],
  },
  {
    id: 'new-york',
    name: 'New York City',
    stateOrRegion: 'New York',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    lat: 40.7128,
    lng: -74.006,
    subtitle: 'Iconic Global Metropolis, Broadway & Central Park Vistas',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'The Cloisters Medieval Monastery & Roosevelt Island Tram',
    tags: ['Skyline', 'Metropolis', 'Parks'],
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    stateOrRegion: 'California',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    lat: 37.7749,
    lng: -122.4194,
    subtitle: 'Golden Gate Mist, Historic Cable Cars & Pacific Coast',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Muir Beach Overlook & Marin Headlands Secret Battery',
    tags: ['Pacific Coast', 'Bridges', 'Redwoods'],
  },
  {
    id: 'grand-canyon',
    name: 'Grand Canyon',
    stateOrRegion: 'Arizona',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    lat: 36.1069,
    lng: -112.1129,
    subtitle: 'Breathtaking 1-Mile Deep Colorado River Geological Chasm',
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Havasu Blue-Green Falls & Hermit Creek Rapids',
    tags: ['Canyons', 'Geology', 'Wilderness'],
  },
  {
    id: 'sydney',
    name: 'Sydney',
    stateOrRegion: 'New South Wales',
    country: 'Australia',
    countryCode: 'AU',
    flag: '🇦🇺',
    lat: -33.8688,
    lng: 151.2093,
    subtitle: 'Iconic Harbour Opera House, Bondi Surf & Pacific Bays',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Hermitage Foreshore Coastal Track & Milk Beach Secret Cove',
    tags: ['Harbour', 'Surfing', 'Coastlines'],
  },
  {
    id: 'rio-de-janeiro',
    name: 'Rio de Janeiro',
    stateOrRegion: 'Rio de Janeiro',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '🇧🇷',
    lat: -22.9068,
    lng: -43.1729,
    subtitle: 'Dramatic Granite Sugarloaf Peaks, Copacabana & Rainforest',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Parque Lage Jungle Mansion & Pedra Bonita Hang-glider View',
    tags: ['Rainforest', 'Atlantic Coast', 'Granite Peaks'],
  },
  {
    id: 'cairo',
    name: 'Cairo & Giza',
    stateOrRegion: 'Giza',
    country: 'Egypt',
    countryCode: 'EG',
    flag: '🇪🇬',
    lat: 29.9792,
    lng: 31.1342,
    subtitle: 'Great Pyramids of Giza, Nile Feluccas & Ancient Pharaohs',
    image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80',
    isAvailableInApp: false,
    hiddenGemHighlight: 'Dahshur Red Pyramid & Meidum Solitary Necropolis',
    tags: ['Pyramids', 'Nile River', 'Antiquity'],
  },
];

interface WorldExplorerMapProps {
  onSelectDestination: (slug: string) => void;
  selectedDestinationSlug?: string;
}

export function WorldExplorerMap({
  onSelectDestination,
  selectedDestinationSlug,
}: WorldExplorerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const leafletRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState<number>(4);
  const [selectedDestId, setSelectedDestId] = useState<string>(
    selectedDestinationSlug || 'hampi'
  );
  const [hoveredDest, setHoveredDest] = useState<MapDestination | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [activeRegionFilter, setActiveRegionFilter] = useState<string>('All');

  // Currently selected destination object
  const activeDestination: MapDestination = useMemo(() => {
    return (
      REAL_WORLD_DESTINATIONS.find(
        (d) => d.id === selectedDestId || d.slug === selectedDestId
      ) || REAL_WORLD_DESTINATIONS[1] // Default to Hampi
    );
  }, [selectedDestId]);

  // Sync external prop updates
  useEffect(() => {
    if (selectedDestinationSlug) {
      setSelectedDestId(selectedDestinationSlug);
      // If map is already loaded, fly to destination
      const found = REAL_WORLD_DESTINATIONS.find(
        (d) => d.slug === selectedDestinationSlug || d.id === selectedDestinationSlug
      );
      if (found && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([found.lat, found.lng], 8, {
          duration: 1.2,
        });
      }
    }
  }, [selectedDestinationSlug]);

  // Search filter options
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return REAL_WORLD_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.stateOrRegion.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  // Initialize Real Geographic Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically load leaflet client-side to prevent SSR issues
    Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css' as any),
    ])
      .then(([leafletModule]) => {
        if (!isMounted || !mapContainerRef.current) return;
        const L = leafletModule.default || leafletModule;
        leafletRef.current = L;

        // Clean up any existing map instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Center on India & Eurasia by default
        const initialLat = 20.5937;
        const initialLng = 78.9629;
        const initialZoom = 4;

        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: initialZoom,
          minZoom: 2,
          maxZoom: 18,
          zoomControl: false, // Using our custom sleek HiddenGem UI controls
          attributionControl: true,
          worldCopyJump: true,
          scrollWheelZoom: true,
        });

        mapInstanceRef.current = map;

        // Realistic Dark Base Map (CartoDB Dark Matter)
        // Shows real coastlines, real borders, oceans, cities, and road networks
        const cartoLayer = L.tileLayer(
          'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19,
          }
        );

        cartoLayer.addTo(map);

        // Fallback tile layer if needed
        cartoLayer.on('tileerror', () => {
          // graceful fallback to standard OSM if dark matter network stalls
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
          }).addTo(map);
        });

        // Track zoom level changes for control widget
        map.on('zoomend', () => {
          setCurrentZoom(map.getZoom());
        });

        // Add Destination Markers
        const markers: Record<string, any> = {};

        REAL_WORLD_DESTINATIONS.forEach((dest) => {
          const isSelected =
            dest.id === selectedDestId || dest.slug === selectedDestId;

          // Custom DivIcon with glowing neon emerald aesthetic
          const icon = L.divIcon({
            className: 'custom-hiddengem-div-marker',
            html: `
              <div class="group cursor-pointer select-none" style="transform: translate(-50%, -50%);">
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  background: ${isSelected ? '#047857' : 'rgba(10, 15, 20, 0.92)'};
                  color: #ffffff;
                  border: 1.5px solid ${isSelected ? '#34d399' : 'rgba(52, 211, 153, 0.55)'};
                  padding: ${isSelected ? '5px 12px' : '4px 9px'};
                  border-radius: 9999px;
                  font-size: 11px;
                  font-weight: 800;
                  box-shadow: ${
                    isSelected
                      ? '0 0 20px rgba(52, 211, 153, 0.8), 0 4px 12px rgba(0,0,0,0.8)'
                      : '0 4px 12px rgba(0,0,0,0.6), 0 0 10px rgba(16, 185, 129, 0.3)'
                  };
                  backdrop-filter: blur(8px);
                  white-space: nowrap;
                  transition: all 0.25s ease;
                ">
                  <span style="font-size: 12px;">💎</span>
                  <span>${dest.name}</span>
                </div>
              </div>
            `,
            iconSize: [120, 32],
            iconAnchor: [60, 16],
          });

          const marker = L.marker([dest.lat, dest.lng], { icon }).addTo(map);

          // Rich Tooltip on Hover
          marker.bindTooltip(
            `
            <div style="font-family: inherit; font-size: 11px; line-height: 1.3;">
              <div style="font-weight: 900; color: #34d399; display: flex; align-items: center; gap: 4px;">
                <span>${dest.flag}</span>
                <span>${dest.name}</span>
              </div>
              <div style="color: #d6d3d1; font-size: 10px;">${dest.stateOrRegion}, ${dest.country}</div>
              <div style="color: #a7f3d0; font-size: 9px; font-weight: 700; margin-top: 2px;">
                ${dest.isAvailableInApp ? '✓ Full AI Itinerary' : 'Global Discovery'}
              </div>
            </div>
            `,
            {
              className: 'hiddengem-leaflet-tooltip',
              direction: 'top',
              offset: [0, -14],
              opacity: 0.98,
            }
          );

          // Hover handlers
          marker.on('mouseover', () => {
            setHoveredDest(dest);
          });
          marker.on('mouseout', () => {
            setHoveredDest(null);
          });

          // Click handler
          marker.on('click', () => {
            handleSelectMarker(dest);
          });

          markers[dest.id] = marker;
        });

        markersRef.current = markers;
        setMapLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load Leaflet:', err);
      });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker styles when selected destination changes
  useEffect(() => {
    if (!leafletRef.current || !mapLoaded) return;
    const L = leafletRef.current;

    REAL_WORLD_DESTINATIONS.forEach((dest) => {
      const marker = markersRef.current[dest.id];
      if (!marker) return;

      const isSelected =
        dest.id === selectedDestId || dest.slug === selectedDestId;

      const newIcon = L.divIcon({
        className: 'custom-hiddengem-div-marker',
        html: `
          <div class="group cursor-pointer select-none" style="transform: translate(-50%, -50%);">
            <div style="
              display: flex;
              align-items: center;
              gap: 5px;
              background: ${isSelected ? '#047857' : 'rgba(10, 15, 20, 0.92)'};
              color: #ffffff;
              border: 1.5px solid ${isSelected ? '#34d399' : 'rgba(52, 211, 153, 0.55)'};
              padding: ${isSelected ? '5px 12px' : '4px 9px'};
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              box-shadow: ${
                isSelected
                  ? '0 0 22px rgba(52, 211, 153, 0.85), 0 4px 12px rgba(0,0,0,0.8)'
                  : '0 4px 12px rgba(0,0,0,0.6), 0 0 10px rgba(16, 185, 129, 0.3)'
              };
              backdrop-filter: blur(8px);
              white-space: nowrap;
              transition: all 0.25s ease;
            ">
              <span style="font-size: 12px;">💎</span>
              <span>${dest.name}</span>
            </div>
          </div>
        `,
        iconSize: [120, 32],
        iconAnchor: [60, 16],
      });

      marker.setIcon(newIcon);
    });
  }, [selectedDestId, mapLoaded]);

  // Select marker and smoothly flyTo
  const handleSelectMarker = useCallback(
    (dest: MapDestination) => {
      setSelectedDestId(dest.id);
      setIsPanelCollapsed(false);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([dest.lat, dest.lng], 9, {
          duration: 1.2,
        });
      }

      if (dest.slug) {
        onSelectDestination(dest.slug);
      }
    },
    [onSelectDestination]
  );

  // Zoom In Control (+)
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  // Zoom Out Control (−)
  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Reset View Control (⌂)
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20.5937, 78.9629], 4, {
        duration: 1.4,
      });
    }
    setActiveRegionFilter('All');
  };

  // Search handler (e.g. "Hampi", "India", "Japan")
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const q = searchQuery.toLowerCase().trim();

    // 1. Direct Country Search
    if (q === 'india') {
      mapInstanceRef.current.flyTo([20.5937, 78.9629], 5, { duration: 1.4 });
      setSearchQuery('');
      setIsSearchFocused(false);
      return;
    }
    if (q === 'japan') {
      mapInstanceRef.current.flyTo([36.2048, 138.2529], 6, { duration: 1.4 });
      setSearchQuery('');
      setIsSearchFocused(false);
      return;
    }
    if (q === 'france') {
      mapInstanceRef.current.flyTo([46.2276, 2.2137], 6, { duration: 1.4 });
      setSearchQuery('');
      setIsSearchFocused(false);
      return;
    }
    if (q === 'united states' || q === 'usa' || q === 'america') {
      mapInstanceRef.current.flyTo([37.0902, -95.7129], 4, { duration: 1.4 });
      setSearchQuery('');
      setIsSearchFocused(false);
      return;
    }

    // 2. Destination Search
    const match = REAL_WORLD_DESTINATIONS.find(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.stateOrRegion.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q)
    );

    if (match) {
      handleSelectMarker(match);
      setSearchQuery('');
      setIsSearchFocused(false);
    }
  };

  // Region Filter Pills
  const handleSelectRegion = (region: string) => {
    setActiveRegionFilter(region);
    if (!mapInstanceRef.current) return;

    switch (region) {
      case 'All':
        mapInstanceRef.current.flyTo([20.5937, 78.9629], 3.5, { duration: 1.4 });
        break;
      case 'India':
        mapInstanceRef.current.flyTo([19.5, 78.8], 5, { duration: 1.2 });
        break;
      case 'East Asia':
        mapInstanceRef.current.flyTo([35.6, 137.0], 6, { duration: 1.2 });
        break;
      case 'Europe':
        mapInstanceRef.current.flyTo([48.0, 4.0], 5, { duration: 1.2 });
        break;
      case 'Americas':
        mapInstanceRef.current.flyTo([37.0, -98.0], 4, { duration: 1.4 });
        break;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* ========================================================
          1. HEADER & SEARCH BAR
      ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-stone-950/80 backdrop-blur-2xl border border-white/15 shadow-xl text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Globe2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-black tracking-widest text-emerald-400">
                Interactive World GIS Map
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Live Real-World Geography
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              Real coastlines, borders &amp; uncrowded destinations • Drag to pan • Scroll to zoom
            </p>
          </div>
        </div>

        {/* Search Anywhere input with dropdown suggestions */}
        <div className="relative flex-1 max-w-sm">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search destination (e.g. Hampi, Tirupati, Japan)..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 220)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-900/95 border border-white/20 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 shadow-inner font-medium"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete suggestions dropdown */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 rounded-2xl bg-stone-950/98 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden z-50 divide-y divide-white/10">
              {searchSuggestions.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onMouseDown={() => {
                    handleSelectMarker(dest);
                    setSearchQuery('');
                  }}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-emerald-950/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{dest.flag}</span>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {dest.name}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {dest.stateOrRegion}, {dest.country}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    Fly to <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Region quick-jump pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 mr-1 shrink-0">
          Quick Pivot:
        </span>
        {[
          { label: 'All World', key: 'All' },
          { label: '🇮🇳 India (Main Hubs)', key: 'India' },
          { label: '🇯🇵 Japan / East Asia', key: 'East Asia' },
          { label: '🇪🇺 Europe', key: 'Europe' },
          { label: '🇺🇸 Americas', key: 'Americas' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleSelectRegion(tab.key)}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all border ${
              activeRegionFilter === tab.key
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/40'
                : 'bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================
          2. REAL GEOGRAPHIC MAP CONTAINER
      ======================================================== */}
      <div className="relative w-full h-[540px] sm:h-[600px] lg:h-[650px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#090d12]">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Loading Spinner during initial tile setup */}
        {!mapLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-stone-950/90 text-white gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              Loading Real Geographic World Map...
            </span>
          </div>
        )}

        {/* Instruction Banner at lower-left */}
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-950/85 backdrop-blur-md border border-white/15 text-[11px] text-stone-300 pointer-events-none shadow-lg">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Left-click + drag to pan • Mouse wheel or pinch to zoom • Click pins to inspect</span>
        </div>

        {/* ========================================================
            3. PROFESSIONAL MAP CONTROLS (+, −, ⌂) IN LOWER-RIGHT
        ======================================================== */}
        <div className="absolute right-4 bottom-4 z-40 flex flex-col items-center bg-stone-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden divide-y divide-white/10 select-none">
          {/* Zoom Level Indicator */}
          <div className="px-2.5 py-1 text-[9px] font-black uppercase text-emerald-400 bg-stone-950/90 text-center tracking-wider min-w-[46px]">
            {Math.round(currentZoom * 20)}%
          </div>

          {/* Zoom In (+) */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-3 text-stone-200 hover:text-emerald-400 hover:bg-white/10 transition-colors flex items-center justify-center active:scale-90"
            aria-label="Zoom In"
            title="Zoom In (+)"
          >
            <Plus className="w-4 h-4 font-bold" />
          </button>

          {/* Zoom Out (−) */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-3 text-stone-200 hover:text-emerald-400 hover:bg-white/10 transition-colors flex items-center justify-center active:scale-90"
            aria-label="Zoom Out"
            title="Zoom Out (−)"
          >
            <Minus className="w-4 h-4 font-bold" />
          </button>

          {/* Reset / Home (⌂) */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-3 text-stone-200 hover:text-emerald-400 hover:bg-white/10 transition-colors flex items-center justify-center active:scale-90"
            aria-label="Reset Map View"
            title="Reset to World View (⌂)"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================
            4. RESPONSIVE RIGHT-SIDE DESTINATION PANEL
        ======================================================== */}
        {/* Minimized floating button when panel is collapsed */}
        {isPanelCollapsed && (
          <button
            type="button"
            onClick={() => setIsPanelCollapsed(false)}
            className="absolute top-3 right-3 z-30 px-3.5 py-2 rounded-2xl bg-stone-950/90 backdrop-blur-2xl border border-emerald-500/40 text-white shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="text-lg">{activeDestination.flag}</span>
            <div className="text-left">
              <span className="text-xs font-black block text-emerald-400">
                {activeDestination.name}
              </span>
              <span className="text-[10px] text-stone-300">
                Show Destination Card ▾
              </span>
            </div>
          </button>
        )}

        <AnimatePresence>
          {!isPanelCollapsed && activeDestination && (
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="absolute top-3 right-3 bottom-36 sm:bottom-36 w-80 sm:w-92 max-w-[calc(100%-1.5rem)] bg-stone-950/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden text-white"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{activeDestination.flag}</span>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-wide text-white">
                        {activeDestination.name}
                      </h3>
                      <span className="text-[10px] text-emerald-400 font-bold block">
                        {activeDestination.stateOrRegion}, {activeDestination.country}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPanelCollapsed(true)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-400 hover:text-white transition-colors"
                    title="Minimize Panel"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Destination Card Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {/* Hero Photo */}
                <div className="relative h-36 rounded-xl overflow-hidden border border-white/15">
                  <img
                    src={activeDestination.image}
                    alt={activeDestination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/80 text-[10px] font-black text-emerald-300 backdrop-blur-md">
                    {activeDestination.isAvailableInApp ? '⭐ Active Hub' : '🌍 World Discovery'}
                  </span>
                </div>

                {/* Subtitle */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">
                    Gateway Summary
                  </span>
                  <p className="text-xs text-stone-200 font-medium leading-relaxed">
                    {activeDestination.subtitle}
                  </p>
                </div>

                {/* Hidden Gem Highlight */}
                {activeDestination.hiddenGemHighlight && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Hidden Gem Highlight</span>
                    </span>
                    <p className="text-xs text-emerald-100 font-semibold">
                      {activeDestination.hiddenGemHighlight}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {activeDestination.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeDestination.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/10 text-stone-300 border border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Panel Footer CTA */}
              <div className="p-3.5 border-t border-white/10 bg-stone-900/80 flex items-center justify-between gap-2 shrink-0">
                <span className="text-[10px] text-stone-300 font-medium">
                  {activeDestination.isAvailableInApp
                    ? '✓ Full Itinerary Ready'
                    : 'Global Off-Beat Spot'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (activeDestination.slug) {
                      onSelectDestination(activeDestination.slug);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1 shadow-md shadow-emerald-950 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Explore Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
