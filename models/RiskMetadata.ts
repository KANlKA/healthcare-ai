import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRiskMetadata extends Document {
  stepId: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskType: 'medication_interaction' | 'timing_critical' | 'cumulative_effect' | 'safety_concern';
  consequenceDescription: string;
  mitigationGuidance: string;
  disclaimer: string;
  impactFactors: {
    adherenceImportance: number;
    consequenceSeverity: number;
    reversibility: 'reversible' | 'partially_reversible' | 'irreversible';
  };
  createdAt: Date;
  updatedAt: Date;
}

const RiskMetadataSchema = new Schema<IRiskMetadata>(
  {
    stepId: { 
      type: String, 
      required: true,
      index: true,
      unique: true
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
      index: true
    },
    riskType: {
      type: String,
      enum: ['medication_interaction', 'timing_critical', 'cumulative_effect', 'safety_concern'],
      required: true
    },
    consequenceDescription: { 
      type: String, 
      required: true 
    },
    mitigationGuidance: { 
      type: String, 
      required: true 
    },
    disclaimer: { 
      type: String, 
      required: true,
      default: 'This is educational information about care adherence importance, not a medical assessment.'
    },
    impactFactors: {
      adherenceImportance: { 
        type: Number, 
        min: 1, 
        max: 10,
        required: true
      },
      consequenceSeverity: { 
        type: Number, 
        min: 1, 
        max: 10,
        required: true
      },
      reversibility: {
        type: String,
        enum: ['reversible', 'partially_reversible', 'irreversible'],
        required: true
      }
    }
  },
  { 
    timestamps: true,
    collection: 'riskmetadata'
  }
);

// Indexes
RiskMetadataSchema.index({ riskLevel: 1, riskType: 1 });

const RiskMetadata: Model<IRiskMetadata> = 
  mongoose.models.RiskMetadata || 
  mongoose.model<IRiskMetadata>('RiskMetadata', RiskMetadataSchema);

export default RiskMetadata;