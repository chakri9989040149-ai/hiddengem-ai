import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Destination,
  HiddenGem,
  UserPreferences,
  CrowdLevel,
  CompleteTrip,
  DayPlan,
  PassportBadge,
  ExpenseItem,
  TravelType,
  PlanningMode,
  VisitorReview,
  DiscoveryResult,
  LocalGuide,
} from '@/types';
import { DESTINATIONS, BADGES_SEED, GUIDES_SEED } from './data/seed';
import { predictCrowdLevel, CrowdPredictionResult } from './crowd';
import { rankHiddenGems } from './scoring';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTaken?: string;
  suggestedAction?: {
    label: string;
    payload: Record<string, unknown>;
  };
}

interface AppState {
  // Guest Exploration vs Logged In
  isGuestMode: boolean;
  setGuestMode: (val: boolean) => void;

  // Destinations
  destinations: Destination[];
  selectedDestinationSlug: string;
  hasExplicitlySelectedDestination: boolean;
  setSelectedDestinationSlug: (slug: string) => void;
  setHasExplicitlySelectedDestination: (val: boolean) => void;
  getSelectedDestination: () => Destination;

  // Preferences
  preferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  requestCurrentLocation: () => Promise<void>;
  locationStatus: 'idle' | 'requesting' | 'acquired' | 'denied';

  // Crowd Intelligence & Admin Simulation
  adminCrowdOverride: Record<string, CrowdLevel | null>;
  setAdminCrowdOverride: (slug: string, level: CrowdLevel | null) => void;
  simulateCrowdSpike: (slug?: string) => void;
  resetCrowdSimulation: (slug?: string) => void;
  getCrowdPrediction: (slug?: string) => CrowdPredictionResult;

  // Selected Gems & Itinerary
  selectedGems: HiddenGem[];
  addGemToTrip: (gem: HiddenGem) => void;
  removeGemFromTrip: (gemId: string) => void;
  clearSelectedGems: () => void;

  // Current Trip Itinerary
  activeTrip: CompleteTrip | null;
  setActiveTrip: (trip: CompleteTrip | null) => void;
  generateItineraryFromState: () => CompleteTrip;
  addBookingToTrip: (booking: {
    title: string;
    category: 'Transport' | 'Stay' | 'Guide' | 'Activities' | 'Dining';
    costInr: number;
    details?: string;
    locationName?: string;
    dayNumber?: number;
  }) => { success: boolean; exceededBy: number; totalCost: number; budget: number };

  // Group Expenses
  expenses: ExpenseItem[];
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  removeExpense: (id: string) => void;

  // Passport & Badges
  badges: PassportBadge[];
  ecoPoints: number;
  gemsDiscoveredCount: number;
  unlockBadge: (badgeId: string) => void;

  // AI Assistant Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;

  // Auth / Mock verification
  isLoggedIn: boolean;
  isIdentityVerified: boolean;
  verifiedDocType: string | null;
  setAuth: (isLoggedIn: boolean, isVerified?: boolean, docType?: string) => void;

  // Live Travel Translator
  isTranslatorOpen: boolean;
  setTranslatorOpen: (val: boolean) => void;

  // Active Trip Mode ("I'm Travelling Now")
  isTravellingNow: boolean;
  setIsTravellingNow: (val: boolean) => void;

  // Discover My Hidden Places
  activeDiscovery: DiscoveryResult | null;
  setActiveDiscovery: (res: DiscoveryResult | null) => void;

  // Verified Visitor Reviews
  visitorReviews: VisitorReview[];
  addVisitorReview: (review: Omit<VisitorReview, 'id' | 'createdAt'>) => void;
  getSatisfactionScore: (gemId: string) => number;

  // Guides System
  guides: LocalGuide[];
  addGuide: (guide: Omit<LocalGuide, 'id'>) => void;
  verifyGuide: (id: string, verified: boolean) => void;

