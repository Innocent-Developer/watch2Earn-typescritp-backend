import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminAccount extends Document {
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
}

const AdminAccountSchema: Schema = new Schema({
  accountNumber: { type: String, required: true, unique: true },
  accountHolderName: { type: String, required: true },
  bankName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IAdminAccount>('AdminAccount', AdminAccountSchema);
