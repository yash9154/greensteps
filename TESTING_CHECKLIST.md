# 🧪 GreenSteps - Testing Checklist

## ✅ Quick Test Guide

### **1. HOME PAGE BUTTONS**

#### Hero Section
- [ ] Click "Start Your Journey 🚀" button
  - Expected: Redirects to Sign Up page
- [ ] Click "Already Have Account? Login" button
  - Expected: Redirects to Login page

#### Navigation Bar (Not Logged In)
- [ ] Click "Login" button in navbar
  - Expected: Redirects to Login page
- [ ] Click "Get Started" button in navbar
  - Expected: Redirects to Sign Up page

---

### **2. FEATURE CARDS (NOT LOGGED IN)**

All 6 feature cards should redirect to **Sign Up**:

- [ ] Click "Track Waste" card
- [ ] Click "Earn Rewards" card
- [ ] Click "Real-Time Stats" card
- [ ] Click "Leaderboard" card
- [ ] Click "History & Export" card
- [ ] Click "Admin Dashboard" card

Expected: All should go to Sign Up page

---

### **3. SIGN UP & AUTO-LOGIN**

- [ ] Go to Sign Up page
- [ ] Fill in form:
  - Name: `Test User`
  - Email: `test_$(date +%s)@example.com`
  - Password: `TestPass123`
- [ ] Click Sign Up button
- [ ] Expected: 
  - Account created ✅
  - Auto redirected to Dashboard ✅
  - "Welcome back, Test" message shows ✅

---

### **4. FEATURE CARDS (LOGGED IN)**

Now test each feature card while logged in:

- [ ] Click "Track Waste" card
  - Expected: Go to `/add-waste`
- [ ] Go back to home
- [ ] Click "Earn Rewards" card
  - Expected: Go to `/rewards`
- [ ] Go back to home
- [ ] Click "Real-Time Stats" card
  - Expected: Go to `/dashboard`
- [ ] Go back to home
- [ ] Click "Leaderboard" card
  - Expected: Go to `/rewards` (leaderboard section)
- [ ] Go back to home
- [ ] Click "History & Export" card
  - Expected: Go to `/waste-list`

---

### **5. TEXT ALIGNMENT**

Check visual design:

- [ ] Hero title aligned to LEFT
- [ ] Hero description aligned to LEFT
- [ ] Feature card titles CENTERED
- [ ] Feature card descriptions CENTERED
- [ ] Feature CTA text CENTERED with arrow
- [ ] Step cards all CENTERED
- [ ] Footer content LEFT-aligned

---

### **6. HEADER FEATURES**

- [ ] See "Welcome back, [Name]" in header
- [ ] Click Logout button
  - Expected: Logged out, redirected to login
- [ ] Login again

---

### **7. ADMIN FEATURES (OPTIONAL)**

To test admin:

1. Make user admin (SQL):
```sql
UPDATE users SET is_admin = TRUE WHERE email = 'your_email@example.com';
```

2. Logout and login again

3. Test admin features:
   - [ ] See 👑 Admin badge in header
   - [ ] Go to home page
   - [ ] Click "Admin Dashboard" card
     - Expected: Go to `/admin`
   - [ ] See admin panel with user/waste tabs

---

### **8. RESPONSIVE DESIGN**

Test on different screen sizes:

- [ ] Desktop (1400px+)
  - Hero section looks good
  - Feature cards in 3 columns
  - Text properly aligned

- [ ] Tablet (768px - 1399px)
  - Feature cards in 2 columns
  - Navigation still works
  - Text readable

- [ ] Mobile (< 768px)
  - Feature cards in 1 column
  - Navigation responsive
  - All buttons clickable
  - Text fits screen

---

### **9. ANIMATIONS**

Visual feedback when interacting:

- [ ] Feature cards lift up on hover
- [ ] Feature cards show green border on hover
- [ ] Buttons have active state
- [ ] Smooth transitions (no jank)
- [ ] Icons bounce in feature section

---

### **10. ERROR HANDLING**

- [ ] Try signing up with existing email
  - Expected: Error message shown
- [ ] Try logging in with wrong password
  - Expected: Error message shown
- [ ] Try accessing admin page as non-admin
  - Expected: Access denied or redirected

---

## 📊 Test Results

| Test | Status | Notes |
|------|--------|-------|
| Home Buttons | ⏳ | Test in browser |
| Feature Cards (Not Logged In) | ⏳ | Should redirect to Sign Up |
| Sign Up Flow | ⏳ | Should auto-login |
| Feature Cards (Logged In) | ⏳ | Should go to respective pages |
| Text Alignment | ⏳ | Should look professional |
| Header Info | ⏳ | Should show user name |
| Admin Features | ⏳ | Only if user is admin |
| Responsive Design | ⏳ | Test on mobile/tablet |
| Animations | ⏳ | Should be smooth |
| Error Handling | ⏳ | Should show proper messages |

---

## 🎯 Success Criteria

✅ **All tests pass if:**
- All buttons navigate correctly
- Feature cards route to right pages
- Sign up auto-logs in
- Text is well-aligned
- Design looks professional
- No broken links
- Responsive on all devices

---

## 🚀 Quick Start Commands

```bash
# Start backend (if not running)
cd y:\greensteps\backend
npm run dev

# Start frontend (if not running)
cd y:\greensteps
npm run dev

# Open website
# http://localhost:5174
```

---

**Test and enjoy! 🌱** 

If any issues, check browser console (F12) for errors.
