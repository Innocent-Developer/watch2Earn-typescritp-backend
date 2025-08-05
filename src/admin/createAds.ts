import { Request, Response } from 'express';
import AdModel from '../models/AdsSchema';

// Utility to generate 4-digit adId
function generateAdId(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export const createAd = async (req: Request, res: Response) => {
  try {
    const { name, videoUrl, imageUrl, link, duration } = req.body;

    if (!name || !link || !duration) {
      return res.status(400).json({ message: 'Name, link, and duration are required.' });
    }

    const adId = generateAdId();

    const newAd = new AdModel({
      adId,
      name,
      videoUrl,
      imageUrl,
      link,
      duration,
    });

    await newAd.save();

    res.status(201).json({ message: 'Ad created successfully', ad: newAd });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create ad', error: error.
        message });
  }
};