  // Weather & Safety Overrides (Admin Simulation & Testing)
  weatherRainOverride: Record<string, number | null>;
  setWeatherRainOverride: (slug: string, rainPercent: number | null) => void;
  unsafeGemsOverride: Record<string, boolean>;
  toggleGemUnsafe: (gemId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Guest exploration active by default so users are never blocked
      isGuestMode: true,
      setGuestMode: (val) => set({ isGuestMode: val }),

      destinations: DESTINATIONS,
      selectedDestinationSlug: 'tirupati',
      hasExplicitlySelectedDestination: false,
      setSelectedDestinationSlug: (slug) =>
        set({ selectedDestinationSlug: slug, hasExplicitlySelectedDestination: true }),
      setHasExplicitlySelectedDestination: (val) =>
        set({ hasExplicitlySelectedDestination: val }),
      getSelectedDestination: () => {
        const { destinations, selectedDestinationSlug } = get();
        return (
          destinations.find((d) => d.slug === selectedDestinationSlug) || destinations[0]
        );
      },

      preferences: {
        destinationSlug: 'tirupati',
        planningMode: 'fixed_destination',
        userCurrentLocation: null,
        travelType: 'Friends',
        companionType: 'Friends',
        groupSize: 4,
        durationDays: 2,
        totalBudgetInr: 10000,
        travelStyle: 'Standard',
        maxDistanceKm: 50,
        maxTravelTimeMinutes: 60,
        isOvernightWilling: true,
        crowdPreference: 'low',
        interests: ['Divine', 'Nature', 'Photography', 'History', 'Spirituality'],
        transportPreference: 'Train',
      },
      updatePreferences: (partial) =>
        set((state) => ({
          preferences: { ...state.preferences, ...partial },
        })),

      locationStatus: 'idle',
      requestCurrentLocation: async () => {
        set({ locationStatus: 'requesting' });
        if (typeof window === 'undefined' || !navigator.geolocation) {
          set({
            locationStatus: 'denied',
            preferences: {
              ...get().preferences,
              userCurrentLocation: {
                lat: 13.6288,
                lng: 79.4192,
                address: 'Tirupati Central, Andhra Pradesh (Manual Default)',
              },
            },
          });
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            set({
              locationStatus: 'acquired',
              preferences: {
                ...get().preferences,
                userCurrentLocation: {
                  lat: latitude,
                  lng: longitude,
                  address: `Current GPS (${latitude.toFixed(2)}° N, ${longitude.toFixed(2)}° E)`,
                },
              },
            });
          },
          () => {
            // Graceful fallback without blocking
            set({
              locationStatus: 'denied',
              preferences: {
                ...get().preferences,
                userCurrentLocation: {
                  lat: 13.6288,
                  lng: 79.4192,
                  address: 'Tirupati Hub (Location Permission Optional)',
                },
              },
            });
          },
          { timeout: 8000 }
        );
      },

      // Admin Crowd Simulation
      adminCrowdOverride: {
        tirupati: null,
        hampi: null,
        munnar: null,
      },
      setAdminCrowdOverride: (slug, level) =>
        set((state) => ({
          adminCrowdOverride: { ...state.adminCrowdOverride, [slug]: level },
        })),
      simulateCrowdSpike: (slug) => {
        const targetSlug = slug || get().selectedDestinationSlug;
        set((state) => ({
          adminCrowdOverride: { ...state.adminCrowdOverride, [targetSlug]: 'high' },
        }));
      },
      resetCrowdSimulation: (slug) => {
        const targetSlug = slug || get().selectedDestinationSlug;
        set((state) => ({
          adminCrowdOverride: { ...state.adminCrowdOverride, [targetSlug]: null },
        }));
      },
      getCrowdPrediction: (slug) => {
        const targetSlug = slug || get().selectedDestinationSlug;
        const override = get().adminCrowdOverride[targetSlug];
        return predictCrowdLevel(targetSlug, new Date(), override);
      },

      // Selected Gems
      selectedGems: [],
      addGemToTrip: (gem) =>
        set((state) => {
          if (state.selectedGems.some((g) => g.id === gem.id)) return state;
          return {
            selectedGems: [...state.selectedGems, gem],
            gemsDiscoveredCount: state.gemsDiscoveredCount + 1,
            ecoPoints: state.ecoPoints + 25,
          };
        }),
      removeGemFromTrip: (gemId) =>
        set((state) => ({
          selectedGems: state.selectedGems.filter((g) => g.id !== gemId),
        })),
      clearSelectedGems: () => set({ selectedGems: [] }),

