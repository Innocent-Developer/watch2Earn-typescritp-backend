import { Request, Response } from 'express';
import UserModel from '../models/user.model';

export const getUserByUid = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    // Validate UID parameter
    if (!uid || isNaN(Number(uid))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UID provided. UID must be a valid number.'
      });
    }

    // Find user by UID
    const user = await UserModel.findOne({ uid: Number(uid) }).select('-password -__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with the provided UID.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user
      }
    });

  } catch (error: any) {
    console.error('Error fetching user by UID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Get multiple users by UIDs (comma-separated)
export const getUsersByUids = async (req: Request, res: Response) => {
  try {
    const { uids } = req.query;

    if (!uids || typeof uids !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'UIDs parameter is required and must be a comma-separated string.'
      });
    }

    // Parse UIDs from comma-separated string
    const uidArray = uids.split(',').map(uid => Number(uid.trim())).filter(uid => !isNaN(uid));

    if (uidArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid UIDs provided.'
      });
    }

    // Find users by UIDs
    const users = await UserModel.find({ uid: { $in: uidArray } }).select('-password -__v');

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        count: users.length,
        requestedUids: uidArray
      }
    });

  } catch (error: any) {
    console.error('Error fetching users by UIDs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Search users with pagination and filters
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      plan,
      level,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (plan) {
      filter.plan = plan;
    }

    if (level !== undefined) {
      filter.level = Number(level);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const totalUsers = await UserModel.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / Number(limit));

    // Get users with pagination and sorting
    const users = await UserModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-password -__v');

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalUsers,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      }
    });

  } catch (error: any) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
}; 