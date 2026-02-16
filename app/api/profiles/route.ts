// app/api/profiles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SyntheticProfile from '@/models/SyntheticProfile';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const profiles = await SyntheticProfile
      .find({ syntheticDataMarker: true })
      .select('profileId name age gender scenarioDescription complexityLevel tags')
      .lean()
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { 
        profiles,
        count: profiles.length 
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching profiles:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch profiles',
        message: error.message 
      },
      { status: 500 }
    );
  }
}