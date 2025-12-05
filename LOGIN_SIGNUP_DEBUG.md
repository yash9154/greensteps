# 🔧 Login & Signup Troubleshooting Guide

## Changes Made ✅

### Frontend Improvements
1. **Added detailed console logging** to Login and Signup pages
2. **Client-side validation** with clear error messages for:
   - Empty fields
   - Password requirements (8+ chars, uppercase, lowercase, number)
   - Password mismatch
   - Email format validation

3. **Better error display** with styled error messages
4. **Fixed button issues** in signup form
5. **Added loading indicators** with better feedback

---

## How to Debug Login/Signup Errors

### Step 1: Open Browser Console
```
Press: F12 (or Ctrl+Shift+I)
Go to: Console tab
```

### Step 2: Try to Sign Up or Login
Look for these console messages:

**For Signup:**
```
🔐 Attempting signup with: { name: "...", email: "..." }
```

**For Login:**
```
🔐 Attempting login with: { email: "..." }
```

### Step 3: Check the Response
You should see one of:

**✅ Success:**
```
✅ Signup successful: {user: {...}, accessToken: "ey...", refreshToken: "ey..."}
✅ Token saved, navigating to dashboard
```

**❌ Error:**
```
❌ Signup error: Error: ...
📍 Error details: {
  status: 400,
  data: { error: "Email already registered" },
  message: "Request failed with status code 400"
}
```

---

## Common Errors & Solutions

### Error: "All fields are required"

**Cause:** You didn't fill in all form fields

**Fix:**
1. Make sure all fields are filled:
   - Signup: Name, Email, Password, Confirm Password
   - Login: Email, Password
2. Click Submit again

---

### Error: "Password must be at least 8 characters"

**Cause:** Password is too short

**Fix:**
```
✅ Good passwords:
- MyPass123
- Test@2025
- SecurePassword99

❌ Bad passwords:
- pass (too short)
- Password (no number)
- password123 (no uppercase)
```

---

### Error: "Password must contain uppercase letter"

**Cause:** Missing uppercase letter (A-Z)

**Fix:**
```
Password: testpass123
Add uppercase: TestPass123
```

---

### Error: "Password must contain lowercase letter"

**Cause:** Missing lowercase letter (a-z)

**Fix:**
```
Password: TESTPASS123
Add lowercase: TestPass123
```

---

### Error: "Password must contain number"

**Cause:** Missing number (0-9)

**Fix:**
```
Password: TestPass
Add number: TestPass123
```

---

### Error: "Passwords do not match"

**Cause:** Password and Confirm Password fields don't match

**Fix:**
```
1. Type password in Password field: MyPass123
2. Type same password in Confirm field: MyPass123
3. Make sure they're identical
```

---

### Error: "Email already registered"

**Cause:** That email is already used

**Fix:**
```
Option 1: Login instead (if you have the password)
Option 2: Use a different email address
  - test@example.com
  - user123@example.com
  - anything@example.com
Option 3: Clear database and restart (development only)
```

---

### Error: "Invalid credentials"

**Cause (Login only):** Email or password is wrong

**Fix:**
```
1. Check email is correct (case-insensitive)
2. Check password is correct (case-sensitive)
3. Make sure you signed up first
4. Password is: MyPass123 (if using test account)
```

---

### Error: "Network Error" or "Failed to fetch"

**Cause:** Backend is not running

**Fix:**
```
1. Check if backend terminal shows:
   "Server running on port 5000"
   
2. If not, start backend:
   cd backend
   npm run dev
   
3. Wait for: "✅ Server running on port 5000"
4. Try signup/login again
```

---

### Error: Request shows 500 (Internal Server Error)

**Cause:** Backend error - check backend console

**Fix:**
```
1. Look at backend terminal (where you ran npm run dev)
2. Find error message that looks like:
   "Signup error: ..."
   "Login error: ..."
   
3. Common causes:
   - Database not initialized: npm run db:init
   - Database connection failed: Check .env file
   - bcrypt error: Restart backend
   
4. After fixing, try signup/login again
```

---

## Step-by-Step: Create a Test Account

### Fresh Start (Clear Everything)

**Step 1: Clear Browser**
```
1. Press F12 (DevTools)
2. Go to Application → Storage
3. Click "Clear site data"
4. Close DevTools
```

**Step 2: Refresh Page**
```
Ctrl+Shift+R (hard refresh)
Or: Cmd+Shift+R (Mac)
```

