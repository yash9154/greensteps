# 🔐 JWT Secret Token Setup Guide

## Quick Start (30 seconds)

### Windows
```bash
cd y:\greensteps\backend
node generate-jwt-secrets.js
```

### Mac/Linux
```bash
cd backend
node generate-jwt-secrets.js
```

This will:
1. ✅ Generate two secure random tokens
2. ✅ Update your .env file automatically
3. ✅ Show you the generated tokens

---

## What Are JWT Secrets?

JWT (JSON Web Token) secrets are cryptographic keys used to:
- **Sign** tokens when users login
- **Verify** tokens when users make requests
- **Prevent tampering** - ensures tokens haven't been modified

### Two Types of Secrets

**JWT_ACCESS_SECRET**
- Used for access tokens (short-lived, 15 minutes)
- Validates regular API requests
- Expires quickly for security

**JWT_REFRESH_SECRET**
- Used for refresh tokens (long-lived, 7 days)
- Allows users to get new access tokens
- Can refresh without logging in again

---

## How to Generate Tokens

### Method 1: Automated Script (Recommended)

#### Windows:
```bash
cd backend
node generate-jwt-secrets.js
```

#### Mac/Linux:
```bash
cd backend
node generate-jwt-secrets.js
```

#### Or Double-click:
```
backend/generate-jwt-secrets.bat (Windows)
```

---

### Method 2: Manual Generation

If the script doesn't work, generate tokens manually:

#### Option A: Using Node.js REPL
```bash
node
```

Then in the Node shell:
```javascript
const crypto = require('crypto');
console.log(crypto.randomBytes(64).toString('hex'));
```

Press Enter twice to generate a token. Repeat for second token.

#### Option B: Using OpenSSL
```bash
openssl rand -hex 64
openssl rand -hex 64
```

Generates two 128-character hex strings.

#### Option C: Copy-Paste Ready Tokens

Here are pre-generated example tokens (for development only):

```
JWT_ACCESS_SECRET=a7f9e2c5d8b1f4a6e9c2d5f8b1a4e7d0c3f6a9b2e5f8c1d4a7e0f3c6b9a2d5f8c1e4a7b0d3e6f9c2b5a8e1d4f7a0c3b6e9d2a5f8b1c4e7a0d3f6b9c2e5a8d1f4b7a0c3e6d9f2b5c8a1e4f7a0d3b6

JWT_REFRESH_SECRET=f4b7c0a3e6d9f2b5c8a1d4e7a0b3c6f9a2d5e8b1c4f7a0d3e6b9c2f5a8d1e4b7c0a3f6d9e2b5a8c1f4e7a0d3b6c9f2a5d8e1b4f7a0c3d6e9f2b5c8a1d4e7b0c3f6a9d2e5f8a1b4c7e0f3

```

---

## ✅ Setup Process

### Step 1: Generate Secrets
```bash
cd y:\greensteps\backend
node generate-jwt-secrets.js
```

Output:
```
🔐 Generating JWT Secret Tokens...

✅ Generated Secrets:

JWT_ACCESS_SECRET:
a7f9e2c5d8b1f4a6e9c2d5f8b1a4e7d0c3f6a9b2e5f8c1d4a7e0f3c6b9a2d5f8c1e4a7b0d3e6f9c2b5a8e1d4f7a0c3b6e9d2a5f8b1c4e7a0d3f6b9c2e5a8d1f4b7a0c3e6d9f2b5c8a1e4f7a0d3b6

JWT_REFRESH_SECRET:
f4b7c0a3e6d9f2b5c8a1d4e7a0b3c6f9a2d5e8b1c4f7a0d3e6b9c2f5a8d1e4b7c0a3f6d9e2b5a8c1f4e7a0d3b6c9f2a5d8e1b4f7a0c3d6e9f2b5c8a1d4e7b0c3f6a9d2e5f8a1b4c7e0f3

✅ .env file updated successfully!

🎉 Done! Your JWT secrets are ready.

📋 Summary:
   Access Secret Length: 128 characters
   Strength: ✅ Strong (64+ chars)
```

### Step 2: Verify .env File
```bash
# Check your backend/.env file contains:
JWT_ACCESS_SECRET=a7f9e2c5d8b1f4a6e9c2d5f8b1a4e7d0c3f6a9b2e5f8c1d4a7e0f3c6b9a2d5f8c1e4a7b0d3e6f9c2b5a8e1d4f7a0c3b6e9d2a5f8b1c4e7a0d3f6b9c2e5a8d1f4b7a0c3e6d9f2b5c8a1e4f7a0d3b6
JWT_REFRESH_SECRET=f4b7c0a3e6d9f2b5c8a1d4e7a0b3c6f9a2d5e8b1c4f7a0d3e6b9c2f5a8d1e4b7c0a3f6d9e2b5a8c1f4e7a0d3b6c9f2a5d8e1b4f7a0c3d6e9f2b5c8a1d4e7b0c3f6a9d2e5f8a1b4c7e0f3
```

