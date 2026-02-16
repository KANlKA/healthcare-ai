import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAICache extends Document {
  cacheKey: string;
  promptType: 'explanation' | 'plain_language' | 'summary';
  requestParams: Record<string, any>;
  response: string;
  model: string;
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
    model: { 
      type: String, 
      required: true 
    },
    tokensUsed: { 
      type: Number, 
      default: 0 
    },
    validUntil: { 
      type: Date, 
      required: true,
      index: true
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
```

---

## models/SessionLog.ts
```typescript
// models/SessionLog.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISessionLog extends Document {
  sessionId: string;
  profileId?: string;
  actions: Array<{
    timestamp: Date;
    actionType: string;
    metadata: Record<string, any>;
  }>;
  userAgent: string;
  ipHash: string;
  createdAt: Date;
  expiresAt: Date;
}

const SessionLogSchema = new Schema<ISessionLog>(
  {
    sessionId: { 
      type: String, 
      required: true,
      index: true
    },
    profileId: { 
      type: String,
      index: true
    },
    actions: [{
      timestamp: { type: Date, default: Date.now },
      actionType: { 
        type: String, 
        required: true,
        enum: [
          'profile_view',
          'step_explain',
          'step_simplify',
          'dependency_view',
          'complexity_view',
          'simulation_run',
          'summary_generate'
        ]
      },
      metadata: { type: Schema.Types.Mixed }
    }],
    userAgent: { type: String },
    ipHash: { type: String },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { 
      type: Date, 
      required: true,
      index: true
    }
  },
  { 
    timestamps: false,
    collection: 'sessionlogs'
  }
);

// TTL index - automatically delete after 7 days
SessionLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Additional indexes
SessionLogSchema.index({ sessionId: 1, createdAt: -1 });
SessionLogSchema.index({ profileId: 1, createdAt: -1 });

const SessionLog: Model<ISessionLog> = 
  mongoose.models.SessionLog || 
  mongoose.model<ISessionLog>('SessionLog', SessionLogSchema);

export default SessionLog;