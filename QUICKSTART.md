# 🌱 GreenSteps - Quick Start Guide

## 📋 What You Need

- **Node.js** v16+ (download from nodejs.org)
- **MySQL** (5.7+) - Download from mysql.com or use Docker
- **VS Code or any code editor**

## ⚡ Quick Start (5 minutes)

### Step 1: Start MySQL
Make sure MySQL is running on your machine.

**Windows (with MySQL installed):**
```cmd
mysql -u root -p
```

**Using Docker:**
```bash
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:latest
```

### Step 2: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=greensteps
```

Initialize database:
```bash
npm run db:init
```

Start backend server:
```bash
npm run dev
```
✅ Backend runs at: http://localhost:5000

### Step 3: Setup Frontend

Open a **new terminal** in the project root:

```bash
npm install
npm run dev
```
✅ Frontend runs at: http://localhost:5173

### Step 4: Test the App

1. Open http://localhost:5173 in your browser
2. Click "Sign up" to create a new account
3. Fill in the form with:
   - Name: Your Name
   - Email: test@example.com
   - Password: SecurePass123 (must have uppercase, lowercase, and number)
4. Click "Sign Up"
5. ✅ You're logged in! Start tracking waste!

## 📁 Project Files Overview

### Backend Structure
- `backend/server.js` - Main server file
- `backend/controllers/` - Business logic
- `backend/models/` - Database queries
- `backend/routes/` - API endpoints
- `backend/scripts/schema.sql` - Database schema

### Frontend Structure
- `src/App.jsx` - Main app with routing
- `src/pages/` - All page components
- `src/components/` - Reusable components
- `src/services/api.js` - API calls with Axios
- `src/context/AuthContext.jsx` - Authentication state

## 🔑 Key Features to Try

### 1. Add a Waste Entry
- Go to "Add Waste" page
- Select today's date
- Choose waste type (Plastic, Paper, etc.)
- Enter quantity in kg
- Click "Add Waste Entry"

### 2. View Dashboard
- Dashboard shows:
  - Total waste tracked
  - Waste breakdown by type
  - Weekly progress
  - Your reward points and badge

### 3. Check Rewards
- Go to "Rewards" page
- See your current points
- View points history
- See badge milestones

### 4. Admin Features (if admin)
- Go to "Admin Panel"
- View all users
- View all waste records
- Export waste data as CSV

## 🔐 Test Admin Account

If you want to test admin features, update the database directly:

```sql
USE greensteps;
UPDATE users SET is_admin = TRUE WHERE user_id = 1;
```

## ❓ Common Issues & Fixes

### "Cannot connect to database"
```bash
# Check if MySQL is running
# Windows: mysql -u root -p
# Mac: /usr/local/mysql/bin/mysql -u root -p
```

### "Port 5000/5173 already in use"
```bash
# Kill process on Windows
# Press Ctrl+C in the terminal, or
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "CORS error"
- Make sure backend is running on port 5000
- Check `.env` FRONTEND_URL matches your frontend URL

## 📚 API Examples

### Create Account
```bash
POST http://localhost:5000/auth/signup
Body: {
  "name": "John",
  "email": "john@test.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

### Login
```bash
POST http://localhost:5000/auth/login
Body: {
  "email": "john@test.com",
  "password": "SecurePass123"
}
```

### Add Waste
```bash
POST http://localhost:5000/waste/add
Header: Authorization: Bearer <YOUR_TOKEN>
Body: {
  "entry_date": "2025-01-15",
  "waste_type_id": 1,
  "quantity": 2.5,
  "notes": "Plastic bottles"
}
```

## 🎨 Default Color Scheme

- Primary Green: `#22c55e`
- Dark Green: `#16a34a`
- Light Green: `#dcfce7`
- Background: `#f8fafc`

## 📝 Database Schema Overview

```sql
users (id, name, email, password_hash, is_admin)
waste_types (id, type_code, display_name, unit)
waste_records (id, user_id, entry_date, waste_type_id, quantity, notes)
rewards (id, user_id, points, badge)
points_history (id, user_id, change, reason)
```

## 🚀 Next Steps

1. ✅ Get it running locally
2. ✅ Try all features
3. ✅ Test with test data
4. 📦 Deploy to hosting (Heroku/Vercel)
5. 🎨 Customize colors/branding
6. 📊 Add more waste types

## 💡 Tips

- Use Chrome DevTools for debugging
- Check browser console for errors
- Check backend terminal for API logs
- Use Postman/Thunder Client to test APIs directly
- Database queries use prepared statements (safe from SQL injection)

## 📞 Need Help?

Check the main README.md for:
- Full API documentation
- Detailed setup instructions
- Deployment guides
- Security features

---

**Happy tracking! 🌱**
