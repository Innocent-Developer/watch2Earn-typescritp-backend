import { Request, Response } from 'express';
import WithdrawalRequestModel from '../models/Withdrawal .Request';

export const getUserWithdrawalsByUid = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: 'UID is required.' });
    }

    // Find withdrawal requests by uid
    const requests = await WithdrawalRequestModel.find({ uid });

    res.status(200).json({ requests });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch withdrawal requests', error: error.message });
  }
};