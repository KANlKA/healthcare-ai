// scripts/seed-database.ts
import mongoose from 'mongoose';
import { config } from 'dotenv';
import SyntheticProfile from '../models/SyntheticProfile';
import CarePlan from '../models/CarePlan';
import CareStep from '../models/CareStep';
import Dependency from '../models/Dependency';
import RiskMetadata from '../models/RiskMetadata';

config();

const PROFILES = [
  {
    profileId: 'profile_001',
    name: 'Alex Johnson (Synthetic)',
    age: 45,
    gender: 'Non-binary',
    scenarioDescription: 'Post-surgical recovery following knee replacement',
    carePlanId: 'template_knee_001',
    complexityLevel: 'moderate',
    languagePreference: 'en',
    literacyLevel: 'intermediate',
    syntheticDataMarker: true,
    tags: ['surgery', 'orthopedic', 'rehabilitation']
  },
  {
    profileId: 'profile_002',
    name: 'Maria Garcia (Synthetic)',
    age: 62,
    gender: 'Female',
    scenarioDescription: 'Type 2 diabetes management',
    carePlanId: 'template_diabetes_001',
    complexityLevel: 'high',
    languagePreference: 'en',
    literacyLevel: 'basic',
    syntheticDataMarker: true,
    tags: ['chronic-condition', 'diabetes']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      SyntheticProfile.deleteMany({}),
      CarePlan.deleteMany({}),
      CareStep.deleteMany({}),
      Dependency.deleteMany({}),
      RiskMetadata.deleteMany({})
    ]);
    console.log('✅ Cleared existing data');

    // Insert profiles
    await SyntheticProfile.insertMany(PROFILES);
    console.log('✅ Seeded profiles');

    // Add more seeding logic here...

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
```