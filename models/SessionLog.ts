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
