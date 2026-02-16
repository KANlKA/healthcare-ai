import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISyntheticProfile extends Document {
  profileId: string;
  name: string;
  age: number;
  gender: string;
  scenarioDescription: string;
  carePlanId: string;
  complexityLevel: 'low' | 'moderate' | 'high';
  languagePreference: string;
  literacyLevel: 'basic' | 'intermediate' | 'advanced';
  syntheticDataMarker: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SyntheticProfileSchema = new Schema<ISyntheticProfile>(
  {
    profileId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    age: { 
      type: Number, 
      required: true,
      min: 0,
      max: 120
    },
    gender: { 
      type: String, 
      required: true 
    },
    scenarioDescription: { 
      type: String, 
      required: true 
    },
    carePlanId: { 
      type: String, 
      required: true,
      index: true
    },
    complexityLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      required: true,
      index: true
    },
    languagePreference: { 
      type: String, 
      default: 'en' 
    },
    literacyLevel: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    syntheticDataMarker: { 
      type: Boolean, 
      default: true, 
      required: true 
    },
    tags: [{ type: String, index: true }]
  },
  { 
    timestamps: true,
    collection: 'syntheticprofiles'
  }
);

// Indexes
SyntheticProfileSchema.index({ complexityLevel: 1, tags: 1 });
SyntheticProfileSchema.index({ createdAt: -1 });

const SyntheticProfile: Model<ISyntheticProfile> = 
  mongoose.models.SyntheticProfile || 
  mongoose.model<ISyntheticProfile>('SyntheticProfile', SyntheticProfileSchema);

export default SyntheticProfile;