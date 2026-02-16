
import { query } from '../src/config/db';

const updateDb = async () => {
    try {
        console.log('--- Updating Database for Blog Management ---');

        // 1. Create Domains Table (Websites)
        await query(`
      CREATE TABLE IF NOT EXISTS domains (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(255) UNIQUE NOT NULL,
        api_key VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Domains table created.');

        // 2. Create Blogs Table
        await query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        featured_image VARCHAR(255),
        domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
        author_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'draft', -- draft, published, scheduled
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Blogs table created.');

        // 3. Seed some initial domains
        const initialDomains = [
            { name: 'BluePen Assets', url: 'https://bluepen.co.in' },
            { name: 'CL Portfolio', url: 'https://portfolio.centralleads.com' }
        ];

        for (const d of initialDomains) {
            const exists = await query('SELECT id FROM domains WHERE url = $1', [d.url]);
            if (exists.rows.length === 0) {
                await query('INSERT INTO domains (name, url) VALUES ($1, $2)', [d.name, d.url]);
                console.log(`✅ Domain added: ${d.name}`);
            }
        }

        console.log('--- Database Update Completed ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating database:', error);
        process.exit(1);
    }
};

updateDb();
