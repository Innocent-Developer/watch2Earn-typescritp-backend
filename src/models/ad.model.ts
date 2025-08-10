import mongoose, { Schema, Document } from 'mongoose';

export interface IAd extends Document {
  name: string;
  videoUrl?: string;
  imageUrl?: string; 
  link: string;
  durationInSeconds: number;
  adId:string;
}

const AdSchema: Schema = new Schema({
  name: { type: String, required: true },
  videoUrl: { type: String },
  imageUrl: { type: String },
  link: { type: String, required: true },
  durationInSeconds: { type: Number, required: true },
  adId: { type: String, required: true }
}, { timestamps: true });

const AdModel = mongoose.model<IAd>('Ad', AdSchema);
export default AdModel;
