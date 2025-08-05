import { Request, Response } from 'express';
import AdminAccountModel from '../models/admin.account';

export const addAdminAccount = async (req: Request, res: Response) => {
  try {
    const { accountNumber, accountHolderName, bankName } = req.body;

    // Validate required fields
    if (!accountNumber || !accountHolderName || !bankName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check for duplicate account number
    const existingAccount = await AdminAccountModel.findOne({ accountNumber });
    if (existingAccount) {
      return res.status(409).json({ message: 'Account number already exists.' });
    }

    // Create new admin account
    const newAccount = new AdminAccountModel({
      accountNumber,
      accountHolderName,
      bankName,
    });

    await newAccount.save();

    res.status(201).json({ message: 'Admin account added successfully', account: newAccount });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to add admin account', error: error.message });
  }
};