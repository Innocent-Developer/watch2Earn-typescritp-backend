import { Request, Response } from 'express';
import WithdrawalRequestModel from '../models/Withdrawal .Request';
import DepositeModel from '../models/deposite.model';
import UserModel from '../models/user.model';

// Get user withdrawals by email (since withdrawal model uses email)
export const getUserWithdrawals = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Find withdrawal requests by email
    const withdrawals = await WithdrawalRequestModel.find({ emailAddress: email })
      .sort({ createdAt: -1 })
      .select('-__v');

    // Get user info
    const user = await UserModel.findOne({ email }).select('name uid phoneNumber plan totalBalance totalWithdrawals level');

    res.status(200).json({
      success: true,
      message: 'User withdrawals retrieved successfully',
      data: {
        user: user || null,
        withdrawals,
        totalWithdrawals: withdrawals.length,
        totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0)
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user withdrawals', 
      error: error.message 
    });
  }
};

// Get user deposits by UID
export const getUserDeposits = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: 'UID is required.' });
    }

    // Find deposits by UID
    const deposits = await DepositeModel.find({ uid: Number(uid) })
      .sort({ createdAt: -1 })
      .select('-__v');

    // Get user info
    const user = await UserModel.findOne({ uid: Number(uid) }).select('name uid phoneNumber plan totalBalance level');

    res.status(200).json({
      success: true,
      message: 'User deposits retrieved successfully',
      data: {
        user: user || null,
        deposits,
        totalDeposits: deposits.length,
        totalAmount: deposits.reduce((sum, d) => sum + Number(d.amount), 0),
        pendingDeposits: deposits.filter(d => d.status === 'pending').length,
        approvedDeposits: deposits.filter(d => d.status === 'approved').length
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user deposits', 
      error: error.message 
    });
  }
};

// Get user referral information and invited users
export const getUserReferrals = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: 'UID is required.' });
    }

    // Get user info with referral details
    const user = await UserModel.findOne({ uid: Number(uid) })
      .select('name uid phoneNumber plan referralCode inviteCode totalInvites level');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Find users who were invited by this user (using referralCode)
    const invitedUsers = await UserModel.find({ 
      inviteCode: user.referralCode 
    }).select('name uid phoneNumber plan totalBalance level createdAt');

    // Calculate referral statistics
    const referralStats = {
      totalInvites: invitedUsers.length,
      activeInvites: invitedUsers.filter(u => u.level > 0).length,
      totalReferralEarnings: invitedUsers.reduce((sum, u) => sum + u.totalBalance, 0)
    };

    res.status(200).json({
      success: true,
      message: 'User referral information retrieved successfully',
      data: {
        user: {
          name: user.name,
          uid: user.uid,
          referralCode: user.referralCode,
          inviteCode: user.inviteCode,
          totalInvites: user.totalInvites,
          level: user.level
        },
        invitedUsers,
        referralStats
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user referral information', 
      error: error.message 
    });
  }
};

// Get comprehensive user data (withdrawals, deposits, referrals)
export const getUserCompleteData = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({ message: 'UID is required.' });
    }

    // Get user basic info
    const user = await UserModel.findOne({ uid: Number(uid) })
      .select('name uid phoneNumber plan referralCode inviteCode totalBalance totalWithdrawals totalInvites level createdAt');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get user deposits
    const deposits = await DepositeModel.find({ uid: Number(uid) })
      .sort({ createdAt: -1 })
      .select('-__v');

    // Get user withdrawals (by email)
    const withdrawals = await WithdrawalRequestModel.find({ emailAddress: user.email })
      .sort({ createdAt: -1 })
      .select('-__v');

    // Get invited users
    const invitedUsers = await UserModel.find({ 
      inviteCode: user.referralCode 
    }).select('name uid phoneNumber plan totalBalance level createdAt');

    // Calculate comprehensive statistics
    const stats = {
      deposits: {
        total: deposits.length,
        totalAmount: deposits.reduce((sum, d) => sum + Number(d.amount), 0),
        pending: deposits.filter(d => d.status === 'pending').length,
        approved: deposits.filter(d => d.status === 'approved').length
      },
      withdrawals: {
        total: withdrawals.length,
        totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
        pending: withdrawals.filter(w => w.status === 'pending').length,
        approved: withdrawals.filter(w => w.status === 'approved').length
      },
      referrals: {
        totalInvites: invitedUsers.length,
        activeInvites: invitedUsers.filter(u => u.level > 0).length,
        totalReferralEarnings: invitedUsers.reduce((sum, u) => sum + u.totalBalance, 0)
      }
    };

    res.status(200).json({
      success: true,
      message: 'Complete user data retrieved successfully',
      data: {
        user,
        deposits,
        withdrawals,
        invitedUsers,
        stats
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch complete user data', 
      error: error.message 
    });
  }
}; 