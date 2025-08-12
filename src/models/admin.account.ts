import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminAccount extends Document {
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  currency?: string;
  description?: string;
  isActive: boolean;
}

const AdminAccountSchema: Schema = new Schema({
  accountNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  accountHolderName: { 
    type: String, 
    required: true,
    trim: true
  },
  bankName: { 
    type: String, 
    required: true,
    trim: true
  },
  
  isActive: { 
    type: Boolean,
    default: true
  },
  description: { 
    type: String,
    trim: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
AdminAccountSchema.index({ accountNumber: 1 });
AdminAccountSchema.index({ bankName: 1 });
AdminAccountSchema.index({ isActive: 1 });

export default mongoose.model<IAdminAccount>('AdminAccount', AdminAccountSchema);
