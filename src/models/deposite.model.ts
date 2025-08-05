import mongoose, { Schema, Document } from 'mongoose';

export interface IDeposite extends Document {
  amount: string;
  bankName: string;
  transactionId: string;
  senderName: string;
  senderPhone: string;
    uid?: Number; // Optional field for user ID
  status?: string; // Add status field
}

const DepositeSchema: Schema = new Schema({
  amount: { type: String, required: true },
  bankName: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  senderName: { type: String, required: true },
  senderPhone: { type: String, required: true },
    uid: { type: Number, required: false }, // Optional field for user ID
  status: { type: String, default: 'pending' }
}, { timestamps: true });

const DepositeModel = mongoose.model<IDeposite>('Deposite', DepositeSchema);
export default DepositeModel;