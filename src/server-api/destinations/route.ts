import { NextResponse } from 'next/server';
import { DESTINATIONS } from '@/lib/data/seed';

export async function GET() {
  return NextResponse.json({
    success: true,
    destinations: DESTINATIONS.map((d) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      state: d.state,
      country: d.country,
      mainAttractionName: d.mainAttractionName,
      tagline: d.tagline,
      coordinates: d.coordinates,
      heroImage: d.heroImage,
      gemsCount: d.hiddenGems.length,
      defaultCrowd: d.defaultCrowd,
    })),
  });
}
