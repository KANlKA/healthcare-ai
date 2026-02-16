import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDependency extends Document {
  dependencyId: string;
  sourceStepId: string;
  targetStepId: string;
  dependencyType: 'prerequisite' | 'timing_constraint' | 'interaction_warning' | 'complementary';
  explanation: string;
  criticality: 'informational' | 'recommended' | 'required';
  timingConstraint?: {
    minHoursBefore?: number;
    maxHoursBefore?: number;
  };
  carePlanId: string;
  createdAt: Date;
  updatedAt: Date;
}

const DependencySchema = new Schema<IDependency>(
  {
    dependencyId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    sourceStepId: { 
      type: String, 
      required: true,
      index: true
    },
    targetStepId: { 
      type: String, 
      required: true,
      index: true
    },
    dependencyType: {
      type: String,
      enum: ['prerequisite', 'timing_constraint', 'interaction_warning', 'complementary'],
      required: true
    },
    explanation: { 
      type: String, 
      required: true 
    },
    criticality: {
      type: String,
      enum: ['informational', 'recommended', 'required'],
      required: true,
      default: 'recommended'
    },
    timingConstraint: {
      minHoursBefore: { type: Number },
      maxHoursBefore: { type: Number }
    },
    carePlanId: { 
      type: String, 
      required: true,
      index: true
    }
  },
  { 
    timestamps: true,
    collection: 'dependencies'
  }
);

// Indexes
DependencySchema.index({ sourceStepId: 1, targetStepId: 1 });
DependencySchema.index({ carePlanId: 1, criticality: 1 });

const Dependency: Model<IDependency> = 
  mongoose.models.Dependency || 
  mongoose.model<IDependency>('Dependency', DependencySchema);

export default Dependency;