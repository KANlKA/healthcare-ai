import SyntheticProfile from '@/models/SyntheticProfile';
import CarePlan from '@/models/CarePlan';
import connectDB from '@/lib/mongodb';

class ProfileService {
  async getAllProfiles() {
    await connectDB();
    return await SyntheticProfile
      .find({ syntheticDataMarker: true })
      .select('profileId name age gender scenarioDescription complexityLevel tags')
      .lean()
      .sort({ createdAt: -1 });
  }

  async getProfileById(profileId: string) {
    await connectDB();
    const profile = await SyntheticProfile.findOne({ profileId }).lean();
    if (!profile) return null;

    const carePlan = await CarePlan.findOne({ templateId: profile.carePlanId }).lean();
    return { profile, carePlan };
  }

  async getProfilesByComplexity(level: 'low' | 'moderate' | 'high') {
    await connectDB();
    return await SyntheticProfile
      .find({ complexityLevel: level, syntheticDataMarker: true })
      .lean();
  }

  async getProfilesByTag(tag: string) {
    await connectDB();
    return await SyntheticProfile
      .find({ tags: tag, syntheticDataMarker: true })
      .lean();
  }
}

export const profileService = new ProfileService();