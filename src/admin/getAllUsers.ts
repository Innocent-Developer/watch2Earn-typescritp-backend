import { Request, Response } from 'express';
import User from '../models/user.model';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Get all users from database
    const users = await User.find();

    // Return users array
    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error: any) {
    // Handle any errors
    res.status(500).json({
      success: false, 
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    // Check if uid is provided
    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Find and delete user
    const deletedUser = await User.findOneAndDelete({ uid });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

