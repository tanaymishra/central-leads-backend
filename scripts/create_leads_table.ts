
import { query } from '../src/config/db';

const createLeadsTable = async () => {
    try {
        console.log('--- Creating Leads Table ---');

        await query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255),
        phone VARCHAR(50),
        message TEXT,
        source VARCHAR(255), -- e.g. "contact_form", "newsletter"
        status VARCHAR(50) DEFAULT 'new', -- e.g. "new", "contacted", "qualified", "closed"
        metadata JSONB DEFAULT '{}', -- Store extra fields from different websites
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('✅ Leads table created.');

        // Add some sample lead data
        const sampleLeadsResult = await query('SELECT id FROM leads LIMIT 1');
        if (sampleLeadsResult.rows.length === 0) {
            const domainResult = await query('SELECT id FROM domains LIMIT 1');
            if (domainResult.rows.length > 0) {
                const domainId = domainResult.rows[0].id;
                await query(`
          INSERT INTO leads (domain_id, first_name, last_name, email, phone, message, source)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [domainId, 'John', 'Doe', 'john@example.com', '1234567890', 'Interested in your services.', 'website_form']);
                console.log('✅ Seeded a sample lead.');
            }
        }

        console.log('--- Done ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createLeadsTable();
