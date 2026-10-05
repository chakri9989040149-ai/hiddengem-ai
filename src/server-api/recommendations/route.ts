import { NextResponse } from 'next/server';
import { DESTINATIONS } from '@/lib/data/seed';
import { rankHiddenGems } from '@/lib/scoring';
import { UserPreferences } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const preferences: UserPreferences = body.preferences || {
      destinationSlug: 'tirupati',
      travelType: 'Friends',
      groupSize: 4,
      durationDays: 2,
      totalBudgetInr: 10000,
      travelStyle: 'Standard',
      maxTravelTimeMinutes: 60,
      interests: ['Divine', 'Nature', 'Photography'],
    };

    const destination =
      DESTINATIONS.find((d) => d.slug === preferences.destinationSlug) || DESTINATIONS[0];

    const ranked = rankHiddenGems(destination, preferences);

    return NextResponse.json({
      success: true,
      destination: destination.name,
      count: ranked.length,
      recommendations: ranked.map((r) => ({
        id: r.gem.id,
        name: r.gem.name,
        category: r.gem.category,
        distanceFromMainKm: r.gem.distanceFromMainKm,
        travelTimeMinutes: r.gem.travelTimeMinutes,
        score: r.score.score,
        breakdown: r.score.breakdown,
        reasons: r.score.reasons,
        explanation: r.score.explanation,
        crowdLevel: r.gem.crowdData.level,
        occupancyPercent: r.gem.crowdData.occupancyPercent,
        estimatedCostInr: r.gem.estimatedCostInr,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
