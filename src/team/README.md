# Team Management APIs

This document describes the available APIs for managing and retrieving team member information based on referral codes.

## How Team Structure Works

- **Team Leader**: User whose `referralCode` matches the `inviteCode` parameter
- **Team Members**: Users whose `inviteCode` matches the team leader's `referralCode`
- **Hierarchy**: Multi-level team structure where team members can also invite others

## Available Endpoints

### 1. Get Team Members
- **GET** `/team/members/:inviteCode`
- **Description**: Retrieves all team members for a specific invite code
- **URL Parameters**: `inviteCode` - The referral code to find team members for
- **Response**: Team leader info, all team members, and team statistics

**Response Format:**
```json
{
  "success": true,
  "message": "Team members retrieved successfully",
  "data": {
    "teamLeader": {
      "name": "string",
      "uid": "number",
      "phoneNumber": "string",
      "email": "string",
      "plan": "string",
      "referralCode": "string",
      "totalBalance": "number",
      "totalInvites": "number",
      "level": "number",
      "joinedAt": "date"
    },
    "teamMembers": [...],
    "teamStats": {
      "totalMembers": "number",
      "activeMembers": "number",
      "totalTeamBalance": "number",
      "totalTeamWithdrawals": "number",
      "averageLevel": "string"
    }
  }
}
```

### 2. Get Team Member Details
- **GET** `/team/member/:inviteCode/:uid`
- **Description**: Retrieves specific team member details
- **URL Parameters**: 
  - `inviteCode` - The team's invite code
  - `uid` - The specific member's UID
- **Response**: Individual team member details and team leader info

**Response Format:**
```json
{
  "success": true,
  "message": "Team member details retrieved successfully",
  "data": {
    "teamMember": {
      "name": "string",
      "uid": "number",
      "phoneNumber": "string",
      "email": "string",
      "plan": "string",
      "totalBalance": "number",
      "totalWithdrawals": "number",
      "totalInvites": "number",
      "level": "number",
      "createdAt": "date"
    },
    "teamLeader": {
      "name": "string",
      "uid": "number",
      "referralCode": "string"
    }
  }
}
```

### 3. Get Team Hierarchy
- **GET** `/team/hierarchy/:inviteCode`
- **Description**: Retrieves multi-level team structure (direct and indirect members)
- **URL Parameters**: `inviteCode` - The main team's invite code
- **Response**: Complete team hierarchy with statistics

**Response Format:**
```json
{
  "success": true,
  "message": "Team hierarchy retrieved successfully",
  "data": {
    "teamLeader": {...},
    "directMembers": [...],
    "indirectMembers": [
      {
        "invitedBy": {...},
        "members": [...]
      }
    ],
    "hierarchyStats": {
      "totalDirectMembers": "number",
      "totalIndirectMembers": "number",
      "totalAllMembers": "number",
      "totalTeamBalance": "number",
      "activeMembers": "number"
    }
  }
}
```

## Usage Examples

### Get Team Members
```bash
curl -X GET "http://localhost:3000/team/members/JOHN123"
```

### Get Specific Team Member
```bash
curl -X GET "http://localhost:3000/team/member/JOHN123/12345"
```

### Get Team Hierarchy
```bash
curl -X GET "http://localhost:3000/team/hierarchy/JOHN123"
```

## Team Logic Explanation

### Basic Team Structure:
1. **Team Leader** has `referralCode: "JOHN123"`
2. **Team Members** have `inviteCode: "JOHN123"`
3. The API finds all users where `inviteCode == referralCode`

### Example Data Flow:
```
Team Leader: { referralCode: "JOHN123" }
├── Member 1: { inviteCode: "JOHN123", referralCode: "MARY456" }
│   ├── Sub-Member 1: { inviteCode: "MARY456" }
│   └── Sub-Member 2: { inviteCode: "MARY456" }
├── Member 2: { inviteCode: "JOHN123", referralCode: "ALEX789" }
│   └── Sub-Member 3: { inviteCode: "ALEX789" }
└── Member 3: { inviteCode: "JOHN123" }
```

## Statistics Calculated

### Team Stats (Basic):
- **totalMembers**: Count of direct team members
- **activeMembers**: Members with level > 0
- **totalTeamBalance**: Sum of all team members' balances
- **totalTeamWithdrawals**: Sum of all team members' withdrawals
- **averageLevel**: Average level of all team members

### Hierarchy Stats (Multi-level):
- **totalDirectMembers**: First-level team members
- **totalIndirectMembers**: Second-level team members
- **totalAllMembers**: All members combined
- **totalTeamBalance**: Combined balance of all levels
- **activeMembers**: Active members across all levels

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200**: Success
- **400**: Bad Request (missing invite code or UID)
- **404**: Not Found (team leader or member not found)
- **500**: Internal Server Error

## Features

✅ **Team Leader Identification**: Finds team leader by referral code  
✅ **Member Listing**: Gets all team members for a specific invite code  
✅ **Individual Member Details**: Retrieves specific member information  
✅ **Multi-level Hierarchy**: Shows complete team structure with sub-teams  
✅ **Comprehensive Statistics**: Calculates team performance metrics  
✅ **Sorted Results**: Members sorted by join date (newest first)  
✅ **Error Handling**: Proper validation and error messages  

## Security Notes

- Validate invite codes to prevent unauthorized access
- Consider implementing authentication to ensure users can only view their own teams
- Add rate limiting for production use
- Log all team data access for audit purposes 