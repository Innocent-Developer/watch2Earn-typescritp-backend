import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawalRequest extends Document {
  amount: number;
  paymentMethod: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  emailAddress: string;
  status?: string; // Add status field
}

const WithdrawalRequestSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true }, // e.g., 'Bank Transfer'
  bankName: { type: String },
  accountHolderName: { type: String },
  accountNumber: { type: String },
  emailAddress: { type: String, required: true },
  status: { type: String, default: 'pending' } // Set default value for status
}, { timestamps: true });

export default mongoose.model<IWithdrawalRequest>('WithdrawalRequest', WithdrawalRequestSchema);
