import { Request, Response } from 'express';
import UserModel from '../models/user.model';

export const teamShow = async (req: Request, res: Response) => {
  try {
    // Get user's referral code from params or query
    const { referralCode } = req.params;

    if (!referralCode) {
      return res.status(400).json({ message: 'Referral code is required.' });
    }

    // Find all users who were invited by this referral code
    const invitedUsers = await UserModel.find({ inviteCode: referralCode });

    // Prepare the list with required fields
    const userList = invitedUsers.map(user => ({
      name: user.name,
      uid: user.uid,
      image: user.profilePicture || '', // Assuming image field exists
      plan: user.plan,
    }));

    res.status(200).json({
      totalInvited: invitedUsers.length,
      users: userList,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch team', error: error.message });
  }
};