import { NextResponse } from 'next/server';
import { predictCrowdLevel } from '@/lib/crowd';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const destinationSlug = body.destinationSlug || 'tirupati';
    const override = body.adminOverrideLevel || null;

    const prediction = predictCrowdLevel(destinationSlug, new Date(), override);

    return NextResponse.json({
      success: true,
      destinationSlug,
      prediction,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
