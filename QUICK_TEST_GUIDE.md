# 🚀 Quick Test Reference

## Test Credentials

### For Signup
```
Name: Test User
Email: testuser@example.com
Password: TestPass123
Confirm: TestPass123
```

### For Login (after signup)
```
Email: testuser@example.com
Password: TestPass123
```

---

## Quick Steps to Test

### 1️⃣ Clear & Refresh
```
F12 → Application → Storage → Clear All
Ctrl+Shift+R (refresh)
```

### 2️⃣ Go to Signup
```
http://localhost:5173/signup
```

### 3️⃣ Fill Form
```
Name: Test User
Email: testuser@example.com
Password: TestPass123
Confirm: TestPass123
```

### 4️⃣ Click Sign Up
```
Open DevTools (F12) → Console
Look for: ✅ Signup successful
Should redirect to dashboard
```

### 5️⃣ Check Dashboard
```
Should see stats
Should see "Total Waste Tracked: 0 kg"
Should see "Reward Points: 0 pts"
```

---

## Error Response Codes

| Error | Status | Cause | Fix |
|-------|--------|-------|-----|
| "All fields required" | 400 | Empty field | Fill all fields |
| "Invalid email" | 400 | Bad format | Use name@domain.com |
| "Password too short" | 400 | < 8 chars | Use 8+ characters |
| "Password invalid" | 400 | Missing uppercase/lowercase/number | Add all 3 types |
| "Passwords don't match" | 400 | Mismatch | Make them identical |
| "Email registered" | 409 | Already exists | Use different email |
| "Invalid credentials" | 401 | Login: wrong pass | Check password |
| "Network Error" | - | Backend down | Start backend |
| "Internal error" | 500 | Server error | Check backend logs |

---

## Console Check

### ✅ Success Looks Like:
```
🔐 Attempting signup with: {...}
✅ Signup successful: {user: {...}, accessToken: "ey...", refreshToken: "ey..."}
✅ Token saved, navigating to dashboard
```

### ❌ Error Looks Like:
```
❌ Signup error: Error: Request failed
📍 Error details: {
  status: 400,
  data: { error: "Email already registered" },
  message: "Request failed with status code 400"
}
```

---

## Troubleshoot in 30 Seconds

1. Backend running? `npm run dev` in /backend
2. Frontend running? `npm run dev` in root  
3. Database init? `npm run db:init` in /backend
4. Check console (F12)
5. Look for error message
6. Fix issue above
7. Try again

---

**Test it now! 🎯**
