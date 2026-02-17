import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { ageRange, gender, conditions, hasMedications, medications } = body;

    await connectDB();

    // Upsert user profile (create if not exists, update if exists)
    const profile = await UserProfile.findOneAndUpdate(
      { email: session.user.email },
      {
        email: session.user.email,
        name: session.user.name,
        ageRange,
        gender,
        conditions,
        hasMedications,
        medications,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      profile: {
        ageRange: profile.ageRange,
        conditions: profile.conditions,
        medicationCount: profile.medications?.length || 0,
      }
    });

  } catch (error: any) {
    console.error('Onboarding save error:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const profile = await UserProfile.findOne({ email: session.user.email }).lean();

    return NextResponse.json({
      onboardingCompleted: profile?.onboardingCompleted || false,
      profile: profile || null,
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
