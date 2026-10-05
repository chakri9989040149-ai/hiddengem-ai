'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { DESTINATION_VISUALS, getDestinationVisual } from '@/lib/destinationVisuals';
import { getAssetPath } from '@/lib/utils';

export function DynamicTravelBackground() {
  const { preferences, selectedDestinationSlug, hasExplicitlySelectedDestination, getCrowdPrediction } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or on initial entry before user selects a destination:
  // Show IMAGE 1: /images/landing-travel.jpg
  const showLandingCollage = !mounted || !hasExplicitlySelectedDestination;

  // Retrieve destination visual identity: Tirumala for Tirupati, Stone Chariot for Hampi, Tea Estates for Munnar
  const activeDestination = DESTINATION_VISUALS[selectedDestinationSlug] || DESTINATION_VISUALS.tirupati;
  const destinationImage = getDestinationVisual({
    destination: selectedDestinationSlug,
    preferHero: true,
  });

  const activeImage = showLandingCollage ? '/images/landing-travel.jpg' : destinationImage;
  const currentKey = showLandingCollage ? 'landing-travel-collage' : selectedDestinationSlug;

  const currentPred = getCrowdPrediction(selectedDestinationSlug);
  const isHighCrowd = !showLandingCollage && currentPred?.crowdLevel === 'high';

  // Atmospheric mood overlay matching the destination
  const mood = showLandingCollage ? 'none' : activeDestination.crowdOverlayMood || 'spiritual-gold';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none transition-colors duration-1000 bg-stone-950">
      {/* Layer 1: Destination High-Resolution Photograph or Landing Collage with Smooth 600ms Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentKey}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={getAssetPath(activeImage)}
            alt={showLandingCollage ? 'World Travel & Adventure Experience' : activeDestination.name}
            className="w-full h-full object-cover brightness-[0.88] dark:brightness-[0.48] saturate-[1.12] contrast-[1.06]"
          />
        </motion.div>
      </AnimatePresence>

      {/* Layer 2: Subtle directional gradient for crystal clear text readability without hiding the scenery */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/45 via-stone-950/25 to-stone-950/75 dark:from-stone-950/70 dark:via-stone-950/50 dark:to-stone-950/90" />

      {/* Layer 3: Subtle Atmospheric Color Overlays */}
      {mood === 'spiritual-gold' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 via-transparent to-amber-900/15 mix-blend-color-dodge pointer-events-none" />
      )}
      {mood === 'heritage-amber' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-950/20 via-transparent to-amber-950/20 mix-blend-color-dodge pointer-events-none" />
      )}
      {mood === 'nature-emerald' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/25 via-transparent to-teal-950/20 mix-blend-color-dodge pointer-events-none" />
      )}
      {mood === 'coastal-cyan' && (
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/25 via-transparent to-sky-950/20 mix-blend-color-dodge pointer-events-none" />
      )}

      {/* High Crowd Active Surge Alert Vignette */}
      {isHighCrowd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 ring-inset ring-8 ring-rose-500/25 bg-gradient-to-t from-rose-950/30 via-transparent to-transparent pointer-events-none"
        />
      )}
    </div>
  );
}