      // Trip Itinerary
      activeTrip: null,
      setActiveTrip: (trip) => set({ activeTrip: trip }),
      generateItineraryFromState: () => {
        const { getSelectedDestination, preferences, selectedGems } = get();
        const destination = getSelectedDestination();
        const daysCount = preferences.durationDays || 2;

        let gemsToInclude = [...selectedGems];
        if (gemsToInclude.length === 0) {
          const ranked = rankHiddenGems(destination, preferences);
          gemsToInclude = ranked.slice(0, 3).map((r) => r.gem);
        }

        const days: DayPlan[] = [];
        let gemIdx = 0;

        for (let day = 1; day <= daysCount; day++) {
          const gemForDay = gemsToInclude[gemIdx % gemsToInclude.length];
          gemIdx++;

          const items = [
            {
              id: `item-${day}-1`,
              dayNumber: day,
              timeSlot: '08:30 AM',
              title: day === 1 ? 'Arrival & Scenic Breakfast' : 'Highland Morning Walk & Tea',
              description: 'Fresh local culinary breakfast and journey briefing.',
              locationName: day === 1 ? 'Central Heritage Square' : 'Valley Viewpoint',
              category: 'Dining' as const,
              estimatedDurationHours: 1.5,
              estimatedCostInr: preferences.groupSize * 120,
            },
            {
              id: `item-${day}-2`,
              dayNumber: day,
              timeSlot: '10:30 AM',
              title: gemForDay.name,
              description: gemForDay.subtitle,
              locationName: gemForDay.name,
              category: gemForDay.category,
              estimatedDurationHours: 3,
              estimatedCostInr: gemForDay.estimatedCostInr * preferences.groupSize,
              gemId: gemForDay.id,
              coordinates: gemForDay.coordinates,
            },
            {
              id: `item-${day}-3`,
              dayNumber: day,
              timeSlot: '01:45 PM',
              title: 'Authentic Local Farm Lunch',
              description: 'Tasting authentic regional spices and traditional recipes.',
              locationName: 'Lakeside Organic Kitchen',
              category: 'Dining' as const,
              estimatedDurationHours: 1.5,
              estimatedCostInr: preferences.groupSize * 220,
            },
            {
              id: `item-${day}-4`,
              dayNumber: day,
              timeSlot: '04:00 PM',
              title: 'Sunset Photography & Golden Hour Stroll',
              description: 'Panoramic vistas with minimal foot traffic and pure natural acoustics.',
              locationName: `${gemForDay.name} Lookout`,
              category: 'Photography' as const,
              estimatedDurationHours: 2,
              estimatedCostInr: 0,
            },
            {
              id: `item-${day}-5`,
              dayNumber: day,
              timeSlot: '07:30 PM',
              title: 'Stargazing & Campfire Dining',
              description: 'Quiet evening under clear constellation skies.',
              locationName: 'Eco Stay Courtyard',
              category: 'Dining' as const,
              estimatedDurationHours: 2,
              estimatedCostInr: preferences.groupSize * 300,
            },
          ];

          const dayCost = items.reduce((acc, curr) => acc + curr.estimatedCostInr, 0);

          days.push({
            dayNumber: day,
            theme: day === 1 ? 'Discovery & Uncrowded Cascades' : 'Heritage & Sunset Vistas',
            items,
            dayEcoScore: 92,
            estimatedDayCostInr: dayCost,
          });
        }

        const estimatedActivities = days.reduce((a, d) => a + d.estimatedDayCostInr, 0);
        const stayCost = (preferences.durationDays - 1 > 0 ? preferences.durationDays - 1 : 1) * 2600;
        const transportCost = preferences.groupSize * 850;
        const foodCost = preferences.durationDays * preferences.groupSize * 600;
        const guideCost = 1500;
        const emergencyBuffer = 800;

        const totalEstimated = estimatedActivities + stayCost + transportCost + foodCost + guideCost + emergencyBuffer;
        const totalBudget = preferences.totalBudgetInr || 10000;

        const trip: CompleteTrip = {
          id: `trip-${Date.now()}`,
          title: `${destination.name} Off-Beat Journey`,
          destination,
          preferences,
          days,
          selectedGems: gemsToInclude,
          budget: {
            totalBudget,
            estimatedCost: Math.min(totalEstimated, totalBudget * 0.94),
            remainingBudget: Math.max(800, totalBudget - Math.min(totalEstimated, totalBudget * 0.94)),
            costPerPerson: Math.round(Math.min(totalEstimated, totalBudget * 0.94) / preferences.groupSize),
            breakdown: {
              transport: transportCost,
              stay: stayCost,
              food: foodCost,
              localTransport: 1200,
              guide: guideCost,
              activities: estimatedActivities,
              emergencyBuffer,
            },
          },
          overallEcoScore: 89,
          createdAt: new Date().toISOString(),
          status: 'planned',
        };

        set({ activeTrip: trip });
        return trip;
      },

