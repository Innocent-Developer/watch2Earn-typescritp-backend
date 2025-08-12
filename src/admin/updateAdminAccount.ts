import { Request, Response } from 'express';
import AdminAccountModel from '../models/admin.account';

export const updateAdminAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const { accountNumber, accountHolderName, bankName, description, isActive } = req.body;

    // Validate account ID
    if (!accountId) {
      return res.status(400).json({ message: 'Account ID is required.' });
    }

    // Check if account exists
    const existingAccount = await AdminAccountModel.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    // Validate required fields
    if (!accountNumber || !accountHolderName || !bankName) {
      return res.status(400).json({ message: 'Account number, holder name, and bank name are required.' });
    }

    // Check for duplicate account number (excluding current account)
    const duplicateAccount = await AdminAccountModel.findOne({ 
      accountNumber, 
      _id: { $ne: accountId } 
    });
    if (duplicateAccount) {
      return res.status(409).json({ message: 'Account number already exists.' });
    }

    // Update account information
    const updatedAccount = await AdminAccountModel.findByIdAndUpdate(
      accountId,
      {
        accountNumber,
        accountHolderName,
        bankName,
        description,
        isActive: isActive !== undefined ? isActive : existingAccount.isActive
      },
      { 
        new: true, 
        runValidators: true 
      }
    );

    res.status(200).json({ 
      message: 'Admin account updated successfully', 
      account: updatedAccount 
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Failed to update admin account', 
      error: error.message 
    });
  }
}; 