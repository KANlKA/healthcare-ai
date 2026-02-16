import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICareStep extends Document {
  stepId: string;
  carePlanId: string;
  description: string;
  medicalContext: string;
  timing: {
    frequency: string;
    timeOfDay: string[];
    duration?: number;
    startDay: number;
    endDay: number;
  };
  category: 'medication' | 'exercise' | 'monitoring' | 'appointment' | 'lifestyle';
  instructions: string;
  dependencies: string[];
  riskLevel: 'low' | 'medium' | 'high';
  complexityScore: number;
  plainLanguageVersion?: string;
  aiGeneratedFields?: {
    explanation: string;
    lastGenerated: Date;
    model: string;
  };
  metadata: {
    estimatedTime: number;
    requiredSupplies: string[];
    warningFlags: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CareStepSchema = new Schema<ICareStep>(
  {
    stepId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    carePlanId: { 
      type: String, 
      required: true,
      index: true
    },
    description: { 
      type: String, 
      required: true 
    },
    medicalContext: { 
      type: String, 
      required: true 
    },
    timing: {
      frequency: { type: String, required: true },
      timeOfDay: [{ type: String }],
      duration: { type: Number },
      startDay: { type: Number, required: true },
      endDay: { type: Number, required: true }
    },
    category: {
      type: String,
      enum: ['medication', 'exercise', 'monitoring', 'appointment', 'lifestyle'],
      required: true,
      index: true
    },
    instructions: { 
      type: String, 
      required: true 
    },
    dependencies: [{ type: String }],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
      index: true
    },
    complexityScore: { 
      type: Number, 
      min: 0, 
      max: 100,
      default: 50
    },
    plainLanguageVersion: { type: String },
    aiGeneratedFields: {
      explanation: { type: String },
      lastGenerated: { type: Date },
      model: { type: String }
    },
    metadata: {
      estimatedTime: { type: Number, default: 15 },
      requiredSupplies: [{ type: String }],
      warningFlags: [{ type: String }]
    }
  },
  { 
    timestamps: true,
    collection: 'caresteps'
  }
);

// Indexes
CareStepSchema.index({ carePlanId: 1, 'timing.startDay': 1 });
CareStepSchema.index({ category: 1, riskLevel: 1 });
CareStepSchema.index({ dependencies: 1 });

const CareStep: Model<ICareStep> = 
  mongoose.models.CareStep || 
  mongoose.model<ICareStep>('CareStep', CareStepSchema);

export default CareStep;