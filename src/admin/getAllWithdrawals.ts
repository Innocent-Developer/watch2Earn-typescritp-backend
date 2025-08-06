import { Request, Response } from 'express';
import WithdrawalRequestModel from '../models/Withdrawal .Request';
import UserModel from '../models/user.model';

export const getAllWithdrawals = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      paymentMethod,
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    const filter: any = {};
    if (status) {
      filter.status = status;
    }
    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const totalWithdrawals = await WithdrawalRequestModel.countDocuments(filter);
    const totalPages = Math.ceil(totalWithdrawals / Number(limit));

    // Get withdrawals with pagination and sorting
    const withdrawals = await WithdrawalRequestModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v'); // Exclude version key

    // Populate user information for each withdrawal
    const withdrawalsWithUserInfo = await Promise.all(
      withdrawals.map(async (withdrawal) => {
        const user = await UserModel.findOne({ email: withdrawal.emailAddress })
          .select('name uid phoneNumber plan totalBalance totalWithdrawals level');
        
        return {
          ...withdrawal.toObject(),
          user: user || null
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Withdrawal requests retrieved successfully',
      data: {
        withdrawals: withdrawalsWithUserInfo,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalWithdrawals,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch withdrawal requests', 
      error: error.message 
    });
  }
};

// Get withdrawal statistics for admin dashboard
export const getWithdrawalStats = async (req: Request, res: Response) => {
  try {
    const totalWithdrawals = await WithdrawalRequestModel.countDocuments();
    const pendingWithdrawals = await WithdrawalRequestModel.countDocuments({ status: 'pending' });
    const approvedWithdrawals = await WithdrawalRequestModel.countDocuments({ status: 'approved' });
    const rejectedWithdrawals = await WithdrawalRequestModel.countDocuments({ status: 'rejected' });

    // Calculate total amounts
    const totalAmount = await WithdrawalRequestModel.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const approvedAmount = await WithdrawalRequestModel.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const pendingAmount = await WithdrawalRequestModel.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get payment method distribution
    const paymentMethodStats = await WithdrawalRequestModel.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Withdrawal statistics retrieved successfully',
      data: {
        totalWithdrawals,
        pendingWithdrawals,
        approvedWithdrawals,
        rejectedWithdrawals,
        totalAmount: totalAmount[0]?.total || 0,
        approvedAmount: approvedAmount[0]?.total || 0,
        pendingAmount: pendingAmount[0]?.total || 0,
        paymentMethodStats
      }
    });

  } catch (error: any) {
    console.error('Error fetching withdrawal statistics:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch withdrawal statistics', 
      error: error.message 
    });
  }
};

// Get withdrawal requests by user email
export const getWithdrawalsByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      status,
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    const filter: any = { emailAddress: email };
    if (status) {
      filter.status = status;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const totalWithdrawals = await WithdrawalRequestModel.countDocuments(filter);
    const totalPages = Math.ceil(totalWithdrawals / Number(limit));

    // Get withdrawals with pagination and sorting
    const withdrawals = await WithdrawalRequestModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    // Get user information
    const user = await UserModel.findOne({ email })
      .select('name uid phoneNumber plan totalBalance totalWithdrawals level');

    res.status(200).json({
      success: true,
      message: 'User withdrawal requests retrieved successfully',
      data: {
        user,
        withdrawals,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalWithdrawals,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching user withdrawal requests:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user withdrawal requests', 
      error: error.message 
    });
  }
};

// Search withdrawal requests with advanced filters
export const searchWithdrawals = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      status,
      paymentMethod,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { emailAddress: { $regex: search, $options: 'i' } },
        { accountHolderName: { $regex: search, $options: 'i' } },
        { bankName: { $regex: search, $options: 'i' } },
        { accountNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate as string);
      if (endDate) filter.createdAt.$lte = new Date(endDate as string);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const totalWithdrawals = await WithdrawalRequestModel.countDocuments(filter);
    const totalPages = Math.ceil(totalWithdrawals / Number(limit));

    // Get withdrawals with pagination and sorting
    const withdrawals = await WithdrawalRequestModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    // Populate user information for each withdrawal
    const withdrawalsWithUserInfo = await Promise.all(
      withdrawals.map(async (withdrawal) => {
        const user = await UserModel.findOne({ email: withdrawal.emailAddress })
          .select('name uid phoneNumber plan totalBalance totalWithdrawals level');
        
        return {
          ...withdrawal.toObject(),
          user: user || null
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Withdrawal requests retrieved successfully',
      data: {
        withdrawals: withdrawalsWithUserInfo,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalWithdrawals,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      }
    });

  } catch (error: any) {
    console.error('Error searching withdrawal requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search withdrawal requests',
      error: error.message
    });
  }
}; 