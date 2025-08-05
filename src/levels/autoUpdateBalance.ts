import cron from 'node-cron';
import UserModel from '../models/user.model';
import { getLevelEarning } from './levelEarn';

// Schedule to run every 24 hours (midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    const users = await UserModel.find();
    for (const user of users) {
      const earning = getLevelEarning(user.level || 1); // Default to level 1 if not set
      if (earning) {
        user.totalBalance += earning.usd; // Or earning.pkr if you want PKR
        await user.save();
      }
    }
    console.log('✅ User balances updated for all levels.');
  } catch (error) {
    console.error('❌ Failed to update user balances:', error);
  }
});
