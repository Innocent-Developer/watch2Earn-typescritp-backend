import { Request, Response } from 'express';
import  Ad  from '../models/ad.model';

export const deleteAd = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Check if ad exists
    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Delete the ad
    await Ad.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Ad deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting ad:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
