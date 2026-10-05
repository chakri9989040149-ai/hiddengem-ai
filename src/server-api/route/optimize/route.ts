import { NextResponse } from 'next/server';
import { optimizeRouteStops } from '@/lib/route-optimizer';
import { DESTINATIONS } from '@/lib/data/seed';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const destinationSlug = body.destinationSlug || 'tirupati';
    const destination =
      DESTINATIONS.find((d) => d.slug === destinationSlug) || DESTINATIONS[0];

    const gemsToRoute = body.gems || destination.hiddenGems.slice(0, 3);
    const optimized = optimizeRouteStops(destination.coordinates, gemsToRoute);

    return NextResponse.json({
      success: true,
      optimized,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
