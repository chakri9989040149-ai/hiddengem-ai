import { NextResponse } from 'next/server';
import { processAgentCommand } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body.prompt || '';
    const currentTrip = body.currentTrip || null;
    const preferences = body.preferences || {
      destinationSlug: 'tirupati',
      travelType: 'Friends',
      groupSize: 4,
      durationDays: 2,
      totalBudgetInr: 10000,
      travelStyle: 'Standard',
      maxTravelTimeMinutes: 60,
      interests: ['Divine', 'Nature'],
    };

    const result = await processAgentCommand(prompt, currentTrip, preferences);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
