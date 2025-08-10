import { Request, Response } from 'express';
import AdModel from '../models/ad.model';

export const createAd = async (req: Request, res: Response) => {
  try {
    const {
      name,
      videoUrl,
      imageUrl,
      link,
      durationInSeconds
    } = req.body;

    // Validate required fields
    if (!name || !link || !durationInSeconds) {
      return res.status(400).json({
        success: false,
        message: 'Name, link and duration are required fields'
      });
    }

    // Generate a unique adId to prevent duplicate key errors
    const adId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create new ad
    const newAd = new AdModel({
      adId, // Add the auto-generated unique adId
      name,
      videoUrl,
      imageUrl,
      link,
      durationInSeconds
    });

    // Save ad to database
    await newAd.save();

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: newAd
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create ad',
      error: error.message
    });
  }
};
