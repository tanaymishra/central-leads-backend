
import bcrypt from 'bcrypt';
import { query } from '../src/config/db';

const setupDb = async () => {
    try {
        console.log('--- Starting Database Setup ---');

        // 1. Create Users Table
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'ADMIN',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Users table created or already exists.');

        // 2. Create Admin User
        const adminEmail = 'kaushik@bluepen.co.in';
        const adminPassword = 'admin123';

        // Check if admin exists
        const existingAdmin = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);

        if (existingAdmin.rows.length === 0) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await query(
                'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
                [adminEmail, hashedPassword, 'Kaushik', 'ADMIN']
            );
            console.log(`✅ Admin user created: ${adminEmail}`);
        } else {
            console.log('ℹ️ Admin user already exists. Skipping insertion.');
        }

        console.log('--- Database Setup Completed ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    }
};

setupDb();
