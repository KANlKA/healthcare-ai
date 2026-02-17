import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
}

export interface IUserProfile extends Document {
  email: string;
  name?: string;
  ageRange?: string;
  gender?: string;
  country?: string;
  conditions: string[];
  hasMedications: boolean;
  medications: IMedication[];
  caregiverEnabled: boolean;
  onboardingCompleted: boolean;
  onboardingCompletedAt?: Date;
  // Behavioral (auto-collected later)
  adherenceRate?: number;
  engagementScore?: number;
  streak?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  dosage: String,
  frequency: String,
  time: String,
});

const UserProfileSchema = new Schema<IUserProfile>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: String,
    ageRange: String,
    gender: String,
    country: { type: String, default: 'US' },
    conditions: [{ type: String }],
    hasMedications: { type: Boolean, default: false },
    medications: [MedicationSchema],
    caregiverEnabled: { type: Boolean, default: false },
    onboardingCompleted: { type: Boolean, default: false },
    onboardingCompletedAt: Date,
    adherenceRate: Number,
    engagementScore: Number,
    streak: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'userprofiles',
  }
);

const UserProfile: Model<IUserProfile> =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

export default UserProfile;