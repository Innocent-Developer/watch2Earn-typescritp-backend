# User Data APIs - Test Examples

This file contains practical examples for testing the new user data APIs.

## Test Data Setup

Before testing, ensure you have some test data in your database:

### Sample User
```json
{
  "name": "John Doe",
  "uid": 12345,
  "phoneNumber": "+1234567890",
  "email": "john.doe@example.com",
  "plan": "premium",
  "referralCode": "JOHN123",
  "inviteCode": "REF456",
  "totalBalance": 1000,
  "totalWithdrawals": 500,
  "totalInvites": 3,
  "level": 2
}
```

### Sample Deposits
```json
[
  {
    "amount": "500",
    "bankName": "Chase Bank",
    "transactionId": "TXN001",
    "senderName": "John Doe",
    "senderPhone": "+1234567890",
    "uid": 12345,
    "status": "approved"
  },
  {
    "amount": "300",
    "bankName": "Wells Fargo",
    "transactionId": "TXN002",
    "senderName": "John Doe",
    "senderPhone": "+1234567890",
    "uid": 12345,
    "status": "pending"
  }
]
```

### Sample Withdrawals
```json
[
  {
    "amount": 200,
    "paymentMethod": "Bank Transfer",
    "bankName": "Chase Bank",
    "accountHolderName": "John Doe",
    "accountNumber": "1234567890",
    "emailAddress": "john.doe@example.com",
    "status": "approved"
  },
  {
    "amount": 150,
    "paymentMethod": "Bank Transfer",
    "bankName": "Wells Fargo",
    "accountHolderName": "John Doe",
    "accountNumber": "0987654321",
    "emailAddress": "john.doe@example.com",
    "status": "pending"
  }
]
```

## API Testing with cURL

### 1. Test Get User Withdrawals
```bash
# Test with valid email
curl -X GET "http://localhost:3000/user/withdrawals/john.doe@example.com" \
  -H "Content-Type: application/json"

# Expected response structure:
{
  "success": true,
  "message": "User withdrawals retrieved successfully",
  "data": {
    "user": {
      "name": "John Doe",
      "uid": 12345,
      "phoneNumber": "+1234567890",
      "plan": "premium",
      "totalBalance": 1000,
      "totalWithdrawals": 500,
      "level": 2
    },
    "withdrawals": [...],
    "totalWithdrawals": 2,
    "totalAmount": 350
  }
}
```

### 2. Test Get User Deposits
```bash
# Test with valid UID
curl -X GET "http://localhost:3000/user/deposits/12345" \
  -H "Content-Type: application/json"

# Expected response structure:
{
  "success": true,
  "message": "User deposits retrieved successfully",
  "data": {
    "user": {
      "name": "John Doe",
      "uid": 12345,
      "phoneNumber": "+1234567890",
      "plan": "premium",
      "totalBalance": 1000,
      "level": 2
    },
    "deposits": [...],
    "totalDeposits": 2,
    "totalAmount": 800,
    "pendingDeposits": 1,
    "approvedDeposits": 1
  }
}
```

### 3. Test Get User Referrals
```bash
# Test with valid UID
curl -X GET "http://localhost:3000/user/referrals/12345" \
  -H "Content-Type: application/json"

# Expected response structure:
{
  "success": true,
  "message": "User referral information retrieved successfully",
  "data": {
    "user": {
      "name": "John Doe",
      "uid": 12345,
      "referralCode": "JOHN123",
      "inviteCode": "REF456",
      "totalInvites": 3,
      "level": 2
    },
    "invitedUsers": [...],
    "referralStats": {
      "totalInvites": 3,
      "activeInvites": 2,
      "totalReferralEarnings": 750
    }
  }
}
```

### 4. Test Get Complete User Data
```bash
# Test with valid UID
curl -X GET "http://localhost:3000/user/complete/12345" \
  -H "Content-Type: application/json"

# Expected response structure:
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
        "total": 2,
        "totalAmount": 800,
        "pending": 1,
        "approved": 1
      },
      "withdrawals": {
        "total": 2,
        "totalAmount": 350,
        "pending": 1,
        "approved": 1
      },
      "referrals": {
        "totalInvites": 3,
        "activeInvites": 2,
        "totalReferralEarnings": 750
      }
    }
  }
}
```

## Error Testing

### Test Missing Parameters
```bash
# Test withdrawals without email
curl -X GET "http://localhost:3000/user/withdrawals/" \
  -H "Content-Type: application/json"

# Expected response:
{
  "message": "Email is required."
}

# Test deposits without UID
curl -X GET "http://localhost:3000/user/deposits/" \
  -H "Content-Type: application/json"

# Expected response:
{
  "message": "UID is required."
}
```

### Test Non-existent User
```bash
# Test with non-existent UID
curl -X GET "http://localhost:3000/user/deposits/99999" \
  -H "Content-Type: application/json"

# Expected response:
{
  "success": true,
  "message": "User deposits retrieved successfully",
  "data": {
    "user": null,
    "deposits": [],
    "totalDeposits": 0,
    "totalAmount": 0,
    "pendingDeposits": 0,
    "approvedDeposits": 0
  }
}
```

## Performance Testing

### Test with Large Data Sets
```bash
# Test complete user data endpoint with user having many records
curl -X GET "http://localhost:3000/user/complete/12345" \
  -H "Content-Type: application/json" \
  -w "Time: %{time_total}s\n"
```

### Test Concurrent Requests
```bash
# Test multiple concurrent requests
for i in {1..10}; do
  curl -X GET "http://localhost:3000/user/withdrawals/john.doe@example.com" &
done
wait
```

## Integration Testing

### Test Complete User Flow
1. Create a user
2. Add deposits for the user
3. Create withdrawal requests for the user
4. Test all API endpoints
5. Verify data consistency across endpoints

### Test Data Relationships
1. Verify that referral codes match between users
2. Check that deposit UIDs correspond to actual users
3. Ensure withdrawal emails match user emails
4. Validate that statistics are calculated correctly

## Notes

- All endpoints return data sorted by creation date (newest first)
- Statistics are calculated in real-time from the database
- User information is included in all responses for context
- Error handling provides meaningful error messages
- All responses follow a consistent format with success/error indicators 