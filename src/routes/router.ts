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
import { createAd } from '../admin/createAds';
import { getUserWithdrawalsByUid } from '../Withdrawal Request/getRequest';

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

// Get user withdrawals by UID
router.get('/withdrawals/:uid', getUserWithdrawalsByUid);

export default router;