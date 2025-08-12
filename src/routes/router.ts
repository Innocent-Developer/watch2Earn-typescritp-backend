import { Router } from 'express';
import { signup } from '../account/signup';
import { login } from '../account/login';
import { createDeposite } from '../deposite/deposite';
import { addAdminAccount } from '../admin/depositAccount';
import { createWithdrawalRequest } from '../Withdrawal Request/request';
import { approveWithdrawal } from '../admin/withDrawls.approve';
import { teamShow } from '../team/teamShow';
import { approveDeposit } from '../admin/ApprovDeposit';
import { changePassword } from '../account/ChangePassword';
import { createAd } from '../Ads/createAd';
import { getUserWithdrawalsByUid } from '../Withdrawal Request/getRequest';
import { getAllDeposits, getDepositStats } from '../admin/getAllDeposits';
import { getUserByUid, getUsersByUids, searchUsers } from '../admin/getUserByUid';
import { getAllWithdrawals, getWithdrawalStats, getWithdrawalsByEmail, searchWithdrawals } from '../admin/getAllWithdrawals';
import { getAllAds, getAdStats, getAdById } from '../Ads/getAllAds';
import { getAllUsers, deleteUser } from '../admin/getAllUsers';
import { getAccountInfo } from '../admin/getAccountInfo';
import { updateAdminAccount } from '../admin/updateAdminAccount';
import { deleteAdminAccount, softDeleteAdminAccount } from '../admin/deleteAdminAccount';
import { autoUpdateBalance } from '../Ads/autoUpdateBalance';
import { deleteAd } from '../Ads/deleteAd';
import { getUserWithdrawals, getUserDeposits, getUserReferrals, getUserCompleteData } from '../user/getUserData';

const router = Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Deposite route
router.post('/deposite', createDeposite);

// Admin account route
router.post('/admin/account', addAdminAccount);

// Withdrawal request route
router.post('/withdrawal/request', createWithdrawalRequest);

// Admin approve withdrawal route
router.put('/admin/withdrawal/approve/:requestId', approveWithdrawal);

// Admin approve deposit route
router.put('/admin/deposit/approve/:depositId', approveDeposit);

// Team show route
router.get('/team/:referralCode', teamShow);

// Change password route
router.post('/change-password', changePassword);

// Create ad route
router.post('/admin/create-ad', createAd);

// Get all ads route
router.get('/ads', getAllAds);

// Get ad statistics
router.get('/ads/stats', getAdStats);

// Get ad by ID
router.get('/ads/:adId', getAdById);

// Get user withdrawals by UID
router.get('/withdrawals/:uid', getUserWithdrawalsByUid);

// Admin get all deposits
router.get('/admin/deposits', getAllDeposits);

// Admin get deposit statistics
router.get('/admin/deposits/stats', getDepositStats);

// Admin get user by UID
router.get('/admin/user/:uid', getUserByUid);

// Admin get multiple users by UIDs
router.get('/admin/users/by-uids', getUsersByUids);

// Admin search users
router.get('/admin/users/search', searchUsers);

// Admin get all withdrawal requests
router.get('/admin/withdrawals', getAllWithdrawals);

// Admin get withdrawal statistics
router.get('/admin/withdrawals/stats', getWithdrawalStats);

// Admin get withdrawal requests by user email
router.get('/admin/withdrawals/user/:email', getWithdrawalsByEmail);

// Admin search withdrawal requests
router.get('/admin/withdrawals/search', searchWithdrawals);

// Admin get all users route
router.get('/admin/users', getAllUsers);

// Admin delete user route
router.delete('/admin/users/:uid', deleteUser);

// admin account route
router.get('/admin/account', getAccountInfo);

// admin account add
router.post('/admin/account/add', addAdminAccount);

// admin account update
router.put('/admin/account/:accountId', updateAdminAccount);

// admin account delete (hard delete)
router.delete('/admin/account/:accountId', deleteAdminAccount);

// admin account soft delete (deactivate)
router.patch('/admin/account/:accountId/deactivate', softDeleteAdminAccount);

// auto update balance
router.post('/auto/update/balance', autoUpdateBalance);

// admin delete ad route
router.post('/admin/content/delete', deleteAd);

// User data routes
// Get user withdrawals by email
router.get('/user/withdrawals/:email', getUserWithdrawals);

// Get user deposits by UID
router.get('/user/deposits/:uid', getUserDeposits);

// Get user referral information and invited users
router.get('/user/referrals/:uid', getUserReferrals);

// Get comprehensive user data (withdrawals, deposits, referrals)
router.get('/user/complete/:uid', getUserCompleteData);

export default router;
