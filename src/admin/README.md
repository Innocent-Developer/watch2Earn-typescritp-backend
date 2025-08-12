# Admin Account Management APIs

This document describes the available APIs for managing admin accounts in the system.

## Available Endpoints

### 1. Get All Admin Accounts
- **GET** `/admin/account`
- **Description**: Retrieves all admin account information
- **Response**: Array of admin account objects

### 2. Add New Admin Account
- **POST** `/admin/account/add`
- **Description**: Creates a new admin account
- **Body Parameters**:
  ```json
  {
    "accountNumber": "string (required)",
    "accountHolderName": "string (required)",
    "bankName": "string (required)",
    "description": "string (optional)"
  }
  ```
- **Response**: Newly created admin account object

### 3. Update Admin Account
- **PUT** `/admin/account/:accountId`
- **Description**: Updates an existing admin account
- **URL Parameters**: `accountId` - MongoDB ObjectId of the account
- **Body Parameters**:
  ```json
  {
    "accountNumber": "string (required)",
    "accountHolderName": "string (required)",
    "bankName": "string (required)",
    "description": "string (optional)",
    "isActive": "boolean (optional)"
  }
  ```
- **Response**: Updated admin account object

### 4. Delete Admin Account (Hard Delete)
- **DELETE** `/admin/account/:accountId`
- **Description**: Permanently removes an admin account from the database
- **URL Parameters**: `accountId` - MongoDB ObjectId of the account
- **Safety Check**: Only allows deletion of inactive accounts
- **Response**: Deletion confirmation with account details

### 5. Soft Delete Admin Account (Deactivate)
- **PATCH** `/admin/account/:accountId/deactivate`
- **Description**: Deactivates an admin account by setting `isActive` to false
- **URL Parameters**: `accountId` - MongoDB ObjectId of the account
- **Response**: Deactivated admin account object

## Data Model

```typescript
interface IAdminAccount {
  _id: ObjectId;
  accountNumber: string;        // Unique account number
  accountHolderName: string;    // Name of account holder
  bankName: string;            // Name of the bank
  isActive: boolean;           // Account status (default: true)
  description?: string;        // Optional description
  createdAt: Date;            // Creation timestamp
  updatedAt: Date;            // Last update timestamp
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200**: Success
- **201**: Created (for POST requests)
- **400**: Bad Request (validation errors)
- **404**: Not Found (account doesn't exist)
- **409**: Conflict (duplicate account number)
- **500**: Internal Server Error

## Usage Examples

### Update an Admin Account
```bash
curl -X PUT http://localhost:3000/admin/account/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Content-Type: application/json" \
  -d '{
    "accountNumber": "1234567890",
    "accountHolderName": "John Doe",
    "bankName": "Chase Bank",
    "description": "Primary business account"
  }'
```

### Deactivate an Admin Account
```bash
curl -X PATCH http://localhost:3000/admin/account/64f1a2b3c4d5e6f7g8h9i0j1/deactivate
```

### Delete an Admin Account
```bash
curl -X DELETE http://localhost:3000/admin/account/64f1a2b3c4d5e6f7g8h9i0j1
```

## Security Notes

- All endpoints should be protected with proper authentication and authorization
- Only admin users should have access to these endpoints
- Consider implementing rate limiting for production use
- Log all admin account modifications for audit purposes 