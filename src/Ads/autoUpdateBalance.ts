import { Request, Response } from 'express';
import UserModel from '../models/user.model';

export const autoUpdateBalance = async (req: Request, res: Response) => {
  try {
    const { uid, amount } = req.body;

    // Validate inputs
    if (!uid || typeof amount !== 'number') {
      return res.status(400).json({ message: 'UID and amount are required' });
    }

    // Find the user by UID
    const user = await UserModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update totalBalance
    user.totalBalance = (user.totalBalance || 0) + amount;
    await user.save();

    res.status(200).json({
      message: 'Balance updated successfully',
      uid: user.uid,
      newBalance: user.totalBalance
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update balance',
      error: error instanceof Error ? error.message : error
    });
  }
};
