import { Request, Response } from 'express';
import DepositeModel from '../models/deposite.model';

export const getAllDeposits = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const totalDeposits = await DepositeModel.countDocuments(filter);
    const totalPages = Math.ceil(totalDeposits / Number(limit));

    // Get deposits with pagination and sorting
    const deposits = await DepositeModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v'); // Exclude version key

    res.status(200).json({
      success: true,
      message: 'Deposits retrieved successfully',
      data: {
        deposits,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalDeposits,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch deposits', 
      error: error.message 
    });
  }
};

// Get deposit statistics for admin dashboard
export const getDepositStats = async (req: Request, res: Response) => {
  try {
    const totalDeposits = await DepositeModel.countDocuments();
    const pendingDeposits = await DepositeModel.countDocuments({ status: 'pending' });
    const approvedDeposits = await DepositeModel.countDocuments({ status: 'approved' });
    const rejectedDeposits = await DepositeModel.countDocuments({ status: 'rejected' });

    // Calculate total amount
    const totalAmount = await DepositeModel.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Deposit statistics retrieved successfully',
      data: {
        totalDeposits,
        pendingDeposits,
        approvedDeposits,
        rejectedDeposits,
        totalAmount: totalAmount[0]?.total || 0
      }
    });

  } catch (error: any) {
    console.error('Error fetching deposit statistics:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch deposit statistics', 
      error: error.message 
    });
  }
}; 