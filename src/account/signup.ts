import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import bcrypt from 'bcryptjs';

// Utility to generate 6-digit referral code
function generateReferralCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Utility to generate 6-digit UID
function generateUid(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phoneNumber, inviteCode } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Name, email, password, and phone number are required.' });
    }

    // Check for existing user by email or phone
    const existingUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or phone number already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = generateReferralCode();
    const uid = generateUid();

    // If invite code used, increment inviter's totalInvites
    if (inviteCode) {
      const inviter = await UserModel.findOne({ referralCode: inviteCode });
      if (inviter) {
        inviter.totalInvites += 1;
        await inviter.save();
      }
    }

    // Create new user
    const newUser = new UserModel({
      uid, // Add the generated UID here
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      referralCode,
      inviteCode: inviteCode || '',
      plan: 'basic',
      totalBalance: 0,
      totalWithdrawals: 0,
      totalInvites: 0,
    });

    await newUser.save();

    // Convert to plain object and remove password before sending
    const userResponse = newUser.toObject() as any;
    if (userResponse.password) {
      delete userResponse.password;
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Signup failed',
      error: error.message || 'Unknown error',
    });
  }
};
