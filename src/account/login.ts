import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Convert Mongoose document to plain object
    const userResponse = user.toObject() as any;
    delete userResponse.password;

    // Success response
    res.status(200).json({ message: 'Login successful', user: userResponse });
  } catch (error: any) {
    res.status(500).json({
      message: 'Login failed',
      error: error.message || 'Unknown error',
    });
  }
};
