import { Request, Response } from 'express';
import AdModel from '../models/ad.model';

export const getAllAds = async (req: Request, res: Response) => {
  try {
    // Get all ads from database
    const ads = await AdModel.find();

    // Return ads array
    res.status(200).json({
      success: true,
      data: ads
    });

  } catch (error: any) {
    // Handle any errors
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ads',
      error: error.message
    });
  }
};
