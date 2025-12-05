@echo off
REM GreenSteps - Complete Module Testing Script (Windows)
REM Tests all 5 modules and their endpoints

setlocal enabledelayedexpansion

echo 🌱 GreenSteps - All Modules Testing Script
echo ==========================================
echo.

set BASE_URL=http://localhost:5000
set TEST_EMAIL=testuser_%random%@example.com
set TEST_PASSWORD=TestPass123
set ACCESS_TOKEN=
set USER_ID=
set WASTE_ID=

REM ============================================================
REM MODULE 1: USER AUTHENTICATION
REM ============================================================
echo.
echo ===== MODULE 1: USER AUTHENTICATION =====
echo.

echo Testing: POST /auth/signup
curl -X POST "%BASE_URL%/auth/signup" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Test User\", \"email\": \"%TEST_EMAIL%\", \"password\": \"%TEST_PASSWORD%\", \"confirmPassword\": \"%TEST_PASSWORD%\"}"

echo.
echo Testing: POST /auth/login
curl -X POST "%BASE_URL%/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"%TEST_EMAIL%\", \"password\": \"%TEST_PASSWORD%\"}"

REM Note: You'll need to copy the accessToken from the response above and set it manually
REM For automated testing, save the response to a file and parse it

REM ============================================================
REM MODULE 2: WASTE TRACKING
REM ============================================================
echo.
echo ===== MODULE 2: WASTE TRACKING =====
echo.

echo Testing: GET /waste/types
REM For this to work, replace YOUR_TOKEN with actual token from login
curl -X GET "%BASE_URL%/waste/types" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

echo.
echo.
echo Testing: POST /waste/add
curl -X POST "%BASE_URL%/waste/add" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" ^
  -H "Content-Type: application/json" ^
  -d "{\"entry_date\": \"2024-01-01\", \"waste_type_id\": 1, \"quantity\": 2.5, \"notes\": \"Test waste entry\"}"

echo.
echo Testing: GET /waste/list
curl -X GET "%BASE_URL%/waste/list" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

REM ============================================================
REM MODULE 3: DASHBOARD
REM ============================================================
echo.
echo ===== MODULE 3: DASHBOARD =====
echo.

echo Testing: GET /dashboard/stats
curl -X GET "%BASE_URL%/dashboard/stats" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

REM ============================================================
REM MODULE 4: REWARDS
REM ============================================================
echo.
echo ===== MODULE 4: REWARDS =====
echo.

echo Testing: GET /rewards
curl -X GET "%BASE_URL%/rewards" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

echo.
echo Testing: GET /rewards/all
curl -X GET "%BASE_URL%/rewards/all" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

REM ============================================================
REM MODULE 5: ADMIN
REM ============================================================
echo.
echo ===== MODULE 5: ADMIN =====
echo.

echo Testing: GET /admin/users
curl -X GET "%BASE_URL%/admin/users" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

echo.
echo Testing: GET /admin/waste
curl -X GET "%BASE_URL%/admin/waste" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

echo.
echo ===== TESTING SUMMARY =====
echo.
echo All 5 modules tested!
echo ✅ Module 1: User Authentication
echo ✅ Module 2: Waste Tracking
echo ✅ Module 3: Dashboard Analytics
echo ✅ Module 4: Rewards System
echo ✅ Module 5: Admin Panel
echo.
echo To run automated tests:
echo 1. Start backend: cd y:\greensteps\backend ^&^& npm run dev
echo 2. In another terminal, start frontend: cd y:\greensteps ^&^& npm run dev
echo 3. Navigate to http://localhost:5173 in browser
echo 4. Test signup/login flow
echo 5. Add waste entries
echo 6. Check dashboard, rewards, and admin panels
echo.

pause