**Step 3: Go to Sign Up**
```
http://localhost:5173/signup
```

**Step 4: Fill Form**
```
Name: Test User
Email: testuser@example.com
Password: TestPass123
Confirm: TestPass123
```

**Step 5: Submit**
```
Click "Sign Up" button
Open DevTools Console (F12)
Look for ✅ success messages
Should redirect to dashboard
```

### If It Fails

**Check Console (F12):**
```
Look for red ❌ errors
Look for 📍 Error details
Note the error message
See solutions above for that error
```

---

## Test Flow

### Test 1: Fresh Signup
```
1. Clear browser storage
2. Go to /signup
3. Create account with unique email
✅ Should see dashboard
✅ Should have stats displayed
```

### Test 2: Login After Signup
```
1. Logout (click logout button)
2. Go to /login
3. Enter credentials you just created
✅ Should redirect to dashboard
✅ Your data should be there
```

### Test 3: Invalid Credentials
```
1. Go to /login
2. Enter wrong password
3. Should see error: "Invalid credentials"
✅ Stays on login page
✅ Can retry
```

---

## Backend Console Debugging

### What to Look For

**Normal startup:**
```
✅ Server running on port 5000
✅ Database connected
```

**When signup happens:**
```
[Middleware] Received signup request
[Auth] Creating user: test@example.com
[Database] User created with ID: 5
[Rewards] Reward initialized for user 5
[Response] Sending 201 with tokens
```

**If error:**
```
[Error] Signup error: {error message}
[Stack] Error stack trace
[Database] Connection error: {error}
```

---

## Manual Testing with curl

### Test Signup
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "user": { "userId": 5, "name": "Test User", "email": "test@example.com" },
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Test Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

Expected response:
```json
{
  "message": "Login successful",
  "user": { "userId": 5, "name": "Test User", "email": "test@example.com", "isAdmin": false },
  "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

---

## Validation Rules

### Password Requirements
- ✅ Minimum 8 characters
- ✅ At least one UPPERCASE letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one number (0-9)
- ❌ Special characters not required (but allowed)

### Email Requirements
- ✅ Valid email format (something@domain.com)
- ✅ Must be unique (can't have duplicates)
- ✅ Case-insensitive (Test@example.com = test@example.com)

### Name Requirements
- ✅ Cannot be empty
- ✅ Any characters allowed
- ✅ Minimum 1 character

---

## Quick Checklist

Before testing signup/login:

- [ ] Backend running? (npm run dev in /backend)
- [ ] Frontend running? (npm run dev in root)
- [ ] Database initialized? (npm run db:init)
- [ ] .env file exists in backend folder?
- [ ] DevTools console open (F12)?
- [ ] Browser refreshed (Ctrl+Shift+R)?

---

## Still Having Issues?

### Check These in Order:

1. **Backend running?**
   ```
   Terminal shows: "Server running on port 5000"
   If not: cd backend && npm run dev
   ```

2. **Database initialized?**
   ```
   Backend console shows: Database connected
   If not: cd backend && npm run db:init
   ```

3. **Frontend running?**
   ```
   Terminal shows: "Local: http://localhost:5173"
   If not: npm run dev
   ```

4. **Check browser console (F12)**
   ```
   Look for any red error messages
   Note the error and check solutions above
   ```

5. **Restart everything**
   ```
   Kill both (Ctrl+C)
   Start backend: cd backend && npm run dev
   Start frontend: npm run dev
   Try again
   ```

---

## Error Messages You Should See (Good!)

### During Signup:
```
✅ Attempting signup with: {...}
✅ Signup successful: {...}
✅ Token saved, navigating to dashboard
```

### During Login:
```
✅ Attempting login with: {...}
✅ Login successful: {...}
✅ Token saved, navigating to dashboard
```

### On Dashboard:
```
✅ Token added to request: eyJ...
📍 Dashboard mounted. Token exists: true
📤 Fetching dashboard stats...
📥 Stats received: {...}
```

---

## File Changes Made

### Frontend
- `src/pages/Login.jsx` - Added logging and error handling
- `src/pages/Signup.jsx` - Added validation and logging
- `src/styles/auth.css` - Added error styling

### What Changed
1. Console logging for every step
2. Client-side validation with clear messages
3. Better error display
4. More helpful error feedback
5. Loading state improvements

---

**Now try signup/login and check the console messages! 🎯**

**If you see ✅ messages = Working!**
**If you see ❌ errors = Follow the solution above**
