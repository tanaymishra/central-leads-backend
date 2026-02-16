
import { query } from '../src/config/db';

const addDomains = async () => {
    try {
        console.log('--- Adding Specified Domains ---');

        const domainsToAdd = [
            { name: 'Assignments Now', url: 'https://assignmentsnow.org' },
            { name: 'Best Assignment', url: 'https://best-assignment.com' },
            { name: 'Ease My Paper', url: 'https://easemypaper.com' },
            { name: 'Essay King', url: 'https://essay-king.com' }
        ];

        for (const d of domainsToAdd) {
            // Check if exists
            const exists = await query('SELECT id FROM domains WHERE url = $1', [d.url]);

            if (exists.rows.length === 0) {
                await query('INSERT INTO domains (name, url) VALUES ($1, $2)', [d.name, d.url]);
                console.log(`✅ Added: ${d.name} (${d.url})`);
            } else {
                console.log(`ℹ️ Already exists: ${d.name}`);
            }
        }

        console.log('--- Done ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

addDomains();
