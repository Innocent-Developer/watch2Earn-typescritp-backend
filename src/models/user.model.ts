import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  uid:Number;
  phoneNumber: string;
  email: string;
  password: string;
  plan: string;
  referralCode: string;
  inviteCode: string;
  totalBalance: number;
  totalWithdrawals: number;
  totalInvites: number;
  profilePicture?: string; // Optional field for profile picture  
  level: number;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  uid:{type:Number,},
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'basic' },
  profilePicture: { type: String, default: '' }, // Optional field for profile picture
  referralCode: { type: String },
  inviteCode: { type: String },
  totalBalance: { type: Number, default: 0 },
  totalWithdrawals: { type: Number, default: 0 },
  totalInvites: { type: Number, default: 0 },
  level: { type: Number, default: 0},
}, { timestamps: true ,
  
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;