      addBookingToTrip: (booking) => {
        let currentTrip = get().activeTrip;
        if (!currentTrip) {
          currentTrip = get().generateItineraryFromState();
        }

        const catKey = booking.category.toLowerCase() as
          | 'transport'
          | 'stay'
          | 'guide'
          | 'activities';

        const updatedBreakdown = {
          ...currentTrip.budget.breakdown,
          [catKey]: (currentTrip.budget.breakdown[catKey] || 0) + booking.costInr,
        };

        const newEstimatedCost = Object.values(updatedBreakdown).reduce((a, b) => a + b, 0);
        const totalBudget = currentTrip.budget.totalBudget || get().preferences.totalBudgetInr || 10000;
        const remainingBudget = totalBudget - newEstimatedCost;
        const exceededBy = newEstimatedCost > totalBudget ? newEstimatedCost - totalBudget : 0;

        const targetDay = booking.dayNumber || 1;
        const updatedDays = currentTrip.days.map((day) => {
          if (day.dayNumber === targetDay) {
            return {
              ...day,
              estimatedDayCostInr: day.estimatedDayCostInr + booking.costInr,
              items: [
                ...day.items,
                {
                  id: `booking-${Date.now()}-${Math.random().toString(36).substring(7)}`,
                  dayNumber: day.dayNumber,
                  timeSlot: 'Selected Slot',
                  title: booking.title,
                  description: booking.details || `Booked via ${booking.category} Tool`,
                  locationName: booking.locationName || currentTrip!.destination.name,
                  category: booking.category as any,
                  estimatedDurationHours: 2,
                  estimatedCostInr: booking.costInr,
                },
              ],
            };
          }
          return day;
        });

        const updatedTrip: CompleteTrip = {
          ...currentTrip,
          days: updatedDays,
          budget: {
            ...currentTrip.budget,
            estimatedCost: newEstimatedCost,
            remainingBudget,
            costPerPerson: Math.round(newEstimatedCost / (currentTrip.preferences.groupSize || 1)),
            breakdown: updatedBreakdown,
          },
        };

        set((state) => ({
          activeTrip: updatedTrip,
          expenses: [
            ...state.expenses,
            {
              id: `exp-${Date.now()}`,
              title: booking.title,
              amount: booking.costInr,
              paidBy: 'Trip Lead',
              category: booking.category as any,
              splitAmong: ['You', 'Traveller 2', 'Traveller 3', 'Traveller 4'],
            },
          ],
        }));

        return {
          success: true,
          exceededBy,
          totalCost: newEstimatedCost,
          budget: totalBudget,
        };
      },

