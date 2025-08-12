# User Data Management APIs

This document describes the available APIs for retrieving user-specific data including withdrawals, deposits, and referral information.

## Available Endpoints

### 1. Get User Withdrawals
- **GET** `/user/withdrawals/:email`
- **Description**: Retrieves all withdrawal requests for a specific user by email
- **URL Parameters**: `email` - User's email address
- **Response**: User info and withdrawal details with statistics

**Response Format:**
```json
{
  "success": true,
  "message": "User withdrawals retrieved successfully",
  "data": {
    "user": {
      "name": "string",
      "uid": "number",
      "phoneNumber": "string",
      "plan": "string",
      "totalBalance": "number",
      "totalWithdrawals": "number",
      "level": "number"
    },
    "withdrawals": [...],
    "totalWithdrawals": "number",
    "totalAmount": "number"
  }
}
```

### 2. Get User Deposits
- **GET** `/user/deposits/:uid`
- **Description**: Retrieves all deposits for a specific user by UID
- **URL Parameters**: `uid` - User's unique identifier
- **Response**: User info and deposit details with statistics

**Response Format:**
```json
{
  "success": true,
  "message": "User deposits retrieved successfully",
  "data": {
    "user": {
      "name": "string",
      "uid": "number",
      "phoneNumber": "string",
      "plan": "string",
      "totalBalance": "number",
      "level": "number"
    },
    "deposits": [...],
    "totalDeposits": "number",
    "totalAmount": "number",
    "pendingDeposits": "number",
    "approvedDeposits": "number"
  }
}
```

### 3. Get User Referrals
- **GET** `/user/referrals/:uid`
- **Description**: Retrieves user's referral information and list of invited users
- **URL Parameters**: `uid` - User's unique identifier
- **Response**: User referral details and invited users list

**Response Format:**
```json
{
  "success": true,
  "message": "User referral information retrieved successfully",
  "data": {
    "user": {
      "name": "string",
      "uid": "number",
      "referralCode": "string",
      "inviteCode": "string",
      "totalInvites": "number",
      "level": "number"
    },
    "invitedUsers": [...],
    "referralStats": {
      "totalInvites": "number",
      "activeInvites": "number",
      "totalReferralEarnings": "number"
    }
  }
}
```

### 4. Get Complete User Data
- **GET** `/user/complete/:uid`
- **Description**: Retrieves comprehensive user data including withdrawals, deposits, and referrals
- **URL Parameters**: `uid` - User's unique identifier
- **Response**: Complete user profile with all related data and statistics

**Response Format:**
```json
{
  "success": true,
  "message": "Complete user data retrieved successfully",
  "data": {
    "user": {...},
    "deposits": [...],
    "withdrawals": [...],
    "invitedUsers": [...],
    "stats": {
      "deposits": {
        "total": "number",
        "totalAmount": "number",
        "pending": "number",
        "approved": "number"
      },
      "withdrawals": {
        "total": "number",
        "totalAmount": "number",
        "pending": "number",
        "approved": "number"
      },
      "referrals": {
        "totalInvites": "number",
        "activeInvites": "number",
        "totalReferralEarnings": "number"
      }
    }
  }
}
```

## Data Models

### Withdrawal Request
```typescript
interface IWithdrawalRequest {
  _id: ObjectId;
  amount: number;
  paymentMethod: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  emailAddress: string;
  status: string; // 'pending', 'approved', 'rejected'
  createdAt: Date;
  updatedAt: Date;
}
```

### Deposit
```typescript
interface IDeposite {
  _id: ObjectId;
  amount: string;
  bankName: string;
  transactionId: string;
  senderName: string;
  senderPhone: string;
  uid?: number;
  status?: string; // 'pending', 'approved', 'rejected'
  pic?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### User
```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  uid: number;
  phoneNumber: string;
  email: string;
  plan: string;
  referralCode: string;
  inviteCode: string;
  totalBalance: number;
  totalWithdrawals: number;
  totalInvites: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage Examples

### Get User Withdrawals
```bash
curl -X GET http://localhost:3000/user/withdrawals/user@example.com
```

### Get User Deposits
```bash
curl -X GET http://localhost:3000/user/deposits/12345
```

### Get User Referrals
```bash
curl -X GET http://localhost:3000/user/referrals/12345
```

### Get Complete User Data
```bash
curl -X GET http://localhost:3000/user/complete/12345
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200**: Success
- **400**: Bad Request (missing parameters)
- **404**: Not Found (user doesn't exist)
- **500**: Internal Server Error

## Features

✅ **Separate Endpoints**: Each data type has its own dedicated endpoint  
✅ **Comprehensive Data**: Complete endpoint provides all user data in one call  
✅ **Statistics**: Each endpoint includes relevant statistics and counts  
✅ **User Information**: All endpoints include basic user profile data  
✅ **Sorted Results**: Data is sorted by creation date (newest first)  
✅ **Error Handling**: Comprehensive error handling with meaningful messages  

## Security Notes

- All endpoints should be protected with proper authentication
- Consider implementing rate limiting for production use
- Validate user permissions to ensure users can only access their own data
- Log all data access for audit purposes 