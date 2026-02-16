import mongoose from 'mongoose';
import { config } from 'dotenv';
import SyntheticProfile from '../models/SyntheticProfile';
import CarePlan from '../models/CarePlan';

config();

const scenarios = [
  {
    condition: 'Hypertension',
    description: 'Blood pressure management with lifestyle modifications',
    complexity: 'low',
    duration: 90
  },
  {
    condition: 'Post-surgical',
    description: 'Recovery following cardiac surgery',
    complexity: 'high',
    duration: 60
  },
  {
    condition: 'Asthma',
    description: 'Chronic asthma management and monitoring',
    complexity: 'moderate',
    duration: 180
  }
];

async function generateProfiles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    for (const scenario of scenarios) {
      const profileId = `profile_${scenario.condition.toLowerCase()}_${Date.now()}`;
      const carePlanId = `template_${scenario.condition.toLowerCase()}_001`;

      // Create care plan
      await CarePlan.create({
        templateId: carePlanId,
        scenarioName: `${scenario.condition} Management`,
        description: scenario.description,
        durationDays: scenario.duration,
        targetPersonas: ['patient', 'caregiver'],
        educationalObjectives: [
          'Understand condition management',
          'Learn adherence importance',
          'Recognize warning signs'
        ],
        complexityMetrics: {
          overallScore: scenario.complexity === 'high' ? 75 : scenario.complexity === 'moderate' ? 50 : 25,
          stepCount: 0,
          avgDependencyDepth: 0,
          concurrentActivities: 0
        },
        stepsOrder: [],
        dependencyGraph: { nodes: [], edges: [] },
        tags: [scenario.condition.toLowerCase()],
        status: 'active'
      });

      // Create profile
      await SyntheticProfile.create({
        profileId,
        name: `${scenario.condition} Patient (Synthetic)`,
        age: 45 + Math.floor(Math.random() * 30),
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        scenarioDescription: scenario.description,
        carePlanId,
        complexityLevel: scenario.complexity,
        languagePreference: 'en',
        literacyLevel: 'intermediate',
        syntheticDataMarker: true,
        tags: [scenario.condition.toLowerCase(), 'generated']
      });

      console.log(`✅ Generated profile: ${profileId}`);
    }

    console.log('✅ Profile generation complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Generation failed:', error);
    process.exit(1);
  }
}

generateProfiles();