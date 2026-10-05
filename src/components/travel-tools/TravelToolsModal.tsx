'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Plane,
  Train,
  Bus,
  Car,
  Building,
  Home,
  Compass,
  Mountain,
  Palmtree,
  Landmark,
  Calendar,
  Users,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Fuel,
  Coins,
  Utensils,
  Camera,
  Coffee,
  Navigation,
  Languages,
  Check,
  DollarSign
} from 'lucide-react';

import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import {
  TravelToolMode,
  DESTINATION_TRANSIT_HUBS,
  searchFlights,
  searchTrains,
  searchBuses,
  planRoadTrip,
  searchHotels,
  searchHomestays,
  searchGuides,
  searchTreks,
  searchBeaches,
  searchHeritage,
  FlightOption,
  TrainOption,
  BusOption,
  RoadTripPlan,
  HotelOption,
  HomestayOption,
  GuideOption,
  TrekOption,
  BeachOption,
  HeritageOption,
} from '@/lib/services/travelToolsService';

interface TravelToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: TravelToolMode;
}

const TRAVEL_MODES: Array<{
  id: TravelToolMode;
  label: string;
  icon: string;
  lucideIcon: any;
  tagline: string;
}> = [
  { id: 'flights', label: 'Flights', icon: '✈️', lucideIcon: Plane, tagline: 'Direct & connecting regional flights' },
  { id: 'trains', label: 'Trains', icon: '🚆', lucideIcon: Train, tagline: 'IRCTC trains, express & local junctions' },
  { id: 'buses', label: 'Buses', icon: '🚌', lucideIcon: Bus, tagline: 'State RTC & luxury sleeper buses' },
  { id: 'roadtrips', label: 'Road Trips', icon: '🚗', lucideIcon: Car, tagline: 'AI scenic routes, fuel & hidden stops' },
  { id: 'hotels', label: 'Hotels', icon: '🏨', lucideIcon: Building, tagline: 'Verified eco-stays, resorts & boutique hotels' },
  { id: 'homestays', label: 'Homestays', icon: '🏡', lucideIcon: Home, tagline: 'Local hosted heritage homes & farmsteads' },
  { id: 'guides', label: 'Local Guides', icon: '🧭', lucideIcon: Compass, tagline: 'Government-verified regional culture experts' },
  { id: 'trekking', label: 'Trekking', icon: '🥾', lucideIcon: Mountain, tagline: 'Trails, elevation, safety & weather status' },
  { id: 'beaches', label: 'Beaches', icon: '🏖️', lucideIcon: Palmtree, tagline: 'Destination-aware coastlines & serene shores' },
  { id: 'heritage', label: 'Heritage', icon: '🏛️', lucideIcon: Landmark, tagline: 'Ancient temples, forts & architecture' },
];

