import { Request, Response } from 'express';
import WithdrawalRequestModel from '../models/Withdrawal .Request';
import UserModel from '../models/user.model';

export const approveWithdrawal = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    // Find withdrawal request
    const withdrawal = await WithdrawalRequestModel.findById(requestId);
    if (!withdrawal) {
      return res.status(404).json({ message: 'Withdrawal request not found.' });
    }

    // Find user by email
    const user = await UserModel.findOne({ email: withdrawal.emailAddress });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user has enough balance
    if (user.totalBalance < withdrawal.amount) {
      return res.status(400).json({ message: 'Insufficient balance.' });
    }

    // Deduct balance and increment totalWithdrawals
    user.totalBalance -= withdrawal.amount;
    user.totalWithdrawals += withdrawal.amount;
    await user.save();

    // Optionally, mark withdrawal as approved (add a status field in schema if needed)
    withdrawal.status = 'approved';
    await withdrawal.save();

    res.status(200).json({ message: 'Withdrawal approved and balance updated.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to approve withdrawal', error: error.message });
  }
};