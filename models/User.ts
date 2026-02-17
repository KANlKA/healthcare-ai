// models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      index: true
    },
    password: { 
      type: String,
      // Only required for credentials login
      required: function(this: IUser) {
        return !this.provider;
      }
    },
    image: { type: String },
    emailVerified: { type: Date },
    provider: { 
      type: String,
      enum: ['credentials', 'google', 'github'],
      default: 'credentials'
    }
  },
  { 
    timestamps: true,
    collection: 'users'
  }
);

const User: Model<IUser> = 
  mongoose.models.User || 
  mongoose.model<IUser>('User', UserSchema);

export default User;