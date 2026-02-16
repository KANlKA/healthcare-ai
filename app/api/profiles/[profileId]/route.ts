// app/api/profiles/[profileId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SyntheticProfile from '@/models/SyntheticProfile';
import CarePlan from '@/models/CarePlan';
import CareStep from '@/models/CareStep';

export async function GET(
  request: NextRequest,
  { params }: { params: { profileId: string } }
) {
  try {
    await connectDB();

    const { profileId } = params;

    // Fetch profile
    const profile = await SyntheticProfile
      .findOne({ profileId })
      .lean();

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Fetch associated care plan
    const carePlan = await CarePlan
      .findOne({ templateId: profile.carePlanId })
      .lean();

    if (!carePlan) {
      return NextResponse.json(
        { error: 'Care plan not found' },
        { status: 404 }
      );
    }

    // Fetch care steps
    const steps = await CareStep
      .find({ carePlanId: profile.carePlanId })
      .sort({ 'timing.startDay': 1 })
      .lean();

    return NextResponse.json(
      {
        profile,
        carePlan,
        steps,
        stepsCount: steps.length
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch profile',
        message: error.message 
      },
      { status: 500 }
    );
  }
}