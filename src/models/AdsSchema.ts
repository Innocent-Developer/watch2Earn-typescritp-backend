import mongoose, { Schema, Document } from 'mongoose';

export interface IAd extends Document {
  adId: string;
  name: string;
  videoUrl?: string;
  imageUrl?: string;
  link: string;
  duration: number; // in seconds
  createdAt?: Date;
}

const AdsSchema: Schema = new Schema({
  adId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  videoUrl: { type: String },
  imageUrl: { type: String },
  link: { type: String, required: true },
  duration: { type: Number, required: true }, // duration in seconds
}, { timestamps: true });

export default mongoose.model<IAd>('Ad', AdsSchema);