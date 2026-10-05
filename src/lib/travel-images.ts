/**
 * GLOBAL CONTEXT-AWARE TRAVEL IMAGE LIBRARY (INDIA-FIRST TOURISM)
 * Re-exports from travelVisuals.ts for backward-compatibility.
 */

export {
  INDIAN_TRAVEL_VISUALS as TRAVEL_IMAGES,
  INDIAN_TRAVEL_VISUALS,
  getTravelImage,
  getContextualTravelImage,
  getTransportVisual as getTransportImage,
  getAccommodationVisual as getAccommodationImage,
  getCompanionVisual as getCompanionImage,
} from './travelVisuals';

export type { TravelImageQuery as ContextualImageCriteria } from './travelVisuals';
