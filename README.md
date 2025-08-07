# Watch2Earn Backend

This is the backend for the Watch2Earn project, built with Node.js, Express, TypeScript, and MongoDB.  
It provides APIs for user management, deposits, withdrawals, admin actions, ads, and team management.

## Features

- User signup/login with referral and invite codes
- Encrypted password storage (`bcryptjs`)
- Deposit and withdrawal requests
- Admin approval for deposits and withdrawals
- Team management via referral codes
- Daily automatic balance updates by user level
- Ad management (video/image ads)
- Change password functionality
- Comprehensive admin dashboard APIs
- Advanced search and filtering capabilities
- Pagination for large datasets
- Real-time statistics and analytics

## Tech Stack

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- bcryptjs
- node-cron

## Setup

1. **Clone the repository**
   ```
   git clone <your-repo-url>
   cd projectNumber2/backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the `backend` folder:
     ```
     MONGO_URI=your_mongodb_connection_string
     PORT=5000
     ```

4. **Run the server**
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```

## API Endpoints

### User Management

| Method | Endpoint                               | Description                        |
|--------|----------------------------------------|------------------------------------|
| POST   | `/api/signup`                          | User signup                        |
| POST   | `/api/login`                           | User login                         |
| POST   | `/api/change-password`                 | Change user password               |

### Deposit Management

| Method | Endpoint                               | Description                        |
|--------|----------------------------------------|------------------------------------|
| POST   | `/api/deposite`                        | Create deposit request             |
| PUT    | `/api/admin/deposit/approve/:id`       | Approve deposit (admin)            |
| GET    | `/api/admin/deposits`                  | Get all deposits (admin)           |
| GET    | `/api/admin/deposits/stats`            | Get deposit statistics (admin)     |

### Withdrawal Management

| Method | Endpoint                               | Description                        |
|--------|----------------------------------------|------------------------------------|
| POST   | `/api/withdrawal/request`              | Create withdrawal request          |
| PUT    | `/api/admin/withdrawal/approve/:id`    | Approve withdrawal (admin)         |
| GET    | `/api/withdrawals/:uid`                | Get user withdrawals by UID        |
| GET    | `/api/admin/withdrawals`               | Get all withdrawals (admin)        |
| GET    | `/api/admin/withdrawals/stats`         | Get withdrawal statistics (admin)  |
| GET    | `/api/admin/withdrawals/user/:email`   | Get withdrawals by user email      |
| GET    | `/api/admin/withdrawals/search`        | Search withdrawals (admin)         |

### User Management (Admin)

| Method | Endpoint                               | Description                        |
|--------|----------------------------------------|------------------------------------|
| GET    | `/api/admin/user/:uid`                 | Get user by UID (admin)            |
| GET    | `/api/admin/users`                     | Get all users (admin)              |
| GET    | `/api/admin/users/by-uids`             | Get multiple users by UIDs         |
| GET    | `/api/admin/users/search`              | Search users (admin)               |
| DELETE | `/api/admin/users/:uid`                | Delete user (admin)                |

### Admin Management

| Method | Endpoint                               | Description                        |
|--------|----------------------------------------|------------------------------------|
| POST   | `/api/admin/account`                   | Add admin bank account             |
| POST   | `/api/admin/create-ad`                 | Create ad (admin)                  |

### Ad Management

| Method | Endpoint                               | Description                        |
|--------|----------------------------------------|------------------------------------|
| GET    | `/api/ads`                             | Get all ads                        |
| GET    | `/api/ads/stats`                       | Get ad statistics                  |
| GET    | `/api/ads/:adId`                       | Get ad by ID                       |

### Team Management

| Method | Endpoint                               | Description                        |
|--------|----------------------------------------|------------------------------------|
| GET    | `/api/team/:referralCode`              | Get team by referral code          |

## API Documentation

### User Authentication

#### Signup
```http
POST /api/signup
Content-Type: application/json

{
  "name": "John Doe",
  "phoneNumber": "+1234567890",
  "email": "john@example.com",
  "password": "password123",
  "referralCode": "ABC123"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Deposit Management

#### Create Deposit Request
```http
POST /api/deposite
Content-Type: application/json

{
  "amount": "1000",
  "bankName": "Chase Bank",
  "transactionId": "TXN123456789",
  "senderName": "John Doe",
  "senderPhone": "+1234567890",
  "uid": 12345
}
```

#### Get All Deposits (Admin)
```http
GET /api/admin/deposits?page=1&limit=10&status=pending&sortBy=createdAt&sortOrder=desc
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `status` (optional) - Filter by status (pending/approved/rejected)
- `sortBy` (default: createdAt) - Field to sort by
- `sortOrder` (default: desc) - Sort order (asc/desc)

#### Get Deposit Statistics (Admin)
```http
GET /api/admin/deposits/stats
```

### Withdrawal Management

