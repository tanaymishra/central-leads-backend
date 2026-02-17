
import { query } from '../src/config/db';

const updateLeadsTable = async () => {
    try {
        console.log('--- Updating Leads Table with New Fields ---');

        await query(`
            ALTER TABLE leads 
            ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS subject VARCHAR(255),
            ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]',
            ADD COLUMN IF NOT EXISTS word_count INTEGER
        `);

        console.log('✅ Leads table updated with new fields.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating leads table:', error);
        process.exit(1);
    }
};

updateLeadsTable();