      // Expenses
      expenses: [
        {
          id: 'exp-1',
          title: 'Vande Bharat Express Group Tickets',
          amount: 3400,
          paidBy: 'Rohan',
          category: 'Transport',
          splitAmong: ['Rohan', 'Priya', 'Ananya', 'Vikram'],
        },
        {
          id: 'exp-2',
          title: 'Forest Eco-Resort Booking (Night 1)',
          amount: 3800,
          paidBy: 'Priya',
          category: 'Stay',
          splitAmong: ['Rohan', 'Priya', 'Ananya', 'Vikram'],
        },
      ],
      addExpense: (exp) =>
        set((state) => ({
          expenses: [...state.expenses, { ...exp, id: `exp-${Date.now()}` }],
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      // Badges
      badges: BADGES_SEED,
      ecoPoints: 420,
      gemsDiscoveredCount: 6,
      unlockBadge: (badgeId) =>
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId ? { ...b, unlockedAt: new Date().toISOString().split('T')[0] } : b
          ),
          ecoPoints: state.ecoPoints + 50,
        })),

      // AI Chat
      chatMessages: [
        {
          id: 'msg-1',
          sender: 'assistant',
          text: 'Hello! I am your HiddenGem AI Travel Assistant. Ask me to adjust your budget, find waterfalls, shorten travel time, or switch to serene hidden alternatives.',
          timestamp: 'Just now',
        },
      ],
      addChatMessage: (msg) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            { ...msg, id: `msg-${Date.now()}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ],
        })),
      clearChat: () =>
        set({
          chatMessages: [
            {
              id: 'msg-init',
              sender: 'assistant',
              text: 'Chat history cleared. How can I help fine-tune your itinerary or budget today?',
              timestamp: 'Just now',
            },
          ],
        }),

      // Auth
      isLoggedIn: false, // Default guest exploration
      isIdentityVerified: true,
      verifiedDocType: 'Aadhaar (DigiLocker Mock Verified)',
      setAuth: (isLoggedIn, isVerified = true, docType = 'Aadhaar (Mock)') =>
        set({
          isLoggedIn,
          isIdentityVerified: isVerified,
          verifiedDocType: docType,
          isGuestMode: !isLoggedIn,
        }),

      // Live Travel Translator
      isTranslatorOpen: false,
      setTranslatorOpen: (val) => set({ isTranslatorOpen: val }),

      // Active Trip Mode
      isTravellingNow: false,
      setIsTravellingNow: (val) => set({ isTravellingNow: val }),

      // Discover My Hidden Places
      activeDiscovery: null,
      setActiveDiscovery: (res) => set({ activeDiscovery: res }),

      // Verified Visitor Reviews with authentic initial seeds
      visitorReviews: [
        {
          id: 'rev-1',
          gemId: 'gem-talakona',
          destinationSlug: 'tirupati',
          tripId: 'trip-verified-101',
          authorName: 'Suresh Varma',
          authorLocation: 'Hyderabad, Telangana',
          rating: 5,
          writtenReview:
            'Breathtaking waterfall deep inside the forest! Far more peaceful than the temple queues. Water is crystal clear and cold.',
          visitDate: '2 weeks ago',
          crowdExperience: 'very_low',
          safetyExperience: 'excellent',
          accessibilityExperience: 'moderate',
          valueForMoney: 'great',
          wouldRecommend: true,
          isVerifiedVisitor: true,
          createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        },
        {
          id: 'rev-2',
          gemId: 'gem-sanapur',
          destinationSlug: 'hampi',
          tripId: 'trip-verified-102',
          authorName: 'Ananya Deshmukh',
          authorLocation: 'Bengaluru, Karnataka',
          rating: 5,
          writtenReview:
            'The coracle float amidst the giant balancing boulders at golden hour is unforgettable. Zero wait times compared to the stone chariot.',
          visitDate: 'Last week',
          crowdExperience: 'very_low',
          safetyExperience: 'excellent',
          accessibilityExperience: 'easy',
          valueForMoney: 'great',
          wouldRecommend: true,
          isVerifiedVisitor: true,
          createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        },
        {
          id: 'rev-3',
          gemId: 'gem-kolukkumalai',
          destinationSlug: 'munnar',
          tripId: 'trip-verified-103',
          authorName: 'Rohit Menon',
          authorLocation: 'Kochi, Kerala',
          rating: 5,
          writtenReview:
            'Watching the sunrise above a sea of clouds from 7,900 feet was life changing. The 4x4 jeep trail keeps crowds completely away.',
          visitDate: '3 days ago',
          crowdExperience: 'very_low',
          safetyExperience: 'good',
          accessibilityExperience: 'moderate',
          valueForMoney: 'great',
          wouldRecommend: true,
          isVerifiedVisitor: true,
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
      ],
      addVisitorReview: (review) =>
        set((state) => ({
          visitorReviews: [
            {
              ...review,
              id: `rev-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
            ...state.visitorReviews,
          ],
        })),
      getSatisfactionScore: (gemId) => {
        const reviews = get().visitorReviews.filter((r) => r.gemId === gemId);
        if (reviews.length === 0) return 92;
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        return Math.round(avg * 19.5);
      },

      // Guides System
      guides: GUIDES_SEED,
      addGuide: (guide) =>
        set((state) => ({
          guides: [{ ...guide, id: `guide-${Date.now()}` }, ...state.guides],
        })),
      verifyGuide: (id, verified) =>
        set((state) => ({
          guides: state.guides.map((g) => (g.id === id ? { ...g, verified } : g)),
        })),

      // Weather & Safety Overrides (Admin Simulation & Testing)
      weatherRainOverride: {
        tirupati: null,
        hampi: null,
        munnar: null,
        goa: null,
        jaipur: null,
        varanasi: null,
      },
      setWeatherRainOverride: (slug, rainPercent) =>
        set((state) => ({
          weatherRainOverride: { ...state.weatherRainOverride, [slug]: rainPercent },
        })),
      unsafeGemsOverride: {},
      toggleGemUnsafe: (gemId) =>
        set((state) => ({
          unsafeGemsOverride: {
            ...state.unsafeGemsOverride,
            [gemId]: !state.unsafeGemsOverride[gemId],
          },
        })),
    }),
    {
      name: 'hiddengem-storage',
      partialize: (state) => ({
        isGuestMode: state.isGuestMode,
        selectedDestinationSlug: state.selectedDestinationSlug,
        preferences: state.preferences,
        adminCrowdOverride: state.adminCrowdOverride,
        selectedGems: state.selectedGems,
        activeTrip: state.activeTrip,
        expenses: state.expenses,
        ecoPoints: state.ecoPoints,
        gemsDiscoveredCount: state.gemsDiscoveredCount,
        isLoggedIn: state.isLoggedIn,
        isIdentityVerified: state.isIdentityVerified,
        verifiedDocType: state.verifiedDocType,
      }),
    }
  )
);
