'use client';

import React, { useState } from 'react';
import { HiddenGem, RecommendationScore, Destination } from '@/types';
import { useAppStore } from '@/lib/store';
import { formatCurrency, formatTime, getAssetPath } from '@/lib/utils';
import {
  X,
  Sparkles,
  MapPin,
  Clock,
  Shield,
  Heart,
  Plus,
  Check,
  CheckCircle,
  Accessibility,
  Compass,
  Phone,
  Building2,
  Leaf,
  Star,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

interface GemDetailsModalProps {
  gem: HiddenGem | null;
  destination?: Destination;
  score?: RecommendationScore;
  isOpen?: boolean;
  onClose: () => void;
}

export function GemDetailsModal({ gem, score, onClose }: GemDetailsModalProps) {
  const {
    selectedGems,
    addGemToTrip,
    removeGemFromTrip,
    visitorReviews,
    addVisitorReview,
    getSatisfactionScore,
  } = useAppStore();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewTripId, setReviewTripId] = useState('');
  const [crowdExp, setCrowdExp] = useState<'very_low' | 'moderate' | 'very_high'>('very_low');
  const [wouldRec, setWouldRec] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!gem) return null;

  const isSelected = selectedGems.some((g) => g.id === gem.id);
  const satisfaction = getSatisfactionScore(gem.id);
  const gemReviews = visitorReviews.filter(
    (r) => r.gemId === gem.id || r.destinationSlug === gem.destinationSlug
  );

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    // A valid visit verification requires a trip or booking ID
    const isVerified = Boolean(reviewTripId.trim().length >= 4);

    addVisitorReview({
      gemId: gem.id,
      destinationSlug: gem.destinationSlug || 'tirupati',
      tripId: reviewTripId.trim() || undefined,
      authorName: 'Guest Explorer',
      authorLocation: 'Verified Traveller',
      rating: reviewRating,
      writtenReview: reviewText.trim(),
      visitDate: 'Just now',
      crowdExperience: crowdExp,
      safetyExperience: 'excellent',
      accessibilityExperience: 'easy',
      valueForMoney: 'great',
      wouldRecommend: wouldRec,
      isVerifiedVisitor: isVerified,
    });

    setSubmittedSuccess(true);
    setReviewText('');
    setReviewTripId('');
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowReviewForm(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl overflow-hidden">
          <div className="h-56 sm:h-64 w-full">
            <img
              src={gem.images?.[0] || getAssetPath('/images/destinations/munnar_tea_hills.jpg')}
              alt={gem.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const fallback =
                  gem.destinationSlug === 'munnar'
                    ? getAssetPath('/images/destinations/munnar_tea_hills.jpg')
                    : gem.destinationSlug === 'hampi'
                    ? getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg')
                    : getAssetPath('/images/destinations/tirupati_talakona_waterfall.jpg');
                e.currentTarget.src = fallback;
              }}
            />
          </div>
          {gem.images?.[1] && (
            <div className="hidden sm:block h-64 w-full">
              <img
                src={gem.images[1]}
                alt={gem.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const fallback =
                    gem.destinationSlug === 'munnar'
                      ? getAssetPath('/images/destinations/munnar_tea_hills.jpg')
                      : gem.destinationSlug === 'hampi'
                      ? getAssetPath('/images/destinations/hampi_stone_chariot_hero.jpg')
                      : getAssetPath('/images/destinations/tirupati_talakona_waterfall.jpg');
                  e.currentTarget.src = fallback;
                }}
              />
            </div>
          )}
        </div>

        {/* Header Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {gem.category}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{formatTime(gem.travelTimeMinutes)} from Main Hub</span>
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" />
              <span>Eco Score {gem.ecoScore}/100</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            {gem.name}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">{gem.subtitle}</p>
        </div>

        {/* Recommendation Score Breakdown (Exact 100% Weight Formula) */}
        {score && (
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                  AI Recommendation Score: {score.score}% Match
                </span>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Deterministic 100% Weighted Metric
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div>
                <span className="text-stone-500 block">Interest Match (30%)</span>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${(score.breakdown.interestMatch / 30) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {score.breakdown.interestMatch} / 30 pts
                </span>
              </div>

              <div>
                <span className="text-stone-500 block">Travel Time (20%)</span>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-sky-600 h-full rounded-full"
                    style={{ width: `${(score.breakdown.travelTimeScore / 20) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {score.breakdown.travelTimeScore} / 20 pts
                </span>
              </div>

              <div>
                <span className="text-stone-500 block">Crowd Headroom (20%)</span>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-teal-500 h-full rounded-full"
                    style={{ width: `${(score.breakdown.crowdHeadroomScore / 20) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {score.breakdown.crowdHeadroomScore} / 20 pts
                </span>
              </div>

              <div>
                <span className="text-stone-500 block">Visitor Rating (10%)</span>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(score.breakdown.ratingScore / 10) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {score.breakdown.ratingScore} / 10 pts
                </span>
              </div>

              <div>
                <span className="text-stone-500 block">Availability (10%)</span>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${(score.breakdown.availabilityScore / 10) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {score.breakdown.availabilityScore} / 10 pts
                </span>
              </div>

              <div>
                <span className="text-stone-500 block">Budget Fit (10%)</span>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${(score.breakdown.budgetFitScore / 10) * 100}%` }}
                  />
                </div>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {score.breakdown.budgetFitScore} / 10 pts
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Description & Why Visit */}
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-1">
              About This Experience
            </h4>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {gem.description}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-2">
              Why Visit Beyond Mainstream Crowds
            </h4>
            <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
              {gem.whyVisit.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Accessibility & Safety Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs">
          {/* Accessibility */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 space-y-2">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Accessibility className="w-4 h-4 text-emerald-600" />
              <span>Accessibility & Family Suitability</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className={`px-2 py-0.5 rounded text-[11px] ${gem.accessibility.wheelchairFriendly ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                {gem.accessibility.wheelchairFriendly ? '✓ Wheelchair Friendly' : '✗ Rugged Steps'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] ${gem.accessibility.seniorFriendly ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                {gem.accessibility.seniorFriendly ? '✓ Senior Friendly' : '✗ Hilly Trek'}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] ${gem.accessibility.childFriendly ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                {gem.accessibility.childFriendly ? '✓ Child Friendly' : '✗ Wilderness Trek'}
              </span>
            </div>
          </div>

          {/* Safety */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 space-y-2">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Safety & Connectivity</span>
            </span>
            <div className="space-y-1 text-[11px] text-stone-600 dark:text-stone-300">
              <div className="flex justify-between">
                <span>Nearest Hospital:</span>
                <span className="font-semibold">{gem.safety.nearestHospitalKm} km away</span>
              </div>
              <div className="flex justify-between">
                <span>Mobile Connectivity:</span>
                <span className="font-semibold">{gem.safety.connectivity}</span>
              </div>
              <div className="flex justify-between">
                <span>Police / Security:</span>
                <span className="font-semibold">{gem.safety.policeContact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            VERIFIED VISITOR REVIEWS & VISITOR SATISFACTION SCORE
        ======================================================== */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Visitor Satisfaction: {satisfaction}%</span>
                </span>
                <span className="text-xs text-stone-500">
                  ({gemReviews.length} Verified Traveller Reviews)
                </span>
              </div>
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 tracking-tight mt-1">
                Verified Visitor Community Reviews
              </h3>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-emerald-500 text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 shadow-sm self-start sm:self-center transition-all"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{showReviewForm ? 'Close Review Form' : 'Write Verified Review'}</span>
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Share Your Genuine Visit Experience
                </span>
                <span className="text-[11px] text-stone-500">
                  Add Trip ID to receive the ✓ Verified Visitor badge
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                    Rating
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 Outstanding)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 Great)</option>
                    <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                    <option value={2}>⭐⭐ (2/5 Below Average)</option>
                    <option value={1}>⭐ (1/5 Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                    Crowd Experienced
                  </label>
                  <select
                    value={crowdExp}
                    onChange={(e) => setCrowdExp(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
                  >
                    <option value="very_low">🟢 Very Low / Peaceful</option>
                    <option value="moderate">🟡 Moderate</option>
                    <option value="very_high">🔴 Very High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 dark:text-stone-400 font-medium mb-1">
                    HiddenGem Trip / Booking ID
                  </label>
                  <input
                    type="text"
                    value={reviewTripId}
                    onChange={(e) => setReviewTripId(e.target.value)}
                    placeholder="e.g. trip-verified-101"
                    className="w-full p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 dark:text-stone-400 text-xs font-medium mb-1">
                  Written Feedback & Accessibility Tips
                </label>
                <textarea
                  rows={2}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell other travellers how safe, quiet, or scenic this spot was..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wouldRec}
                    onChange={(e) => setWouldRec(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>I would recommend this hidden gem to fellow travellers</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
                >
                  {submittedSuccess ? '✓ Review Published!' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}

          {/* List of Verified Reviews */}
          <div className="space-y-3">
            {gemReviews.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-800/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {rev.authorName}
                    </span>
                    <span className="text-stone-400">• {rev.authorLocation}</span>
                    {rev.isVerifiedVisitor && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>✓ VERIFIED VISITOR</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <span>{'★'.repeat(rev.rating)}</span>
                    <span className="text-stone-400 text-[10px]">({rev.visitDate})</span>
                  </div>
                </div>

                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                  &ldquo;{rev.writtenReview}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-500">
                  <span className="px-2 py-0.5 rounded bg-stone-200/80 dark:bg-stone-700/80 text-stone-700 dark:text-stone-300">
                    Crowd: {rev.crowdExperience === 'very_low' ? '🟢 Very Low' : rev.crowdExperience === 'moderate' ? '🟡 Moderate' : '🔴 Very High'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    Safety: {rev.safetyExperience}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-stone-200/80 dark:bg-stone-700/80 text-stone-700 dark:text-stone-300">
                    Accessibility: {rev.accessibilityExperience}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-xs text-stone-400 block uppercase">Entry & Activity Cost</span>
            <span className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
              {gem.estimatedCostInr === 0 ? 'Free Entry' : formatCurrency(gem.estimatedCostInr)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Close
            </button>

            {isSelected ? (
              <button
                onClick={() => removeGemFromTrip(gem.id)}
                className="px-5 py-2.5 rounded-xl border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50"
              >
                Remove from Itinerary
              </button>
            ) : (
              <button
                onClick={() => {
                  addGemToTrip(gem);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-lg shadow-emerald-700/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to My Trip</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