#### Create Withdrawal Request
```http
POST /api/withdrawal/request
Content-Type: application/json

{
  "amount": 500,
  "paymentMethod": "Bank Transfer",
  "bankName": "Chase Bank",
  "accountHolderName": "John Doe",
  "accountNumber": "1234567890",
  "emailAddress": "john@example.com"
}
```

#### Get All Withdrawals (Admin)
```http
GET /api/admin/withdrawals?page=1&limit=10&status=pending&paymentMethod=Bank Transfer
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `status` (optional) - Filter by status
- `paymentMethod` (optional) - Filter by payment method
- `sortBy` (default: createdAt) - Field to sort by
- `sortOrder` (default: desc) - Sort order

#### Search Withdrawals (Admin)
```http
GET /api/admin/withdrawals/search?search=john&minAmount=100&maxAmount=1000&status=pending&startDate=2024-01-01&endDate=2024-12-31
```

**Query Parameters:**
- `search` (optional) - Search in email, account holder, bank, account number
- `minAmount` (optional) - Minimum amount filter
- `maxAmount` (optional) - Maximum amount filter
- `startDate` (optional) - Start date filter
- `endDate` (optional) - End date filter
- `status` (optional) - Status filter
- `paymentMethod` (optional) - Payment method filter

### User Management (Admin)

#### Get User by UID
```http
GET /api/admin/user/12345
```

#### Get Multiple Users by UIDs
```http
GET /api/admin/users?uids=12345,67890,11111
```

#### Search Users
```http
GET /api/admin/users/search?page=1&limit=20&search=john&plan=pro&level=2&sortBy=totalBalance&sortOrder=desc
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` (optional) - Search in name, email, phone number
- `plan` (optional) - Filter by plan (basic/pro)
- `level` (optional) - Filter by level
- `sortBy` (default: createdAt) - Field to sort by
- `sortOrder` (default: desc) - Sort order

### Ad Management

#### Get All Ads
```http
GET /api/ads?page=1&limit=10&type=video&minDuration=30&maxDuration=120&search=promo&sortBy=durationInSeconds&sortOrder=asc
```

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `search` (optional) - Search in name and link
- `type` (optional) - Filter by type (video/image)
- `minDuration` (optional) - Minimum duration in seconds
- `maxDuration` (optional) - Maximum duration in seconds
- `sortBy` (default: createdAt) - Field to sort by
- `sortOrder` (default: desc) - Sort order

#### Get Ad Statistics
```http
GET /api/ads/stats
```

#### Get Ad by ID
```http
GET /api/ads/64f8a1b2c3d4e5f6a7b8c9d0
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Pagination Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## Data Models

### User Model
```typescript
interface IUser {
  name: string;
  uid: number;
  phoneNumber: string;
  email: string;
  password: string;
  plan: string;
  referralCode: string;
  inviteCode: string;
  totalBalance: number;
  totalWithdrawals: number;
  totalInvites: number;
  profilePicture?: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Deposit Model
```typescript
interface IDeposit {
  amount: string;
  bankName: string;
  transactionId: string;
  senderName: string;
  senderPhone: string;
  uid?: number;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Withdrawal Request Model
```typescript
interface IWithdrawalRequest {
  amount: number;
  paymentMethod: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  emailAddress: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Ad Model
```typescript
interface IAd {
  name: string;
  videoUrl?: string;
  imageUrl?: string;
  link: string;
  durationInSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Scheduled Jobs

- **Auto update user balance every 24 hours**  
  Uses `node-cron` to add earnings to each user's balance based on their level.

## Folder Structure

```
src/
  account/         # User signup, login, password
  admin/           # Admin actions (approve, ads, user management)
  config/          # DB connection
  deposite/        # Deposit logic
  levels/          # Level earnings, auto update
  models/          # Mongoose schemas
  routes/          # API routes
  team/            # Team management
  Withdrawal Request/ # Withdrawal logic
```

## Features Overview

### Admin Dashboard Capabilities
- **Deposit Management**: View all deposits, filter by status, approve/reject
- **Withdrawal Management**: View all withdrawals, advanced search, approve/reject
- **User Management**: Search users, get user details, view user statistics
- **Ad Management**: View all ads, filter by type and duration, get statistics
- **Statistics**: Real-time dashboard statistics for deposits, withdrawals, and ads
- **Advanced Search**: Multi-criteria search with date ranges and amount filters
- **Pagination**: Efficient handling of large datasets
- **Data Export**: Comprehensive data retrieval for reporting

### Security Features
- Password encryption with bcryptjs
- Input validation and sanitization
- Error handling with safe error messages
- Data access control for admin operations

### Performance Features
- Efficient database queries with indexing
- Pagination for large datasets
- Optimized aggregation queries for statistics
- Caching-friendly response formats

## License

MIT

---

**Note:**  
- Make sure MongoDB is running and accessible.
- For production, use environment variables for secrets
- All admin endpoints require proper authentication and authorization
- The system supports both basic and pro user plans
- Automatic balance updates occur every 24 hours based on user levels