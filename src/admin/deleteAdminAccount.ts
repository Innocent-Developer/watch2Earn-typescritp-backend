import { Request, Response } from 'express';
import AdminAccountModel from '../models/admin.account';

export const deleteAdminAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;

    // Validate account ID
    if (!accountId) {
      return res.status(400).json({ message: 'Account ID is required.' });
    }

    // Check if account exists
    const existingAccount = await AdminAccountModel.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    // Check if account is active (optional safety check)
    if (existingAccount.isActive) {
      return res.status(400).json({ 
        message: 'Cannot delete active account. Please deactivate it first or set isActive to false.' 
      });
    }

    // Delete the account
    await AdminAccountModel.findByIdAndDelete(accountId);

    res.status(200).json({ 
      message: 'Admin account deleted successfully',
      deletedAccount: {
        id: existingAccount._id,
        accountNumber: existingAccount.accountNumber,
        accountHolderName: existingAccount.accountHolderName,
        bankName: existingAccount.bankName
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Failed to delete admin account', 
      error: error.message 
    });
  }
};

// Soft delete function (alternative approach - sets isActive to false instead of deleting)
export const softDeleteAdminAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;

    // Validate account ID
    if (!accountId) {
      return res.status(400).json({ message: 'Account ID is required.' });
    }

    // Check if account exists
    const existingAccount = await AdminAccountModel.findById(accountId);
    if (!existingAccount) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    // Soft delete by setting isActive to false
    const softDeletedAccount = await AdminAccountModel.findByIdAndUpdate(
      accountId,
      { isActive: false },
      { new: true }
    );

    res.status(200).json({ 
      message: 'Admin account soft deleted successfully (deactivated)',
      account: softDeletedAccount
    });
  } catch (error: any) {
    res.status(500).json({ 
      message: 'Failed to soft delete admin account', 
      error: error.message 
    });
  }
}; 