### Step 3: Restart Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Server running on port 5000
```

### Step 4: Test Login
```
1. Go to http://localhost:5173/signup
2. Create an account
3. Should see success with tokens
4. Check console for: ✅ Token added to request
```

---

## 📋 .env File Setup

Your `backend/.env` should look like:

```dotenv
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=pass123
DB_NAME=greensteps
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secrets (Generated automatically)
JWT_ACCESS_SECRET=a7f9e2c5d8b1f4a6e9c2d5f8b1a4e7d0c3f6a9b2e5f8c1d4a7e0f3c6b9a2d5f8c1e4a7b0d3e6f9c2b5a8e1d4f7a0c3b6e9d2a5f8b1c4e7a0d3f6b9c2e5a8d1f4b7a0c3e6d9f2b5c8a1e4f7a0d3b6
JWT_REFRESH_SECRET=f4b7c0a3e6d9f2b5c8a1d4e7a0b3c6f9a2d5e8b1c4f7a0d3e6b9c2f5a8d1e4b7c0a3f6d9e2b5a8c1f4e7a0d3b6c9f2a5d8e1b4f7a0c3d6e9f2b5c8a1d4e7b0c3f6a9d2e5f8a1b4c7e0f3
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## 🔒 Security Best Practices

### Do's ✅
- ✅ Use generated random tokens (128+ characters)
- ✅ Store secrets in .env file (never in code)
- ✅ Keep .env file private (add to .gitignore)
- ✅ Rotate secrets periodically in production
- ✅ Use different secrets for dev/prod
- ✅ Never commit .env to git

### Don'ts ❌
- ❌ Don't use simple passwords like "secret" or "password123"
- ❌ Don't hardcode secrets in source files
- ❌ Don't share secrets in emails or chat
- ❌ Don't use same secret for multiple environments
- ❌ Don't commit .env file to version control
- ❌ Don't use predictable patterns

---

## Token Structure

### Access Token (Example)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTczMDQ1MjEwMCwiZXhwIjoxNzMwNDUyOTAwfQ.xyz...
```

**Breakdown:**
- Header: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` (algo + type)
- Payload: `eyJ1c2VySWQiOjUsImlhdCI6MTczMDQ1MjEwMCwiZXhwIjoxNzMwNDUyOTAwfQ` (user data)
- Signature: `xyz...` (signed with JWT_ACCESS_SECRET)

**Token expires after:** 15 minutes (configured in JWT_ACCESS_EXPIRE)

### Refresh Token (Example)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTczMDQ1MjEwMCwiZXhwIjoxNzMxMDU3MDAwfQ.abc...
```

**Token expires after:** 7 days (configured in JWT_REFRESH_EXPIRE)

---

## Troubleshooting

### Error: "Node not found"
```bash
# Make sure Node.js is installed
node --version

# If not installed, download from nodejs.org
```

### Error: "File not found"
```bash
# Make sure you're in the backend directory
cd y:\greensteps\backend
node generate-jwt-secrets.js
```

### Error: ".env file not found"
```bash
# Copy .env.example to .env first
copy .env.example .env

# Then run generator
node generate-jwt-secrets.js
```

### Tokens not working in login
```bash
# Make sure backend was restarted after updating .env
cd backend
npm run dev

# Wait for: "✅ Server running on port 5000"
```

---

## Testing Tokens

### Check Token in Console
After login, in DevTools console:
```javascript
const token = localStorage.getItem('accessToken');
console.log('Token:', token);

// Decode (no verification, just view)
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('User ID:', payload.userId);
console.log('Expires:', new Date(payload.exp * 1000));
```

### Check Token Expiration
```javascript
const token = localStorage.getItem('accessToken');
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));

const expiresAt = new Date(payload.exp * 1000);
const now = new Date();
const minutesLeft = Math.floor((expiresAt - now) / 1000 / 60);

console.log(`Token expires in ${minutesLeft} minutes`);
```

---

## Production Deployment

### Before Deploying:

1. **Generate new secrets**
   ```bash
   node generate-jwt-secrets.js
   ```

2. **Update production .env**
   ```
   Copy new secrets to production environment
   ```

3. **Use environment variables**
   ```bash
   # In production platform (Heroku, Railway, etc)
   # Set environment variables:
   JWT_ACCESS_SECRET=<generated_token>
   JWT_REFRESH_SECRET=<generated_token>
   ```

4. **Never commit secrets**
   ```bash
   # .gitignore already has .env
   echo ".env" >> .gitignore
   ```

---

## Token Lifecycle

```
User Signup
    ↓
Generate JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
    ↓
Create Access Token (15 min expiry)
    ↓
Create Refresh Token (7 day expiry)
    ↓
Send both to frontend
    ↓
Frontend stores in localStorage
    ↓
Access token used for API requests
    ↓
When access expires (15 min):
    - Use refresh token to get new access token
    - User stays logged in (no re-login needed)
    ↓
When refresh expires (7 days):
    - User must login again
    - New tokens generated
```

---

## Quick Commands

```bash
# Generate secrets
node backend/generate-jwt-secrets.js

# Verify secrets in .env
cat backend/.env | grep JWT

# Restart backend with new secrets
cd backend && npm run dev

# Test login
# Go to http://localhost:5173/signup
```

---

**Your JWT secrets are now set up! 🎉**

**Next: Restart your backend and try logging in:**
```bash
cd backend
npm run dev
```
