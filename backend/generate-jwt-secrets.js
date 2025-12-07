#!/usr/bin/env node

/**
 * JWT Secret Token Generator
 * Generates secure random tokens for JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
 * 
 * Usage: node generate-jwt-secrets.js
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate a secure random string
function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

// Main function
function generateAndSaveSecrets() {
  try {
    console.log('🔐 Generating JWT Secret Tokens...\n');

    // Generate tokens
    const accessSecret = generateSecret(64);
    const refreshSecret = generateSecret(64);

    console.log('✅ Generated Secrets:\n');
    console.log('JWT_ACCESS_SECRET:');
    console.log(accessSecret);
    console.log('\nJWT_REFRESH_SECRET:');
    console.log(refreshSecret);

    // Try to update .env file
    const envPath = path.join(__dirname, '.env');
    const envExamplePath = path.join(__dirname, '.env.example');

    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Replace secrets
      envContent = envContent.replace(
        /JWT_ACCESS_SECRET=.*/,
        `JWT_ACCESS_SECRET=${accessSecret}`
      );
      envContent = envContent.replace(
        /JWT_REFRESH_SECRET=.*/,
        `JWT_REFRESH_SECRET=${refreshSecret}`
      );

      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ .env file updated successfully!');
    } else if (fs.existsSync(envExamplePath)) {
      // Create .env from .env.example if it doesn't exist
      let envContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // Replace secrets
      envContent = envContent.replace(
        /JWT_ACCESS_SECRET=.*/,
        `JWT_ACCESS_SECRET=${accessSecret}`
      );
      envContent = envContent.replace(
        /JWT_REFRESH_SECRET=.*/,
        `JWT_REFRESH_SECRET=${refreshSecret}`
      );

      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ .env file created and updated with secrets!');
    } else {
      console.log('\n⚠️  .env file not found');
      console.log('📝 Manually add these to your .env file:\n');
      console.log(`JWT_ACCESS_SECRET=${accessSecret}`);
      console.log(`JWT_REFRESH_SECRET=${refreshSecret}`);
    }

    console.log('\n🎉 Done! Your JWT secrets are ready.\n');
    console.log('📋 Summary:');
    console.log(`   Access Secret Length: ${accessSecret.length} characters`);
    console.log(`   Refresh Secret Length: ${refreshSecret.length} characters`);
    console.log(`   Strength: ${accessSecret.length >= 64 ? '✅ Strong (64+ chars)' : '⚠️  Weak'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateAndSaveSecrets();
