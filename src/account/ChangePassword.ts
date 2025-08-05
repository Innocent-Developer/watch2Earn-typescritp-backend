import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import bcrypt from 'bcryptjs';

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { uid, oldPassword, newPassword } = req.body;

    if (!uid || !oldPassword || !newPassword) {
      return res.status(400).json({ message: 'UID, old password, and new password are required.' });
    }

    const user = await UserModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};