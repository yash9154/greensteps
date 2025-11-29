# API Testing Guide

This guide shows how to test all GreenSteps API endpoints using curl or Postman.

## 📋 Prerequisites

- Backend running on `http://localhost:5000`
- MySQL database initialized
- All waste types seeded

## 🔑 Authentication Flow

All protected endpoints require JWT token in the header:
```
Authorization: Bearer <your_access_token>
```

---

## 1️⃣ User Registration

### Request
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Eco",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

### Response
```json
{
  "message": "User registered successfully",
  "user": {
    "userId": 1,
    "name": "John Eco",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Test Cases
- ✅ Valid registration
- ❌ Email already exists
- ❌ Weak password
- ❌ Password mismatch
- ❌ Invalid email format
- ❌ Missing fields

---

## 2️⃣ User Login

### Request
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Response
```json
{
  "message": "Login successful",
  "user": {
    "userId": 1,
    "name": "John Eco",
    "email": "john@example.com",
    "isAdmin": false
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Test Cases
- ✅ Valid credentials
- ❌ Wrong password
- ❌ User not found
- ❌ Missing email/password

---

## 3️⃣ Get Waste Types

### Request
```bash
curl -X GET http://localhost:5000/waste/types \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "types": [
    {
      "waste_type_id": 1,
      "type_code": "PLASTIC",
      "display_name": "Plastic",
      "unit": "kg"
    },
    {
      "waste_type_id": 2,
      "type_code": "PAPER",
      "display_name": "Paper",
      "unit": "kg"
    },
    {
      "waste_type_id": 3,
      "type_code": "FOOD",
      "display_name": "Food Waste",
      "unit": "kg"
    },
    {
      "waste_type_id": 4,
      "type_code": "GLASS",
      "display_name": "Glass",
      "unit": "kg"
    }
  ]
}
```

---

## 4️⃣ Add Waste Entry

### Request
```bash
curl -X POST http://localhost:5000/waste/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entry_date": "2025-01-15",
    "waste_type_id": 1,
    "quantity": 2.5,
    "notes": "Plastic water bottles and bags"
  }'
```

### Response
```json
{
  "message": "Waste entry added successfully",
  "recordId": 1
}
```

### Test Cases
- ✅ Valid waste entry
- ❌ Invalid waste type
- ❌ Invalid quantity
- ❌ Missing required fields
- ✅ With optional notes

---

## 5️⃣ Get Waste List

### Request
```bash
curl -X GET "http://localhost:5000/waste/list?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "records": [
    {
      "record_id": 1,
      "user_id": 1,
      "entry_date": "2025-01-15",
      "waste_type_id": 1,
      "display_name": "Plastic",
      "unit": "kg",
      "quantity": "2.50",
      "notes": "Plastic water bottles",
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20
}
```

---

## 6️⃣ Update Waste Entry

### Request
```bash
curl -X PUT http://localhost:5000/waste/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entry_date": "2025-01-15",
    "waste_type_id": 2,
    "quantity": 3.0,
    "notes": "Updated notes"
  }'
```

### Response
```json
{
  "message": "Waste entry updated successfully"
}
```

---

## 7️⃣ Delete Waste Entry

### Request
```bash
curl -X DELETE http://localhost:5000/waste/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "message": "Waste entry deleted successfully"
}
```

---

## 8️⃣ Get Dashboard Statistics

### Request
```bash
curl -X GET http://localhost:5000/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "totalWaste": 5.5,
  "wasteByType": [
    {
      "display_name": "Plastic",
      "total": 2.5
    },
    {
      "display_name": "Paper",
      "total": 3.0
    }
  ],
  "weeklyProgress": [
    {
      "date": "2025-01-15",
      "daily_total": 5.5
    }
  ],
  "reward": {
    "points": 0,
    "badge": "STARTER"
  }
}
```

---

## 9️⃣ Get User Rewards

### Request
```bash
curl -X GET http://localhost:5000/rewards \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "reward": {
    "points": 0,
    "badge": "STARTER",
    "awardedOn": null
  },
  "pointsHistory": []
}
```

---

## 🔟 Check 7-Day Streak

### Request
```bash
curl -X GET http://localhost:5000/rewards/check-streak \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response
```json
{
  "message": "Streak check completed",
  "streakActive": true
}
```

---

## 1️⃣1️⃣ Admin: Get All Users

### Request (Admin Only)
```bash
curl -X GET http://localhost:5000/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Response
```json
{
  "users": [
    {
      "user_id": 1,
      "name": "John Eco",
      "email": "john@example.com",
      "is_admin": false,
      "created_at": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## 1️⃣2️⃣ Admin: Get All Waste Records

### Request (Admin Only)
```bash
curl -X GET "http://localhost:5000/admin/waste?limit=100&offset=0" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Response
```json
{
  "records": [
    {
      "record_id": 1,
      "user_id": 1,
      "name": "John Eco",
      "entry_date": "2025-01-15",
      "waste_type_id": 1,
      "display_name": "Plastic",
      "unit": "kg",
      "quantity": "2.50",
      "notes": "Plastic bottles",
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 1️⃣3️⃣ Admin: Export Waste CSV

### Request (Admin Only)
```bash
curl -X GET http://localhost:5000/dashboard/admin/export-csv \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -o waste_records.csv
```

### Response
CSV file with columns:
```
Record ID, User, Entry Date, Waste Type, Quantity, Unit, Notes, Created At
```

---

## 🧪 Test Scenarios

### Scenario 1: Complete User Flow
1. ✅ Signup new user
2. ✅ Login with credentials
3. ✅ Get waste types
4. ✅ Add waste entry
5. ✅ View waste list
6. ✅ Check dashboard stats
7. ✅ View rewards

### Scenario 2: Admin Operations
1. ✅ Signup as admin (manually set is_admin=true in DB)
2. ✅ Login
3. ✅ Get all users
4. ✅ Get all waste records
5. ✅ Export CSV

### Scenario 3: Error Handling
1. ❌ Signup with weak password
2. ❌ Login with wrong password
3. ❌ Add waste without authentication
4. ❌ Update non-existent record
5. ❌ Access admin endpoint without admin role

---

## 📊 Testing Tools

### Option 1: Use curl (Command Line)
```bash
# Simple GET
curl http://localhost:5000/waste/types

# POST with data
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123"}'
```

### Option 2: Use Postman
1. Download Postman (free at postman.com)
2. Create new collection "GreenSteps"
3. Add requests for each endpoint
4. Save access token from login response
5. Use token in headers for protected endpoints

### Option 3: Use Thunder Client
VS Code extension for API testing

### Option 4: Use REST Client
VS Code extension - create `.http` or `.rest` files

---

## 💡 Tips

- Save tokens from login response for authenticated requests
- Test with pagination: `?page=2&limit=10`
- Check error messages for validation issues
- Use different waste types (ID 1-4)
- Test date format: YYYY-MM-DD
- Add quantities: decimals supported (2.5 kg)

---

## 🔍 Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token) |
| 403 | Forbidden (expired token/no permission) |
| 404 | Not Found (resource doesn't exist) |
| 409 | Conflict (email already exists) |
| 500 | Server Error |

---

## ✅ Validation Rules

### Signup
- Email: valid format
- Password: 8+ chars, uppercase, lowercase, number
- Name: not empty

### Waste Entry
- Date: valid date format
- Waste Type: must exist in DB
- Quantity: positive number
- Notes: optional

### Login
- Email: valid format
- Password: correct for user

---

Ready to test! 🧪
