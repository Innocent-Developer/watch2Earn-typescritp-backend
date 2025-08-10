import { Request, Response } from 'express';
import AdModel from '../models/ad.model';

export const getAllAds = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      type, // video or image
      minDuration,
      maxDuration,
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { link: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      if (type === 'video') {
        filter.videoUrl = { $exists: true, $ne: '' };
      } else if (type === 'image') {
        filter.imageUrl = { $exists: true, $ne: '' };
      }
    }

    if (minDuration || maxDuration) {
      filter.durationInSeconds = {};
      if (minDuration) filter.durationInSeconds.$gte = Number(minDuration);
      if (maxDuration) filter.durationInSeconds.$lte = Number(maxDuration);
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get total count for pagination
    const totalAds = await AdModel.countDocuments(filter);
    const totalPages = Math.ceil(totalAds / Number(limit));

    // Get ads with pagination and sorting
    const ads = await AdModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v'); // Exclude version key

    res.status(200).json({
      success: true,
      message: 'Ads retrieved successfully',
      data: {
        ads,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalAds,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching ads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ads',
      error: error.message 
    });
  }
};

// Get ad statistics for admin dashboard
export const getAdStats = async (req: Request, res: Response) => {
  try {
    const totalAds = await AdModel.countDocuments();
    const videoAds = await AdModel.countDocuments({ videoUrl: { $exists: true, $ne: '' } });
    const imageAds = await AdModel.countDocuments({ imageUrl: { $exists: true, $ne: '' } });

    // Calculate average duration
    const avgDuration = await AdModel.aggregate([
      { $group: { _id: null, average: { $avg: '$durationInSeconds' } } }
    ]);

    // Get duration distribution
    const durationStats = await AdModel.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $lte: ['$durationInSeconds', 30] },
              '0-30s',
              {
                $cond: [
                  { $lte: ['$durationInSeconds', 60] },
                  '31-60s',
                  {
                    $cond: [
                      { $lte: ['$durationInSeconds', 120] },
                      '61-120s',
                      '120s+'
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Ad statistics retrieved successfully',
      data: {
        totalAds,
        videoAds,
        imageAds,
        averageDuration: avgDuration[0]?.average || 0,
        durationStats
      }
    });

  } catch (error: any) {
    console.error('Error fetching ad statistics:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch ad statistics', 
      error: error.message 
    });
  }
};

// Get ad by ID
export const getAdById = async (req: Request, res: Response) => {
  try {
    const { adId } = req.params;

    const ad = await AdModel.findById(adId).select('-__v');

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ad retrieved successfully',
      data: {
        ad
      }
    });

  } catch (error: any) {
    console.error('Error fetching ad by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ad',
      error: error.message
    });
  }
};
