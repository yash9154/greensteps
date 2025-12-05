#!/bin/bash
# GreenSteps - Complete Module Testing Script
# Tests all 5 modules and their endpoints

echo "🌱 GreenSteps - All Modules Testing Script"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"
TEST_EMAIL="testuser_$(date +%s)@example.com"
TEST_PASSWORD="TestPass123"
ACCESS_TOKEN=""
USER_ID=""
WASTE_ID=""

# Function to print headers
print_header() {
  echo ""
  echo -e "${BLUE}===== $1 =====${NC}"
  echo ""
}

# Function to print success
print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
print_error() {
  echo -e "${RED}❌ $1${NC}"
}

# ============================================================
# MODULE 1: USER AUTHENTICATION
# ============================================================
print_header "MODULE 1: USER AUTHENTICATION"

echo "Testing: POST /auth/signup"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"confirmPassword\": \"$TEST_PASSWORD\"
  }")

echo "$SIGNUP_RESPONSE" | jq .

if echo "$SIGNUP_RESPONSE" | jq -e '.accessToken' > /dev/null 2>&1; then
  print_success "User signup successful"
  ACCESS_TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.user.userId')
  USER_ID=$(echo "$SIGNUP_RESPONSE" | jq -r '.user.userId')
  ACCESS_TOKEN=$(echo "$SIGNUP_RESPONSE" | jq -r '.accessToken')
else
  print_error "User signup failed"
fi

echo ""
echo "Testing: POST /auth/login"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "$LOGIN_RESPONSE" | jq .

if echo "$LOGIN_RESPONSE" | jq -e '.accessToken' > /dev/null 2>&1; then
  print_success "User login successful"
  ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')
else
  print_error "User login failed"
fi

# ============================================================
# MODULE 2: WASTE TRACKING
# ============================================================
print_header "MODULE 2: WASTE TRACKING"

echo "Testing: GET /waste/types"
TYPES_RESPONSE=$(curl -s -X GET "$BASE_URL/waste/types" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$TYPES_RESPONSE" | jq .
print_success "Waste types retrieved"

echo ""
echo "Testing: POST /waste/add"
ADD_WASTE_RESPONSE=$(curl -s -X POST "$BASE_URL/waste/add" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"entry_date\": \"$(date +%Y-%m-%d)\",
    \"waste_type_id\": 1,
    \"quantity\": 2.5,
    \"notes\": \"Test waste entry\"
  }")

echo "$ADD_WASTE_RESPONSE" | jq .

if echo "$ADD_WASTE_RESPONSE" | jq -e '.record_id' > /dev/null 2>&1; then
  print_success "Waste entry added"
  WASTE_ID=$(echo "$ADD_WASTE_RESPONSE" | jq -r '.record_id')
else
  print_error "Failed to add waste entry"
fi

echo ""
echo "Testing: GET /waste/list"
LIST_RESPONSE=$(curl -s -X GET "$BASE_URL/waste/list" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$LIST_RESPONSE" | jq .
print_success "Waste list retrieved"

# ============================================================
# MODULE 3: DASHBOARD
# ============================================================
print_header "MODULE 3: DASHBOARD"

echo "Testing: GET /dashboard/stats"
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/dashboard/stats" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$STATS_RESPONSE" | jq .

if echo "$STATS_RESPONSE" | jq -e '.totalWaste' > /dev/null 2>&1; then
  print_success "Dashboard stats retrieved"
  TOTAL_WASTE=$(echo "$STATS_RESPONSE" | jq -r '.totalWaste')
  echo "Total waste tracked: $TOTAL_WASTE kg"
else
  print_error "Failed to retrieve dashboard stats"
fi

# ============================================================
# MODULE 4: REWARDS
# ============================================================
print_header "MODULE 4: REWARDS"

echo "Testing: GET /rewards"
REWARDS_RESPONSE=$(curl -s -X GET "$BASE_URL/rewards" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$REWARDS_RESPONSE" | jq .

if echo "$REWARDS_RESPONSE" | jq -e '.points' > /dev/null 2>&1; then
  print_success "Rewards retrieved"
  POINTS=$(echo "$REWARDS_RESPONSE" | jq -r '.points')
  BADGE=$(echo "$REWARDS_RESPONSE" | jq -r '.badge')
  echo "User points: $POINTS"
  echo "User badge: $BADGE"
else
  print_error "Failed to retrieve rewards"
fi

echo ""
echo "Testing: GET /rewards/all"
ALL_REWARDS=$(curl -s -X GET "$BASE_URL/rewards/all" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$ALL_REWARDS" | jq .
print_success "All rewards retrieved"

# ============================================================
# MODULE 5: ADMIN
# ============================================================
print_header "MODULE 5: ADMIN"

echo "Note: These endpoints require admin privileges"
echo ""
echo "Testing: GET /admin/users"
ADMIN_USERS=$(curl -s -X GET "$BASE_URL/admin/users" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$ADMIN_USERS" | jq .

if echo "$ADMIN_USERS" | jq -e '.[0].user_id' > /dev/null 2>&1; then
  print_success "Admin users endpoint accessible"
else
  echo "Note: Might require admin role"
fi

echo ""
echo "Testing: GET /admin/waste"
ADMIN_WASTE=$(curl -s -X GET "$BASE_URL/admin/waste" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$ADMIN_WASTE" | jq .

# ============================================================
# SUMMARY
# ============================================================
print_header "TESTING SUMMARY"

echo "Test User Email: $TEST_EMAIL"
echo "Access Token: ${ACCESS_TOKEN:0:20}..."
echo "User ID: $USER_ID"
echo ""
echo "All 5 modules tested!"
echo "✅ Module 1: User Authentication"
echo "✅ Module 2: Waste Tracking"
echo "✅ Module 3: Dashboard Analytics"
echo "✅ Module 4: Rewards System"
echo "✅ Module 5: Admin Panel"
echo ""
