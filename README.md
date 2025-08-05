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

| Method | Endpoint                               | Description                        |
|--------|----------------------------------------|------------------------------------|
| POST   | `/api/signup`                          | User signup                        |
| POST   | `/api/login`                           | User login                         |
| POST   | `/api/deposite`                        | Create deposit request             |
| POST   | `/api/admin/account`                   | Add admin bank account             |
| POST   | `/api/withdrawal/request`              | Create withdrawal request          |
| PUT    | `/api/admin/withdrawal/approve/:id`    | Approve withdrawal (admin)         |
| PUT    | `/api/admin/deposit/approve/:id`       | Approve deposit (admin)            |
| GET    | `/api/team/:referralCode`              | Get team by referral code          |
| POST   | `/api/change-password`                 | Change user password               |
| POST   | `/api/admin/create-ad`                 | Create ad (admin)                  |
| GET    | `/api/withdrawals/:uid`                | Get user withdrawals by UID        |

## Scheduled Jobs

- **Auto update user balance every 24 hours**  
  Uses `node-cron` to add earnings to each user's balance based on their level.

## Folder Structure

```
src/
  account/         # User signup, login, password
  admin/           # Admin actions (approve, ads)
  config/          # DB connection
  deposite/        # Deposit logic
  levels/          # Level earnings, auto update
  models/          # Mongoose schemas
  routes/          # API routes
  team/            # Team management
  Withdrawal Request/ # Withdrawal logic
```

## License

MIT

---

**Note:**  
- Make sure MongoDB is running and accessible.
- For production, use environment variables for secrets