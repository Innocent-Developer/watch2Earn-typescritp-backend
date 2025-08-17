import { Request, Response } from 'express';
import DepositeModel from '../models/deposite.model';

export const createDeposite = async (req: Request, res: Response) => {
  try {
    const { amount, bankName, transactionId, senderName, senderPhone, uid, pic } = req.body;

    // Validate required fields
    if (!amount || !bankName || !transactionId || !senderName || !senderPhone) {
      return res.status(400).json({ message: 'Amount, bank name, transaction ID, sender name, and sender phone are required.' });
    }

    // Check for duplicate transactionId
    const existingDeposite = await DepositeModel.findOne({ transactionId });
    if (existingDeposite) {
      return res.status(409).json({ message: 'Transaction ID already exists.' });
    }

    // Create new deposite
    const newDeposite = new DepositeModel({
      amount,
      bankName,
      transactionId,
      senderName,
      senderPhone,
      uid: uid ? Number(uid) : undefined,
      pic: pic || null
    });

    await newDeposite.save();

    console.log('Deposit created with pic:', newDeposite.pic); // Debug log

    res.status(201).json({ message: 'Deposite created successfully', deposite: newDeposite });
  } catch (error: any) {
    res.status(500).json({ message: 'Deposite creation failed', error: error.message });
  }
};