import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICarePlan extends Document {
  templateId: string;
  scenarioName: string;
  description: string;
  durationDays: number;
  targetPersonas: string[];
  educationalObjectives: string[];
  complexityMetrics: {
    overallScore: number;
    stepCount: number;
    avgDependencyDepth: number;
    concurrentActivities: number;
  };
  stepsOrder: string[];
  dependencyGraph: {
    nodes: Array<{ id: string; label: string }>;
    edges: Array<{ source: string; target: string; type: string }>;
  };
  tags: string[];
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const CarePlanSchema = new Schema<ICarePlan>(
  {
    templateId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    scenarioName: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    durationDays: { 
      type: Number, 
      required: true,
      min: 1
    },
    targetPersonas: [{ type: String }],
    educationalObjectives: [{ type: String }],
    complexityMetrics: {
      overallScore: { type: Number, min: 0, max: 100 },
      stepCount: { type: Number },
      avgDependencyDepth: { type: Number },
      concurrentActivities: { type: Number }
    },
    stepsOrder: [{ type: String }],
    dependencyGraph: {
      nodes: [{ 
        id: { type: String },
        label: { type: String }
      }],
      edges: [{ 
        source: { type: String },
        target: { type: String },
        type: { type: String }
      }]
    },
    tags: [{ type: String, index: true }],
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true
    }
  },
  { 
    timestamps: true,
    collection: 'careplans'
  }
);

// Indexes
CarePlanSchema.index({ status: 1, tags: 1 });
CarePlanSchema.index({ 'complexityMetrics.overallScore': 1 });

const CarePlan: Model<ICarePlan> = 
  mongoose.models.CarePlan || 
  mongoose.model<ICarePlan>('CarePlan', CarePlanSchema);

export default CarePlan;