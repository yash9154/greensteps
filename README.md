# GreenSteps – Zero Waste Lifestyle Tracker

A full-stack web application built with React (Vite), Node.js + Express, and MySQL to help users track their daily waste, earn reward points, and promote sustainable living.

## 📋 Project Structure

```
greensteps/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── database.js        # MySQL connection pool
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── wasteController.js
│   │   ├── dashboardController.js
│   │   ├── rewardController.js
│   │   └── adminController.js
│   ├── models/                # Database models
│   │   ├── User.js
│   │   ├── WasteRecord.js
│   │   ├── Reward.js
│   │   └── WasteType.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── wasteRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── rewardRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/            # Auth & error handling
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/                 # Utilities
│   │   ├── validators.js
│   │   └── jwt.js
│   ├── scripts/               # Database scripts
│   │   ├── schema.sql
│   │   └── initDatabase.js
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env.example
│
├── src/                       # React Frontend
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddWaste.jsx
│   │   ├── WasteList.jsx
│   │   ├── Rewards.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/
│   │   └── api.js             # Axios API calls
│   ├── context/
│   │   └── AuthContext.jsx    # Auth state management
│   ├── utils/
│   │   └── useAuth.js         # Auth hook
│   ├── styles/
│   │   ├── global.css
│   │   ├── layout.css
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── waste.css
│   │   ├── rewards.css
│   │   └── admin.css
│   ├── App.jsx                # Main app component
│   ├── main.jsx
│   └── index.css
│
├── package.json               # Frontend dependencies
└── README.md                  # This file
```

## 🚀 Features

### Core Modules

1. **User Module**
   - Registration & Login with JWT authentication
   - Secure password hashing with bcrypt
   - Profile management
   - Session persistence

2. **Waste Tracking Module**
   - Add, edit, delete waste entries
   - Support for multiple waste types (Plastic, Paper, Food, Glass)
   - Entry metadata: date, type, quantity, notes
   - View waste history with pagination

3. **Dashboard Module**
   - Real-time analytics and statistics
   - Total waste tracked
   - Waste breakdown by category
   - Weekly progress visualization
   - Reward points display

4. **Rewards Module**
   - Automatic point allocation
   - Badge system (Starter → Eco Warrior)
   - Points history tracking
   - Milestone rewards

5. **Admin Module**
   - View all users and their data
   - Monitor system-wide waste statistics
   - Export waste records as CSV
   - Admin-only access controls

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Native MySQL2 with prepared statements
- **Auth:** JWT (Access + Refresh Tokens)
- **Security:** bcryptjs, express-validator
- **Email:** Nodemailer
- **Environment:** dotenv

### Frontend
- **Library:** React 19.2
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** CSS3 with CSS variables
- **State Management:** React Context API

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MySQL (v5.7+)
- npm or yarn

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env` with your database credentials:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=greensteps
   DB_PORT=3306
   PORT=5000
   NODE_ENV=development
   JWT_ACCESS_SECRET=your_access_token_secret_key_min_32_chars
   JWT_REFRESH_SECRET=your_refresh_token_secret_key_min_32_chars
   JWT_ACCESS_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   FRONTEND_URL=http://localhost:5173
   ```

5. **Initialize database:**
   ```bash
   npm run db:init
   ```

   This will:
   - Create the `greensteps` database
   - Initialize all tables
   - Seed waste types (Plastic, Paper, Food, Glass)

6. **Start backend server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📡 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user (returns JWT)

### Waste Tracking
- `POST /waste/add` - Add waste entry
- `GET /waste/list` - Get user's waste records
- `PUT /waste/:recordId` - Update waste entry
- `DELETE /waste/:recordId` - Delete waste entry
- `GET /waste/types` - Get available waste types

### Dashboard
- `GET /dashboard/stats` - Get user dashboard statistics

### Rewards
- `GET /rewards` - Get user rewards & points
- `GET /rewards/check-streak` - Check logging streak
- `GET /rewards/all` - Get all users' rewards

### Admin (requires admin role)
- `GET /admin/users` - Get all users
- `GET /admin/waste` - Get all waste records
- `GET /dashboard/admin/export-csv` - Export waste as CSV

## 🔐 Security Features

- ✅ **SQL Injection Prevention:** Prepared statements for all queries
- ✅ **Password Security:** Bcrypt hashing with salt rounds
- ✅ **XSS Prevention:** Input validation and sanitization
- ✅ **CSRF Protection:** JWT-based stateless authentication
- ✅ **Access Control:** Role-based admin checks
- ✅ **Token Expiration:** Access and refresh token rotation
- ✅ **Environment Variables:** Secrets management with dotenv

## 🗄️ Database Schema

### Users Table
```sql
user_id (PK), name, email (UNIQUE), password_hash, is_admin, created_at
```

### Waste Types Table
```sql
waste_type_id (PK), type_code (UNIQUE), display_name, unit
```

### Waste Records Table
```sql
record_id (PK), user_id (FK), entry_date, waste_type_id (FK), quantity, notes, created_at
```

### Rewards Table
```sql
reward_id (PK), user_id (FK UNIQUE), points, badge, awarded_on, created_at
```

### Points History Table
```sql
ph_id (PK), user_id (FK), change, reason, created_at
```

## 🎨 UI/UX Design

- **Green Theme:** Sustainability-focused color palette
- **Responsive Design:** Mobile-first approach
- **Clean Layout:** Sidebar navigation + Header
- **Dashboard Cards:** Key metrics at a glance
- **Data Visualization:** Waste trends and progress
- **Accessibility:** Semantic HTML, keyboard navigation

## 📱 Frontend Pages

1. **Login Page** - Email/password authentication
2. **Signup Page** - User registration with validation
3. **Dashboard** - Analytics overview & metrics
4. **Add Waste Entry** - Form to log waste
5. **Waste List** - History of entries with pagination
6. **Rewards Page** - Points, badges, and milestones
7. **Admin Dashboard** - User management & statistics

## 🔄 Authentication Flow

1. User signs up → Password hashed → Account created
2. User logs in → JWT access token issued
3. Access token stored in localStorage
4. Token attached to all API requests
5. On token expiration → Redirect to login

## 🧪 Testing the Application

### Test User Signup
```bash
POST http://localhost:5000/auth/signup
Body: {
  "name": "John Eco",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

### Test Add Waste Entry
```bash
POST http://localhost:5000/waste/add
Headers: {
  "Authorization": "Bearer <JWT_TOKEN>"
}
Body: {
  "entry_date": "2025-01-15",
  "waste_type_id": 1,
  "quantity": 2.5,
  "notes": "Plastic bottles"
}
```

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Add `Procfile`: `web: node server.js`
2. Set environment variables in platform
3. Deploy with git push

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Configure environment: `VITE_API_URL=<backend_url>`

## 🐛 Troubleshooting

**Database Connection Error:**
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database exists

**CORS Error:**
- Backend CORS configured for `http://localhost:5173`
- Update `FRONTEND_URL` in backend `.env` if needed

**Auth Issues:**
- Clear localStorage and login again
- Check JWT secrets in `.env`

## 📝 Environment Variables

See `.env.example` for complete list:
- DB Configuration
- Server Port
- JWT Secrets & Expiration
- Email Service (optional)
- Frontend URL

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Guide](https://jwt.io/)

## 📄 License

MIT License - Feel free to use this project for learning and personal projects.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Happy Tracking! 🌱 Let's make the world greener together!**
