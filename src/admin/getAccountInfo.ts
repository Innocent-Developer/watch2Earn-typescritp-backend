import { Request, Response } from 'express';
import AdminAccountModel from '../models/admin.account';

export const getAccountInfo = async (req: Request, res: Response) => {
  try {
    const accountInfo = await AdminAccountModel.find();
    res.status(200).json(accountInfo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get account info', error: error });
  }
};
