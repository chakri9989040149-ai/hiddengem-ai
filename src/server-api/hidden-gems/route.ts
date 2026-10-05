import { NextResponse } from 'next/server';
import { DESTINATIONS } from '@/lib/data/seed';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destinationSlug = searchParams.get('destination') || '';
  const category = searchParams.get('category') || '';

  let allGems = DESTINATIONS.flatMap((d) => d.hiddenGems);

  if (destinationSlug) {
    allGems = allGems.filter((g) => g.destinationSlug === destinationSlug);
  }
  if (category && category !== 'All') {
    allGems = allGems.filter((g) => g.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    count: allGems.length,
    gems: allGems,
  });
}
