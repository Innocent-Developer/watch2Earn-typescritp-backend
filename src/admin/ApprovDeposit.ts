import { Request, Response } from 'express';
import DepositeModel from '../models/deposite.model';
import UserModel from '../models/user.model';

export const approveDeposit = async (req: Request, res: Response) => {
  try {
    const { depositId } = req.params;

    // Find deposit by ID
    const deposit = await DepositeModel.findById(depositId);
    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found.' });
    }

    // Find user by UID from deposit
    const user = await UserModel.findOne({ uid: deposit.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Change user's plan to 'pro'
    user.plan = 'pro';
    await user.save();

    // Optionally, mark deposit as approved (add a status field in schema if needed)
    deposit.status = 'approved';
    await deposit.save();

    res.status(200).json({ message: 'Deposit approved and user plan updated to pro.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to approve deposit', error: error.message });
  }
};