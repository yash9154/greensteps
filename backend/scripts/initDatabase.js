import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('Connected to MySQL');

    // Create database
    const dbName = process.env.DB_NAME || 'greensteps';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created/verified`);

    // Select database
    await connection.query(`USE ${dbName}`);
    console.log(`Using database '${dbName}'`);

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('Database schema initialized successfully');

    // Seed waste types
    await connection.query(
      'INSERT IGNORE INTO waste_types (type_code, display_name, unit) VALUES (?, ?, ?)',
      ['PLASTIC', 'Plastic', 'kg']
    );
    await connection.query(
      'INSERT IGNORE INTO waste_types (type_code, display_name, unit) VALUES (?, ?, ?)',
      ['PAPER', 'Paper', 'kg']
    );
    await connection.query(
      'INSERT IGNORE INTO waste_types (type_code, display_name, unit) VALUES (?, ?, ?)',
      ['FOOD', 'Food Waste', 'kg']
    );
    await connection.query(
      'INSERT IGNORE INTO waste_types (type_code, display_name, unit) VALUES (?, ?, ?)',
      ['GLASS', 'Glass', 'kg']
    );

    console.log('Waste types seeded successfully');

    await connection.end();
    console.log('Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();
