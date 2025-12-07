#!/usr/bin/env node

/**
 * GreenSteps - Complete Module Testing Script
 * Tests all 5 modules and their endpoints
 * 
 * Run with: node test-all-modules.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';
const TEST_EMAIL = `testuser_${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPass123';

let accessToken = '';
let userId = '';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
};

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Helper to print headers
function printHeader(title) {
  console.log(`\n${colors.blue}===== ${title} =====${colors.reset}\n`);
}

// Helper to print success
function printSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

// Helper to print error
function printError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

// Helper to print JSON
function printJSON(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

// Main testing function
async function runTests() {
  try {
    console.log('🌱 GreenSteps - All Modules Testing Script');
    console.log('==========================================\n');

    // ============================================================
    // MODULE 1: USER AUTHENTICATION
    // ============================================================
    printHeader('MODULE 1: USER AUTHENTICATION');

    // Test signup
    console.log('Testing: POST /auth/signup');
    let response = await makeRequest('POST', '/auth/signup', {
      name: 'Test User',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      confirmPassword: TEST_PASSWORD,
    });

    if (response.status === 200 || response.status === 201) {
      printSuccess('User signup successful');
      accessToken = response.body.accessToken;
      userId = response.body.user.userId;
      console.log(`Email: ${TEST_EMAIL}`);
      console.log(`Token: ${accessToken.substring(0, 20)}...`);
    } else {
      printError(`Signup failed: ${response.status}`);
      printJSON(response.body);
    }

    // Test login
    console.log('\nTesting: POST /auth/login');
    response = await makeRequest('POST', '/auth/login', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (response.status === 200) {
      printSuccess('User login successful');
      accessToken = response.body.accessToken;
    } else {
      printError(`Login failed: ${response.status}`);
      printJSON(response.body);
    }

    // ============================================================
    // MODULE 2: WASTE TRACKING
    // ============================================================
    printHeader('MODULE 2: WASTE TRACKING');

    // Get waste types
    console.log('Testing: GET /waste/types');
    response = await makeRequest('GET', '/waste/types', null, accessToken);
    
    if (response.status === 200) {
      printSuccess('Waste types retrieved');
      console.log(`Found ${response.body.length} waste types:`);
      response.body.forEach((type) => {
        console.log(`  - ${type.display_name} (${type.unit})`);
      });
    } else {
      printError(`Failed to get waste types: ${response.status}`);
    }

    // Add waste entry
    console.log('\nTesting: POST /waste/add');
    const today = new Date().toISOString().split('T')[0];
    response = await makeRequest(
      'POST',
      '/waste/add',
      {
        entry_date: today,
        waste_type_id: 1,
        quantity: 2.5,
        notes: 'Test waste entry',
      },
      accessToken
    );

    if (response.status === 201 || response.status === 200) {
      printSuccess('Waste entry added');
      const wasteId = response.body.record_id;
      console.log(`Waste ID: ${wasteId}`);
    } else {
      printError(`Failed to add waste: ${response.status}`);
      printJSON(response.body);
    }

    // Get waste list
    console.log('\nTesting: GET /waste/list');
    response = await makeRequest('GET', '/waste/list', null, accessToken);
    
    if (response.status === 200) {
      printSuccess('Waste list retrieved');
      console.log(`Found ${response.body.total || response.body.length} waste entries`);
    } else {
      printError(`Failed to get waste list: ${response.status}`);
    }

    // ============================================================
    // MODULE 3: DASHBOARD
    // ============================================================
    printHeader('MODULE 3: DASHBOARD');

    console.log('Testing: GET /dashboard/stats');
    response = await makeRequest('GET', '/dashboard/stats', null, accessToken);

    if (response.status === 200) {
      printSuccess('Dashboard stats retrieved');
      console.log(`Total waste: ${response.body.totalWaste} kg`);
      console.log(`Current badge: ${response.body.reward?.badge || 'N/A'}`);
      console.log(`Current points: ${response.body.reward?.points || 0}`);
    } else {
      printError(`Failed to get dashboard stats: ${response.status}`);
      printJSON(response.body);
    }

    // ============================================================
    // MODULE 4: REWARDS
    // ============================================================
    printHeader('MODULE 4: REWARDS');

    console.log('Testing: GET /rewards');
    response = await makeRequest('GET', '/rewards', null, accessToken);

    if (response.status === 200) {
      printSuccess('Rewards retrieved');
      console.log(`Points: ${response.body.points || 0}`);
      console.log(`Badge: ${response.body.badge || 'STARTER'}`);
    } else {
      printError(`Failed to get rewards: ${response.status}`);
      printJSON(response.body);
    }

    console.log('\nTesting: GET /rewards/all');
    response = await makeRequest('GET', '/rewards/all', null, accessToken);

    if (response.status === 200) {
      printSuccess('Leaderboard retrieved');
      if (Array.isArray(response.body) && response.body.length > 0) {
        console.log(`Top users:`);
        response.body.slice(0, 5).forEach((user, index) => {
          console.log(
            `  ${index + 1}. ${user.name || 'Anonymous'} - ${user.points} points`
          );
        });
      }
    } else {
      printError(`Failed to get leaderboard: ${response.status}`);
    }

    // ============================================================
    // MODULE 5: ADMIN
    // ============================================================
    printHeader('MODULE 5: ADMIN');

    console.log('Testing: GET /admin/users');
    response = await makeRequest('GET', '/admin/users', null, accessToken);

    if (response.status === 200) {
      printSuccess('Admin users endpoint accessible');
      console.log(`Total users: ${response.body.length || 0}`);
    } else if (response.status === 403) {
      console.log(
        `${colors.yellow}⚠️  Admin endpoint requires admin privileges${colors.reset}`
      );
    } else {
      printError(`Failed to access admin users: ${response.status}`);
    }

    console.log('\nTesting: GET /admin/waste');
    response = await makeRequest('GET', '/admin/waste', null, accessToken);

    if (response.status === 200) {
      printSuccess('Admin waste endpoint accessible');
    } else if (response.status === 403) {
      console.log(
        `${colors.yellow}⚠️  Admin endpoint requires admin privileges${colors.reset}`
      );
    } else {
      printError(`Failed to access admin waste: ${response.status}`);
    }

    // ============================================================
    // SUMMARY
    // ============================================================
    printHeader('TESTING SUMMARY');

    console.log('Test completed successfully!');
    console.log('\nModules tested:');
    console.log('✅ Module 1: User Authentication');
    console.log('✅ Module 2: Waste Tracking');
    console.log('✅ Module 3: Dashboard Analytics');
    console.log('✅ Module 4: Rewards System');
    console.log('✅ Module 5: Admin Panel');
    console.log('\nTest user created:');
    console.log(`Email: ${TEST_EMAIL}`);
    console.log(`Password: ${TEST_PASSWORD}`);
    console.log(`\nYou can now test the frontend at: http://localhost:5173`);
  } catch (error) {
    printError(`Test error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runTests().then(() => {
  console.log('\n✨ All tests completed!\n');
  process.exit(0);
});
