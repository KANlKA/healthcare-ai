import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAICache extends Document {
  cacheKey: string;
  promptType: 'explanation' | 'plain_language' | 'summary';
  requestParams: Record<string, any>;
  response: string;
  modelName: string;
  tokensUsed: number;
  validUntil: Date;
  hitCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AICacheSchema = new Schema<IAICache>(
  {
    cacheKey: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    promptType: {
      type: String,
      enum: ['explanation', 'plain_language', 'summary'],
      required: true,
      index: true
    },
    requestParams: { 
      type: Schema.Types.Mixed, 
      required: true 
    },
    response: { 
      type: String, 
      required: true 
    },
    modelName: {
      type: String,
      required: true
    },
    tokensUsed: { 
      type: Number, 
      default: 0 
    },
    validUntil: {
      type: Date,
      required: true
    },
    hitCount: { 
      type: Number, 
      default: 1 
    }
  },
  { 
    timestamps: true,
    collection: 'aicache'
  }
);

// TTL index - automatically delete expired documents
AICacheSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0 });

// Compound indexes
AICacheSchema.index({ promptType: 1, validUntil: 1 });
AICacheSchema.index({ createdAt: -1 });

const AICache: Model<IAICache> = 
  mongoose.models.AICache || 
  mongoose.model<IAICache>('AICache', AICacheSchema);

export default AICache;