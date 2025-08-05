import { Request, Response } from 'express';
import WithdrawalRequestModel from '../models/Withdrawal .Request';

export const createWithdrawalRequest = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      paymentMethod,
      bankName,
      accountHolderName,
      accountNumber,
      emailAddress,
    } = req.body;

    // Validate required fields
    if (!amount || !paymentMethod || !emailAddress) {
      return res.status(400).json({ message: 'Amount, payment method, and email address are required.' });
    }

    // Create new withdrawal request
    const newRequest = new WithdrawalRequestModel({
      amount,
      paymentMethod,
      bankName,
      accountHolderName,
      accountNumber,
      emailAddress,
    });

    await newRequest.save();

    res.status(201).json({ message: 'Withdrawal request submitted successfully', request: newRequest });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to submit withdrawal request', error: error.message });
  }
};