export function TravelToolsModal({ isOpen, onClose, initialMode = 'trains' }: TravelToolsModalProps) {
  const {
    getSelectedDestination,
    selectedDestinationSlug,
    preferences,
    updatePreferences,
    activeTrip,
    generateItineraryFromState,
    addBookingToTrip,
    setTranslatorOpen,
    weatherRainOverride
  } = useAppStore();

  const destination = getSelectedDestination();
  const transitHub = DESTINATION_TRANSIT_HUBS[destination.slug] || DESTINATION_TRANSIT_HUBS.tirupati;

  const [activeTab, setActiveTab] = useState<TravelToolMode>(initialMode);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'rating' | 'duration'>('recommended');
  
  // Feedback Toast & Budget Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [budgetAlert, setBudgetAlert] = useState<{
    show: boolean;
    exceededBy: number;
    totalCost: number;
    budget: number;
  } | null>(null);

  // Sync initialMode when opening
  useEffect(() => {
    if (isOpen && initialMode) {
      setActiveTab(initialMode);
    }
  }, [isOpen, initialMode]);

  // Form states per travel mode (prefilled with selected destination)
  // 1. Flights
  const [flightForm, setFlightForm] = useState({
    from: 'Bangalore (BLR)',
    to: transitHub.airport,
    journeyDate: '2026-10-18',
    returnDate: '',
    travellers: preferences.groupSize || 2,
    cabinClass: 'Economy' as const,
    tripType: 'One Way' as const,
  });

  // 2. Trains
  const [trainForm, setTrainForm] = useState({
    from: 'KSR Bengaluru (SBC)',
    to: transitHub.railStation,
    journeyDate: '2026-10-18',
    passengers: preferences.groupSize || 4,
    trainClass: '3A' as const,
    quota: 'General' as const,
  });

  // 3. Buses
  const [busForm, setBusForm] = useState({
    from: 'Majestic Bus Terminal, Bengaluru',
    to: transitHub.busStand,
    travelDate: '2026-10-18',
    passengers: preferences.groupSize || 4,
    busType: 'All' as const,
    departureWindow: 'Any Time' as const,
  });

  // 4. Road Trips
  const [roadTripForm, setRoadTripForm] = useState({
    startLocation: 'Bengaluru',
    destination: destination.name,
    travelDate: '2026-10-18',
    people: preferences.groupSize || 4,
    budgetInr: preferences.totalBudgetInr || 10000,
    travelStyle: 'Scenic' as const,
  });

  // 5. Hotels
  const [hotelForm, setHotelForm] = useState({
    destination: destination.name,
    checkIn: '2026-10-18',
    checkOut: '2026-10-20',
    guests: preferences.groupSize || 4,
    rooms: Math.ceil((preferences.groupSize || 4) / 2),
    budgetMin: 1000,
    budgetMax: 7000,
    stayType: 'All' as const,
  });

  // 6. Homestays
  const [homestayForm, setHomestayForm] = useState({
    destination: destination.name,
    checkIn: '2026-10-18',
    checkOut: '2026-10-20',
    guests: preferences.groupSize || 4,
    budgetInr: 4500,
    propertyType: 'All' as const,
  });

  // 7. Guides
  const [guideForm, setGuideForm] = useState({
    destination: destination.name,
    date: '2026-10-18',
    duration: 'Half Day (4 hrs)' as const,
    language: 'Telugu & English',
    specialization: 'History & Spiritual Rituals',
  });

  // 8. Treks
  const [trekForm, setTrekForm] = useState({
    destination: destination.name,
    date: '2026-10-18',
    difficulty: 'All' as const,
    duration: 'All' as const,
    preference: 'All' as const,
  });

  // 9. Beaches
  const [beachForm, setBeachForm] = useState({
    destination: destination.name,
    date: '2026-10-18',
    travelRadiusKm: 120,
    crowdPreference: 'Low' as const,
    activity: 'Sunset & Nature Strolls',
  });

  // 10. Heritage
  const [heritageForm, setHeritageForm] = useState({
    destination: destination.name,
    date: '2026-10-18',
    interest: 'All' as const,
  });

  // Automatically update destination when selected destination changes
  useEffect(() => {
    const hub = DESTINATION_TRANSIT_HUBS[destination.slug] || DESTINATION_TRANSIT_HUBS.tirupati;
    setFlightForm((prev) => ({ ...prev, to: hub.airport }));
    setTrainForm((prev) => ({ ...prev, to: hub.railStation }));
    setBusForm((prev) => ({ ...prev, to: hub.busStand }));
    setRoadTripForm((prev) => ({ ...prev, destination: destination.name }));
    setHotelForm((prev) => ({ ...prev, destination: destination.name }));
    setHomestayForm((prev) => ({ ...prev, destination: destination.name }));
    setGuideForm((prev) => ({ ...prev, destination: destination.name }));
    setTrekForm((prev) => ({ ...prev, destination: destination.name }));
    setBeachForm((prev) => ({ ...prev, destination: destination.name }));
    setHeritageForm((prev) => ({ ...prev, destination: destination.name }));
  }, [destination.slug, destination.name]);

  // Search Results Cache / Computed
  const [isSearching, setIsSearching] = useState(false);

  // Trigger search computation
  const flightsData = useMemo(() => searchFlights(flightForm), [flightForm]);
  const trainsData = useMemo(() => searchTrains(trainForm), [trainForm]);
  const busesData = useMemo(() => searchBuses(busForm), [busForm]);
  const roadTripData = useMemo(() => planRoadTrip(roadTripForm), [roadTripForm]);
  const hotelsData = useMemo(() => searchHotels(hotelForm), [hotelForm]);
  const homestaysData = useMemo(() => searchHomestays(homestayForm), [homestayForm]);
  const guidesData = useMemo(() => searchGuides(guideForm), [guideForm]);
  const treksData = useMemo(() => {
    // If rain simulation is active in admin, pass it
    const rain = weatherRainOverride[destination.slug] || 0;
    return searchTreks({ ...trekForm, destination: destination.name }, rain > 60);
  }, [trekForm, destination.slug, destination.name, weatherRainOverride]);
  const beachesData = useMemo(() => searchBeaches(beachForm), [beachForm]);
  const heritageData = useMemo(() => searchHeritage(heritageForm), [heritageForm]);

  // Generic handler for "+ Add to My Trip"
  const handleAddToTrip = (item: {
    title: string;
    category: 'Transport' | 'Stay' | 'Guide' | 'Activities' | 'Dining';
    costInr: number;
    details?: string;
    locationName?: string;
  }) => {
    const res = addBookingToTrip(item);
    
    // Toast notification
    setToastMessage(`✓ Added "${item.title}" (${formatCurrency(item.costInr)}) to your Trip Itinerary!`);
    setTimeout(() => setToastMessage(null), 4000);

    // Budget Alert check
    if (res.exceededBy > 0) {
      setBudgetAlert({
        show: true,
        exceededBy: res.exceededBy,
        totalCost: res.totalCost,
        budget: res.budget,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-stone-950/95 border border-white/20 rounded-3xl shadow-2xl overflow-hidden text-stone-100"
      >
        {/* ========================================================
            MODAL HEADER & CONTEXT
        ======================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-white/10 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xl">
              {TRAVEL_MODES.find((m) => m.id === activeTab)?.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {TRAVEL_MODES.find((m) => m.id === activeTab)?.label} Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Fully Functional Tool
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {TRAVEL_MODES.find((m) => m.id === activeTab)?.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Destination Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-stone-300">
                Inherited Destination: <strong className="text-white">{destination.name}</strong> ({destination.state})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
              aria-label="Close Travel Tool"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB SELECTOR RIBBON (ALL 10 TRAVEL MODES)
        ======================================================== */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto border-b border-white/10 bg-stone-900/60 no-scrollbar">
          {TRAVEL_MODES.map((mode) => {
            const isActive = activeTab === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setActiveTab(mode.id);
                  setBudgetAlert(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 border border-emerald-400/50'
                    : 'bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/5'
                }`}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TOAST NOTIFICATION (Add to Trip feedback)
        ======================================================== */}
        {toastMessage && (
          <div className="bg-emerald-600/90 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top border-b border-emerald-400/40">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{toastMessage}</span>
            </div>
            <Link
              href="/plan-trip"
              onClick={onClose}
              className="underline hover:text-emerald-100 font-bold ml-4"
            >
              Open My Trip →
            </Link>
          </div>
        )}

        {/* ========================================================
            BUDGET ALERT WARNING (If Total Exceeds User's Budget)
        ======================================================== */}
        {budgetAlert?.show && (
          <div className="bg-amber-950/95 border-b border-amber-500/50 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-100 font-black block">⚠️ Budget Alert</strong>
                <span>
                  Your selected options now estimate{' '}
                  <strong className="text-white">{formatCurrency(budgetAlert.totalCost)}</strong>, which
                  exceeds your set budget of <strong className="text-white">{formatCurrency(budgetAlert.budget)}</strong>{' '}
                  by <strong className="text-amber-300">{formatCurrency(budgetAlert.exceededBy)}</strong>.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setSortBy('price_low');
                  setBudgetAlert(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-bold transition-all text-xs"
              >
                [ FIND CHEAPER ALTERNATIVES ]
              </button>
              <button
                onClick={() => setBudgetAlert(null)}
                className="text-stone-400 hover:text-white px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL SCROLLABLE CONTENT BODY
        ======================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ==================== 1. FLIGHTS ==================== */}
          {activeTab === 'flights' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5" /> Flight Search Engine
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Destination: <strong className="text-white">{transitHub.airportCode}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">From (Airport / City)</label>
                    <input
                      type="text"
                      value={flightForm.from}
                      onChange={(e) => setFlightForm({ ...flightForm, from: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">To (Airport / City)</label>
                    <input
                      type="text"
                      value={flightForm.to}
                      onChange={(e) => setFlightForm({ ...flightForm, to: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Journey Date</label>
                    <input
                      type="date"
                      value={flightForm.journeyDate}
                      onChange={(e) => setFlightForm({ ...flightForm, journeyDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Return Date (Optional)</label>
                    <input
                      type="date"
                      value={flightForm.returnDate}
                      onChange={(e) => setFlightForm({ ...flightForm, returnDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-stone-400 mb-1">Travellers (Adults)</label>
                    <select
                      value={flightForm.travellers}
                      onChange={(e) => setFlightForm({ ...flightForm, travellers: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Traveller{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Cabin Class</label>
                    <select
                      value={flightForm.cabinClass}
                      onChange={(e) => setFlightForm({ ...flightForm, cabinClass: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="Economy">Economy</option>
                      <option value="Premium Economy">Premium Economy</option>
                      <option value="Business">Business</option>
                      <option value="First">First</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Trip Type</label>
                    <select
                      value={flightForm.tripType}
                      onChange={(e) => setFlightForm({ ...flightForm, tripType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="One Way">One Way</option>
                      <option value="Round Trip">Round Trip</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Recommendation Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-stone-900 border border-emerald-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  {flightsData.aiRecommendation}
                </p>
              </div>

              {/* Results List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Available Connections ({flightsData.results.length})</span>
                  <span className="text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    Demo availability (Regional DGCA sandbox)
                  </span>
                </div>

                {flightsData.results.map((flight) => (
                  <div
                    key={flight.id}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl">{flight.logo}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{flight.airline}</h4>
                          <span className="text-xs text-stone-400 font-mono">({flight.flightNumber})</span>
                          {flight.isBestValue && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              Best Value
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-300 mt-1">
                          <span>{flight.departureTime} ({flight.fromAirport.split(' ')[0]})</span>
                          <span className="text-stone-500">→</span>
                          <span>{flight.arrivalTime} ({flight.toAirport.split(' ')[0]})</span>
                          <span className="text-stone-400 font-mono">({flight.duration}, {flight.stops})</span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-3">
                          <span>🧳 {flight.baggage}</span>
                          <span>🌱 {flight.co2Kg} kg CO₂</span>
                          <span className="text-emerald-400 font-medium">💺 {flight.seatsLeft} seats left</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                      <div className="text-right">
                        <span className="text-lg font-black text-white block">
                          {formatCurrency(flight.priceInr)}
                        </span>
                        <span className="text-[10px] text-stone-400">per traveller</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleAddToTrip({
                              title: `Flight: ${flight.airline} (${flight.flightNumber})`,
                              category: 'Transport',
                              costInr: flight.priceInr * flightForm.travellers,
                              details: `${flight.fromAirport} to ${flight.toAirport} • ${flight.departureTime}`,
                              locationName: flight.toAirport,
                            })
                          }
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          + ADD TO MY TRIP
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 2. TRAINS ==================== */}
          {activeTab === 'trains' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5" /> Train Search (IRCTC Railway Engine)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Junction: <strong className="text-white">{transitHub.railStation}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">From Station</label>
                    <input
                      type="text"
                      value={trainForm.from}
                      onChange={(e) => setTrainForm({ ...trainForm, from: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">To Station</label>
                    <input
                      type="text"
                      value={trainForm.to}
                      onChange={(e) => setTrainForm({ ...trainForm, to: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Journey Date</label>
                    <input
                      type="date"
                      value={trainForm.journeyDate}
                      onChange={(e) => setTrainForm({ ...trainForm, journeyDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Passengers</label>
                    <select
                      value={trainForm.passengers}
                      onChange={(e) => setTrainForm({ ...trainForm, passengers: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Passenger{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-stone-400 mb-1">Class</label>
                    <select
                      value={trainForm.trainClass}
                      onChange={(e) => setTrainForm({ ...trainForm, trainClass: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="General">General (Unreserved)</option>
                      <option value="Sleeper">Sleeper (SL)</option>
                      <option value="3A">AC 3 Tier (3A)</option>
                      <option value="2A">AC 2 Tier (2A)</option>
                      <option value="1A">AC 1st Class (1A)</option>
                      <option value="Chair Car">AC Chair Car (CC)</option>
                      <option value="Executive Chair Car">Executive Chair Car (EC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Quota</label>
                    <select
                      value={trainForm.quota}
                      onChange={(e) => setTrainForm({ ...trainForm, quota: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="General">General Quota</option>
                      <option value="Tatkal">Tatkal Quota</option>
                      <option value="Ladies">Ladies Quota</option>
                      <option value="Senior Citizen">Senior Citizen</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-stone-900 border border-emerald-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  {trainsData.aiRecommendation}
                </p>
              </div>

              {/* Results List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Available Express & Superfast Services ({trainsData.results.length})</span>
                  <span className="text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    Demo availability (IRCTC Sandbox)
                  </span>
                </div>

                {trainsData.results.map((train) => (
                  <div
                    key={train.id}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{train.trainName}</h4>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-stone-300 font-mono text-xs">
                            #{train.trainNumber}
                          </span>
                          {train.isRecommended && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                              Fastest & Direct
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400">Runs On: {train.runsOn} • Pantry: {train.pantryAvailable ? '✓ Onboard Food' : 'Station Vendors'}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="text-right">
                          <span className="font-bold text-white">{train.departureTime}</span>
                          <span className="text-stone-400 block text-[10px]">{train.fromStation.split(' ')[0]}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-stone-400 font-mono">{train.duration}</span>
                          <span className="text-stone-500">━━━━━━►</span>
                        </div>
                        <div>
                          <span className="font-bold text-white">{train.arrivalTime}</span>
                          <span className="text-stone-400 block text-[10px]">{train.toStation.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Classes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      {train.classes.map((cls) => (
                        <div
                          key={cls.className}
                          className="p-2.5 rounded-xl bg-stone-900/80 border border-white/10 hover:border-emerald-500/50 transition-colors flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{cls.className}</span>
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              {formatCurrency(cls.fareInr)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-emerald-300">
                              {cls.availability}
                            </span>
                            <button
                              onClick={() =>
                                handleAddToTrip({
                                  title: `Train: ${train.trainName} (${train.trainNumber}) [${cls.className}]`,
                                  category: 'Transport',
                                  costInr: cls.fareInr * trainForm.passengers,
                                  details: `${train.fromStation} to ${train.toStation} • ${train.departureTime}`,
                                  locationName: train.toStation,
                                })
                              }
                              className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-white font-bold text-[10px] transition-all"
                            >
                              + ADD TO TRIP
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 3. BUSES ==================== */}
          {activeTab === 'buses' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Bus className="w-3.5 h-3.5" /> Bus Search (RTC & Luxury Fleet)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Terminal: <strong className="text-white">{transitHub.busStand}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">From (City / Bus Stand)</label>
                    <input
                      type="text"
                      value={busForm.from}
                      onChange={(e) => setBusForm({ ...busForm, from: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">To (City / Bus Stand)</label>
                    <input
                      type="text"
                      value={busForm.to}
                      onChange={(e) => setBusForm({ ...busForm, to: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Travel Date</label>
                    <input
                      type="date"
                      value={busForm.travelDate}
                      onChange={(e) => setBusForm({ ...busForm, travelDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Passengers</label>
                    <select
                      value={busForm.passengers}
                      onChange={(e) => setBusForm({ ...busForm, passengers: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Passenger{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-stone-400 mb-1">Bus Type</label>
                    <select
                      value={busForm.busType}
                      onChange={(e) => setBusForm({ ...busForm, busType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="All">All Bus Types</option>
                      <option value="AC">AC Sleeper / Seater</option>
                      <option value="Non-AC">Non-AC Express</option>
                      <option value="Sleeper">Sleeper (2+1)</option>
                      <option value="Volvo Multi-Axle">Volvo Multi-Axle</option>
                      <option value="Government Bus">Government RTC (APSRTC / KSRTC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Departure Window</label>
                    <select
                      value={busForm.departureWindow}
                      onChange={(e) => setBusForm({ ...busForm, departureWindow: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="Any Time">Any Time</option>
                      <option value="Morning">Morning (06:00 AM - 12:00 PM)</option>
                      <option value="Afternoon">Afternoon (12:00 PM - 05:00 PM)</option>
                      <option value="Evening">Evening (05:00 PM - 09:00 PM)</option>
                      <option value="Night">Night (09:00 PM - 06:00 AM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-stone-900 border border-emerald-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  {busesData.aiRecommendation}
                </p>
              </div>

              {/* Results List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Available Bus Services ({busesData.results.length})</span>
                  <span className="text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    Demo availability (RTC aggregator)
                  </span>
                </div>

                {busesData.results.map((bus) => (
                  <div
                    key={bus.id}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{bus.operator}</h4>
                        {bus.isGovtBus && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Govt RTC
                          </span>
                        )}
                        <span className="text-xs text-amber-400 font-bold">★ {bus.rating}</span>
                      </div>
                      <span className="text-xs text-stone-300 block mt-0.5">{bus.busType}</span>
                      <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                        <span>{bus.departureTime} ({bus.fromLocation.split(',')[0]})</span>
                        <span>→</span>
                        <span>{bus.arrivalTime} ({bus.toLocation.split(',')[0]})</span>
                        <span className="font-mono">({bus.duration})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {bus.amenities.map((amenity) => (
                          <span key={amenity} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-900 text-stone-300 border border-white/5">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                      <div className="text-right">
                        <span className="text-lg font-black text-white block">
                          {formatCurrency(bus.priceInr)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">{bus.seatsAvailable} Seats Left</span>
                      </div>

                      <button
                        onClick={() =>
                          handleAddToTrip({
                            title: `Bus: ${bus.operator} (${bus.busType})`,
                            category: 'Transport',
                            costInr: bus.priceInr * busForm.passengers,
                            details: `${bus.fromLocation} to ${bus.toLocation} • Departs ${bus.departureTime}`,
                            locationName: bus.toLocation,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        + ADD TO MY TRIP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 4. ROAD TRIPS (AI ROAD TRIP PLANNER) ==================== */}
          {activeTab === 'roadtrips' && (
            <div className="space-y-6">
              {/* Search / Generator Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5" /> AI Road Trip Planner
                  </span>
                  <span className="text-[11px] text-stone-400">
                    End Destination: <strong className="text-white">{destination.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Start Location</label>
                    <input
                      type="text"
                      value={roadTripForm.startLocation}
                      onChange={(e) => setRoadTripForm({ ...roadTripForm, startLocation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Destination</label>
                    <input
                      type="text"
                      value={roadTripForm.destination}
                      onChange={(e) => setRoadTripForm({ ...roadTripForm, destination: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Travel Date</label>
                    <input
                      type="date"
                      value={roadTripForm.travelDate}
                      onChange={(e) => setRoadTripForm({ ...roadTripForm, travelDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-stone-400 mb-1">Number of People</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={roadTripForm.people}
                      onChange={(e) => setRoadTripForm({ ...roadTripForm, people: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Trip Budget (₹)</label>
                    <input
                      type="number"
                      step={500}
                      value={roadTripForm.budgetInr}
                      onChange={(e) => setRoadTripForm({ ...roadTripForm, budgetInr: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Travel Style</label>
                    <select
                      value={roadTripForm.travelStyle}
                      onChange={(e) => setRoadTripForm({ ...roadTripForm, travelStyle: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="Scenic">Scenic Highway & Ghats</option>
                      <option value="Fastest">Fastest Express Corridors</option>
                      <option value="Hidden Gems">Hidden Gems & Offbeat Detours</option>
                      <option value="Adventure">Adventure & Rough Terrain</option>
                      <option value="Family">Family Friendly with Clean Rest Stops</option>
                      <option value="Photography">Photography & Sunset Viewpoints</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Generated Road Trip Plan */}
              {roadTripData.plan && (
                <div className="space-y-4">
                  {/* Summary Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-stone-900 to-stone-950 border border-emerald-500/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                          AI Generated Expedition
                        </span>
                        <h3 className="text-lg font-black text-white">{roadTripData.plan.routeTitle}</h3>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Recommended Vehicle: <strong className="text-stone-200">{roadTripData.plan.recommendedVehicle}</strong> • Highways: {roadTripData.plan.highwayNames.join(' + ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleAddToTrip({
                              title: `Road Trip: ${roadTripData.plan.origin} to ${roadTripData.plan.destination}`,
                              category: 'Transport',
                              costInr: roadTripData.plan.totalTripTransitCostInr,
                              details: `${roadTripData.plan.totalDistanceKm} km • Fuel: ₹${roadTripData.plan.fuelEstimateInr} • Tolls: ₹${roadTripData.plan.tollEstimateInr}`,
                              locationName: roadTripData.plan.destination,
                            })
                          }
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all"
                        >
                          <PlusCircle className="w-4 h-4" />
                          + ADD ROAD TRIP TO MY TRIP
                        </button>
                      </div>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <Navigation className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                        <span className="text-xs text-stone-400 block">Distance</span>
                        <span className="text-sm font-black text-white">{roadTripData.plan.totalDistanceKm} km</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                        <span className="text-xs text-stone-400 block">Driving Time</span>
                        <span className="text-sm font-black text-white">{roadTripData.plan.drivingTimeFormatted}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <Fuel className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                        <span className="text-xs text-stone-400 block">Est. Fuel Cost</span>
                        <span className="text-sm font-black text-white">{formatCurrency(roadTripData.plan.fuelEstimateInr)}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <Coins className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                        <span className="text-xs text-stone-400 block">Fastag Tolls</span>
                        <span className="text-sm font-black text-white">{formatCurrency(roadTripData.plan.tollEstimateInr)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Curated Stops & En-Route Points */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <Utensils className="w-3.5 h-3.5" /> Iconic Food Stops
                      </span>
                      {roadTripData.plan.foodStops.map((stop) => (
                        <div key={stop.name} className="p-2 rounded-xl bg-stone-900 border border-white/5">
                          <strong className="text-white block">{stop.name}</strong>
                          <span className="text-stone-400 text-[11px]">{stop.specialty} (at {stop.kmMarker} km)</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <Camera className="w-3.5 h-3.5" /> Scenic Viewpoints
                      </span>
                      {roadTripData.plan.viewpoints.map((vp) => (
                        <div key={vp.name} className="p-2 rounded-xl bg-stone-900 border border-white/5">
                          <strong className="text-white block">{vp.name}</strong>
                          <span className="text-stone-400 text-[11px]">{vp.highlight} (at {vp.kmMarker} km)</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <span className="font-bold text-blue-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <Coffee className="w-3.5 h-3.5" /> Clean Rest Stops
                      </span>
                      {roadTripData.plan.restStops.map((rs) => (
                        <div key={rs.name} className="p-2 rounded-xl bg-stone-900 border border-white/5">
                          <strong className="text-white block">{rs.name}</strong>
                          <span className="text-stone-400 text-[11px]">{rs.facilities} (at {rs.kmMarker} km)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 💎 HIDDEN GEMS ALONG YOUR ROUTE */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-stone-900 to-stone-950 border border-emerald-500/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-black text-white text-sm">
                          💎 Hidden Gems Along Your Route
                        </h4>
                      </div>
                      <span className="text-[11px] text-emerald-300">
                        Direct connection to HiddenGem AI engine
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {roadTripData.plan.hiddenGemsAlongRoute.map((gem) => (
                        <div
                          key={gem.id}
                          className="p-3 rounded-xl bg-stone-900/90 border border-white/10 flex items-start justify-between gap-3"
                        >
                          <div>
                            <strong className="text-white text-xs block">{gem.name}</strong>
                            <span className="text-[11px] text-stone-400 line-clamp-1">{gem.subtitle}</span>
                            <span className="text-[10px] text-emerald-400 mt-1 block">
                              Crowd: {gem.crowdData.level} • Eco Score: {gem.ecoScore}/100
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleAddToTrip({
                                title: `En-Route Gem: ${gem.name}`,
                                category: 'Activities',
                                costInr: gem.estimatedCostInr * roadTripForm.people,
                                details: gem.subtitle,
                                locationName: gem.name,
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-600 text-white font-bold text-[10px] shrink-0 transition-colors"
                          >
                            + ADD GEM
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 5. HOTELS & RESORTS ==================== */}
          {activeTab === 'hotels' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> Stay Search (Hotels & Resorts)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Location: <strong className="text-white">{destination.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Destination</label>
                    <input
                      type="text"
                      value={hotelForm.destination}
                      onChange={(e) => setHotelForm({ ...hotelForm, destination: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={hotelForm.checkIn}
                      onChange={(e) => setHotelForm({ ...hotelForm, checkIn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={hotelForm.checkOut}
                      onChange={(e) => setHotelForm({ ...hotelForm, checkOut: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Guests & Rooms</label>
                    <div className="flex gap-2">
                      <select
                        value={hotelForm.guests}
                        onChange={(e) => setHotelForm({ ...hotelForm, guests: Number(e.target.value) })}
                        className="w-1/2 px-2.5 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                      >
                        {[1, 2, 3, 4, 6, 8].map((g) => (
                          <option key={g} value={g}>{g} Guests</option>
                        ))}
                      </select>
                      <select
                        value={hotelForm.rooms}
                        onChange={(e) => setHotelForm({ ...hotelForm, rooms: Number(e.target.value) })}
                        className="w-1/2 px-2.5 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                      >
                        {[1, 2, 3, 4].map((r) => (
                          <option key={r} value={r}>{r} Room{r > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-stone-400 mb-1">Budget Range (₹/Night)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step={500}
                        value={hotelForm.budgetMin}
                        onChange={(e) => setHotelForm({ ...hotelForm, budgetMin: Number(e.target.value) })}
                        className="w-1/2 px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                        placeholder="Min"
                      />
                      <span className="text-stone-500">–</span>
                      <input
                        type="number"
                        step={500}
                        value={hotelForm.budgetMax}
                        onChange={(e) => setHotelForm({ ...hotelForm, budgetMax: Number(e.target.value) })}
                        className="w-1/2 px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Preference</label>
                    <select
                      value={hotelForm.stayType}
                      onChange={(e) => setHotelForm({ ...hotelForm, stayType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="All">All Stays</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Resort">Resort & Spa</option>
                      <option value="Budget">Budget Friendly</option>
                      <option value="Luxury">Luxury Heritage</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-stone-900 border border-emerald-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  {hotelsData.aiRecommendation}
                </p>
              </div>

              {/* Results List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Available Verified Stays ({hotelsData.results.length})</span>
                  <span className="text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                    Demo availability (OTA Sandbox)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotelsData.results.map((hotel) => (
                    <div
                      key={hotel.id}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex gap-3.5">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-24 h-24 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm line-clamp-1">{hotel.name}</h4>
                            {hotel.isAiRecommended && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                                AI Top Pick
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-amber-400 font-bold block mt-0.5">
                            ★ {hotel.rating} ({hotel.reviewCount} reviews) • {hotel.type}
                          </span>
                          <span className="text-[11px] text-stone-400 block mt-0.5">
                            {hotel.distanceFromAttractionKm} km from temple/hub • {hotel.roomType}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
                            {hotel.freeCancellation ? '✓ Free Cancellation' : 'Non-refundable'} • {hotel.breakfastIncluded ? '✓ Breakfast Included' : 'Meals a la carte'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 text-[10px] text-stone-300">
                        {hotel.amenities.map((a) => (
                          <span key={a} className="px-2 py-0.5 rounded bg-stone-900 border border-white/5">
                            {a}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div>
                          <span className="text-lg font-black text-white block">
                            {formatCurrency(hotel.pricePerNightInr)}
                          </span>
                          <span className="text-[10px] text-stone-400">per night + taxes</span>
                        </div>

                        <button
                          onClick={() =>
                            handleAddToTrip({
                              title: `Stay: ${hotel.name}`,
                              category: 'Stay',
                              costInr: hotel.pricePerNightInr * hotelForm.rooms,
                              details: `${hotel.roomType} • ${hotelForm.rooms} Room(s) • ${hotel.distanceFromAttractionKm} km from hub`,
                              locationName: hotel.name,
                            })
                          }
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          + ADD TO MY TRIP
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 6. HOMESTAYS ==================== */}
          {activeTab === 'homestays' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" /> Homestay Finder (Authentic Local Hosts)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Destination: <strong className="text-white">{destination.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Destination</label>
                    <input
                      type="text"
                      value={homestayForm.destination}
                      onChange={(e) => setHomestayForm({ ...homestayForm, destination: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={homestayForm.checkIn}
                      onChange={(e) => setHomestayForm({ ...homestayForm, checkIn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={homestayForm.checkOut}
                      onChange={(e) => setHomestayForm({ ...homestayForm, checkOut: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Property Type</label>
                    <select
                      value={homestayForm.propertyType}
                      onChange={(e) => setHomestayForm({ ...homestayForm, propertyType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="All">All Properties</option>
                      <option value="Heritage Courtyard">Heritage Courtyard (Thotti Mane)</option>
                      <option value="Plantation Cottage">Plantation Cottage</option>
                      <option value="Organic Farmstead">Organic Farmstead</option>
                      <option value="Village Haven">Village Haven</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-stone-900 border border-emerald-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  {homestaysData.aiRecommendation}
                </p>
              </div>

              {/* Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homestaysData.results.map((stay) => (
                  <div
                    key={stay.id}
                    className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex gap-3.5">
                        <img
                          src={stay.image}
                          alt={stay.name}
                          className="w-24 h-24 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">{stay.name}</h4>
                          <span className="text-xs text-emerald-400 font-medium block mt-0.5">
                            Host: {stay.hostName} • ★ {stay.rating} ({stay.reviewCount} reviews)
                          </span>
                          <span className="text-[11px] text-stone-400 block mt-0.5">
                            📍 {stay.location} ({stay.distanceKm} km out)
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 p-3 rounded-xl bg-stone-900/90 border border-white/5 space-y-1.5 text-xs">
                        <span className="text-amber-300 font-bold block text-[11px]">
                          🏡 Local Experience:
                        </span>
                        <p className="text-stone-300 text-[11px] leading-relaxed">
                          {stay.localExperience}
                        </p>
                        <span className="text-emerald-300 font-bold block text-[11px] pt-1">
                          🤖 Why AI Recommends:
                        </span>
                        <p className="text-stone-400 text-[11px] leading-relaxed">
                          {stay.aiWhyRecommended}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <span className="text-lg font-black text-white block">
                          {formatCurrency(stay.pricePerNightInr)}
                        </span>
                        <span className="text-[10px] text-stone-400">per night with home meals</span>
                      </div>

                      <button
                        onClick={() =>
                          handleAddToTrip({
                            title: `Homestay: ${stay.name} (Host: ${stay.hostName})`,
                            category: 'Stay',
                            costInr: stay.pricePerNightInr,
                            details: `Hosted by ${stay.hostName} • ${stay.location}`,
                            locationName: stay.name,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        + ADD TO MY TRIP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 7. LOCAL GUIDES ==================== */}
          {activeTab === 'guides' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" /> Find a Local Guide (Verified Cultural Specialists)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Location: <strong className="text-white">{destination.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Destination</label>
                    <input
                      type="text"
                      value={guideForm.destination}
                      onChange={(e) => setGuideForm({ ...guideForm, destination: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={guideForm.date}
                      onChange={(e) => setGuideForm({ ...guideForm, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Duration</label>
                    <select
                      value={guideForm.duration}
                      onChange={(e) => setGuideForm({ ...guideForm, duration: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="2 hours">2 hours (Express Site Briefing)</option>
                      <option value="Half Day (4 hrs)">Half Day (4 hrs Deep Tour)</option>
                      <option value="Full Day (8 hrs)">Full Day (8 hrs Immersive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Language</label>
                    <select
                      value={guideForm.language}
                      onChange={(e) => setGuideForm({ ...guideForm, language: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="Telugu & English">Telugu & English</option>
                      <option value="Hindi & English">Hindi & English</option>
                      <option value="Tamil, Telugu & English">Tamil, Telugu & English</option>
                      <option value="Kannada, Hindi & English">Kannada, Hindi & English</option>
                      <option value="Malayalam & English">Malayalam & English</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-stone-900 border border-emerald-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  {guidesData.aiRecommendation}
                </p>
              </div>

              {/* Guides Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guidesData.results.map((guide) => (
                  <div
                    key={guide.id}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="flex gap-3.5">
                      <img
                        src={guide.photo}
                        alt={guide.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{guide.name}</h4>
                          {guide.verified && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-amber-400 font-bold block mt-0.5">
                          ★ {guide.rating} ({guide.reviewCount} tours) • {guide.experienceYears} yrs experience
                        </span>
                        <span className="text-[11px] text-stone-300 block mt-0.5">
                          Specialization: <strong>{guide.specialization}</strong>
                        </span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          Languages: {guide.languages.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <span className="text-lg font-black text-white block">
                          {formatCurrency(guide.priceInr)}
                        </span>
                        <span className="text-[10px] text-stone-400">for {guide.duration}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTranslatorOpen(true)}
                          className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 font-bold text-xs flex items-center gap-1"
                          title="Open Live Travel Translator"
                        >
                          <Languages className="w-3.5 h-3.5 text-cyan-400" />
                          Translator
                        </button>
                        <button
                          onClick={() =>
                            handleAddToTrip({
                              title: `Local Guide: ${guide.name} (${guide.specialization})`,
                              category: 'Guide',
                              costInr: guide.priceInr,
                              details: `Languages: ${guide.languages.join(', ')} • ${guide.duration}`,
                              locationName: `${destination.name} Guided Tour`,
                            })
                          }
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          + REQUEST GUIDE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 8. TREKKING ==================== */}
          {activeTab === 'trekking' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Mountain className="w-3.5 h-3.5" /> Find a Trek (Trail & Safety Intelligence)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Terrain: <strong className="text-white">{destination.name} Region</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Destination</label>
                    <input
                      type="text"
                      value={trekForm.destination}
                      onChange={(e) => setTrekForm({ ...trekForm, destination: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={trekForm.date}
                      onChange={(e) => setTrekForm({ ...trekForm, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Difficulty</label>
                    <select
                      value={trekForm.difficulty}
                      onChange={(e) => setTrekForm({ ...trekForm, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="All">All Difficulties</option>
                      <option value="Easy">Easy (Family / Gentle)</option>
                      <option value="Moderate">Moderate (Rocky trail / Hills)</option>
                      <option value="Hard">Hard (Steep ridge / Long trail)</option>
                      <option value="Extreme">Extreme (Expedition grade)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Duration</label>
                    <select
                      value={trekForm.duration}
                      onChange={(e) => setTrekForm({ ...trekForm, duration: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="All">All Durations</option>
                      <option value="<2 hours">&lt; 2 hours</option>
                      <option value="2–4 hours">2–4 hours</option>
                      <option value="4–8 hours">4–8 hours</option>
                      <option value="Full Day">Full Day</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-stone-900 border border-emerald-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  {treksData.aiRecommendation}
                </p>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {treksData.results.map((trek) => (
                  <div
                    key={trek.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      trek.isSafeToday
                        ? 'bg-white/5 hover:bg-white/10 border-white/10'
                        : 'bg-red-950/20 border-red-500/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex gap-3.5">
                        <img
                          src={trek.image}
                          alt={trek.trekName}
                          className="w-24 h-24 rounded-2xl object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base">{trek.trekName}</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-white/10 text-stone-200 border border-white/10">
                              {trek.difficulty}
                            </span>
                          </div>
                          <span className="text-xs text-stone-400 block mt-0.5">
                            📍 {trek.location} • Elevation: +{trek.elevationGainM}m
                          </span>
                          <span className="text-[11px] text-stone-300 block mt-1">
                            Distance: {trek.distanceKm} km • Duration: ~{trek.durationHours} hours • Crowd: {trek.crowdLevel}
                          </span>
                        </div>
                      </div>

                      {/* Safety Check Badge */}
                      <div className="shrink-0">
                        {trek.isSafeToday ? (
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            {trek.safetyStatus}
                          </div>
                        ) : (
                          <div className="px-3 py-2 rounded-xl bg-red-950 border border-red-500 text-red-200 text-xs font-black flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                            <div>
                              <span>🚫 NOT RECOMMENDED TODAY</span>
                              <span className="text-[10px] text-red-300 block font-normal">
                                {trek.safetyReason || 'Heavy Rain & Landslip Risk'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[10px] text-stone-300">
                      {trek.highlights.map((h) => (
                        <span key={h} className="px-2.5 py-1 rounded-md bg-stone-900 border border-white/5">
                          ✓ {h}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <span className="text-sm font-black text-white">
                          Guide & Forest Permit: {formatCurrency(trek.estimatedCostInr)}
                        </span>
                        <span className="text-[10px] text-stone-400 block">
                          Best Time: {trek.bestTime} • Weather: {trek.weatherCondition}
                        </span>
                      </div>

                      <button
                        disabled={!trek.isSafeToday}
                        onClick={() =>
                          handleAddToTrip({
                            title: `Trek: ${trek.trekName}`,
                            category: 'Activities',
                            costInr: trek.estimatedCostInr,
                            details: `${trek.difficulty} • ${trek.distanceKm} km • ${trek.durationHours} hrs`,
                            locationName: trek.location,
                          })
                        }
                        className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                          trek.isSafeToday
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                            : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        {trek.isSafeToday ? '+ ADD TREK TO TRIP' : 'BLOCKED FOR SAFETY'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 9. BEACHES ==================== */}
          {activeTab === 'beaches' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Palmtree className="w-3.5 h-3.5" /> Destination-Aware Beach & Shore Discovery
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Location: <strong className="text-white">{destination.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Base Destination</label>
                    <input
                      type="text"
                      value={beachForm.destination}
                      onChange={(e) => setBeachForm({ ...beachForm, destination: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={beachForm.date}
                      onChange={(e) => setBeachForm({ ...beachForm, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Search Radius</label>
                    <select
                      value={beachForm.travelRadiusKm}
                      onChange={(e) => setBeachForm({ ...beachForm, travelRadiusKm: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value={30}>Within 30 km (Immediate freshwater shores)</option>
                      <option value={80}>Within 80 km</option>
                      <option value={150}>Within 150 km (Nearest Bay of Bengal coastline)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Geographic Accuracy Disclaimer if inland */}
              {destination.slug !== 'goa' && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-200 text-xs font-black block">
                      📍 Geographic Accuracy Notice: {destination.name}
                    </strong>
                    <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                      {destination.name} is nestled in the inland Eastern Ghats / Deccan interior.
                      Rather than displaying unrelated Kerala or Goa beaches, we show the nearest actual ocean beach
                      (<strong>Mypadu Beach</strong>, 115 km east on the Bay of Bengal) and serene local freshwater shores
                      (<strong>Kalyani Dam Reservoir</strong>).
                    </p>
                  </div>
                </div>
              )}

              {/* AI Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-stone-900 border border-emerald-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  {beachesData.aiRecommendation}
                </p>
              </div>

              {/* Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {beachesData.results.map((beach) => (
                  <div
                    key={beach.id}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex gap-3.5">
                        <img
                          src={beach.image}
                          alt={beach.beachName}
                          className="w-24 h-24 rounded-2xl object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{beach.beachName}</h4>
                            <span className="text-xs text-amber-400 font-bold">★ {beach.rating}</span>
                          </div>
                          <span className="text-xs text-stone-300 block mt-0.5">
                            📍 {beach.nearestCity} ({beach.distanceKm} km, {beach.travelTimeFormatted})
                          </span>
                          {beach.inlandNote && (
                            <span className="text-[10px] text-amber-300/90 font-medium block mt-0.5">
                              ℹ️ {beach.inlandNote}
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400 block mt-1">
                            Crowd: {beach.crowdLevel} • Weather: {beach.weather} • {beach.safety}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {beach.activities.map((act) => (
                          <span key={act} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-900 text-stone-300 border border-white/5">
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-xs text-stone-400">
                        Best Time: <strong className="text-white">{beach.bestTime}</strong>
                      </span>

                      <button
                        onClick={() =>
                          handleAddToTrip({
                            title: `Coastal/Shore Excursion: ${beach.beachName}`,
                            category: 'Activities',
                            costInr: 800,
                            details: `${beach.distanceKm} km from ${destination.name} • ${beach.activities.join(', ')}`,
                            locationName: beach.beachName,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        + ADD TO MY TRIP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 10. HERITAGE ==================== */}
          {activeTab === 'heritage' && (
            <div className="space-y-6">
              {/* Search Form */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5" /> Heritage Discovery Engine
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Heritage Realm: <strong className="text-white">{destination.name}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Destination</label>
                    <input
                      type="text"
                      value={heritageForm.destination}
                      onChange={(e) => setHeritageForm({ ...heritageForm, destination: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={heritageForm.date}
                      onChange={(e) => setHeritageForm({ ...heritageForm, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Heritage Focus</label>
                    <select
                      value={heritageForm.interest}
                      onChange={(e) => setHeritageForm({ ...heritageForm, interest: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-white/15 text-white font-medium focus:border-emerald-500 outline-none"
                    >
                      <option value="All">All Historical Treasures</option>
                      <option value="Temples">Ancient Temples & Sculptures</option>
                      <option value="Forts">Hill Forts & Bastions</option>
                      <option value="Ancient Ruins">Ancient Ruins & Epigraphy</option>
                      <option value="Architecture">Dravidian & Vijayanagara Architecture</option>
                      <option value="Archaeology">Archaeology & Inscriptions</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/70 to-stone-900 border border-emerald-500/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed font-medium">
                  {heritageData.aiRecommendation}
                </p>
              </div>

              {/* Heritage Sites Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heritageData.results.map((site) => (
                  <div
                    key={site.id}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex gap-3.5">
                        <img
                          src={site.image}
                          alt={site.name}
                          className="w-24 h-24 rounded-2xl object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{site.name}</h4>
                            {site.unescoStatus && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                                UNESCO
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-stone-300 block mt-0.5">
                            Epoch: <strong className="text-amber-200">{site.historicalPeriod}</strong>
                          </span>
                          <span className="text-[11px] text-stone-400 block mt-0.5">
                            📍 {site.distanceKm} km from hub ({site.travelTimeFormatted})
                          </span>
                          <span className="text-[10px] text-emerald-400 block mt-1">
                            Opening Hours: {site.openingHours} • Crowd: {site.crowdLevel}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-300/90 mt-3 leading-relaxed line-clamp-2">
                        {site.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <span className="text-sm font-black text-white block">
                          Entry: {site.entryFeeInr === 0 ? 'Free / Devotional Entry' : formatCurrency(site.entryFeeInr)}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {site.guideAvailable ? '✓ Official ASI Guides available' : 'Self-guided audio tour'}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          handleAddToTrip({
                            title: `Heritage Visit: ${site.name}`,
                            category: 'Activities',
                            costInr: site.entryFeeInr * (preferences.groupSize || 1),
                            details: `${site.historicalPeriod} • ${site.openingHours}`,
                            locationName: site.name,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        + ADD TO MY TRIP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ========================================================
            MODAL FOOTER (Quick shortcuts & status)
        ======================================================== */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-stone-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Connected to <strong>HiddenGem AI Travel Engine</strong> • All 10 modes fully interactive
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/plan-trip"
              onClick={onClose}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              View Full Itinerary & Budget →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
