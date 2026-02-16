
import { Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../types';

export const getLeads = async (req: AuthRequest, res: Response) => {
    try {
        const result = await query(`
      SELECT l.*, d.name as domain_name 
      FROM leads l 
      LEFT JOIN domains d ON l.domain_id = d.id 
      ORDER BY l.created_at DESC
    `);
        res.status(200).json({ status: 'success', data: result.rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch leads' });
    }
};

/**
 * Updative Lead Capture
 * logic: If a lead from the same domain with same email/phone exists within the last 30 mins, update it.
 * Otherwise, create a new one.
 */
export const createOrUpdateLead = async (req: AuthRequest, res: Response) => {
    try {
        const { domain_id, first_name, last_name, email, phone, message, source, metadata } = req.body;

        if (!domain_id) {
            return res.status(400).json({ status: 'error', message: 'Domain ID is required' });
        }

        // 1. Try to find a recent duplicate (within 30 mins) from the same domain
        // We check either email or phone if provided
        let existingLead = null;

        if (email || phone) {
            const searchQuery = `
        SELECT id FROM leads 
        WHERE domain_id = $1 
        AND (
          ($2::varchar IS NOT NULL AND email = $2) OR 
          ($3::varchar IS NOT NULL AND phone = $3)
        )
        AND updated_at > NOW() - INTERVAL '30 minutes'
        ORDER BY updated_at DESC LIMIT 1
      `;
            const searchResult = await query(searchQuery, [domain_id, email || null, phone || null]);
            existingLead = searchResult.rows[0];
        }

        if (existingLead) {
            // 2. Update existing lead
            // We only update fields that are provided in the request
            const updateFields: string[] = [];
            const values: any[] = [];
            let i = 1;

            if (first_name !== undefined) { updateFields.push(`first_name = $${i++}`); values.push(first_name); }
            if (last_name !== undefined) { updateFields.push(`last_name = $${i++}`); values.push(last_name); }
            if (email !== undefined) { updateFields.push(`email = $${i++}`); values.push(email); }
            if (phone !== undefined) { updateFields.push(`phone = $${i++}`); values.push(phone); }
            if (message !== undefined) { updateFields.push(`message = $${i++}`); values.push(message); }
            if (source !== undefined) { updateFields.push(`source = $${i++}`); values.push(source); }
            if (metadata !== undefined) { updateFields.push(`metadata = metadata || $${i++}`); values.push(JSON.stringify(metadata)); }

            updateFields.push(`updated_at = NOW()`);

            values.push(existingLead.id);
            const updateQuery = `
        UPDATE leads SET ${updateFields.join(', ')} 
        WHERE id = $${i} RETURNING *
      `;

            const result = await query(updateQuery, values);
            return res.status(200).json({ status: 'success', data: result.rows[0], updated: true });
        } else {
            // 3. Create new lead
            const result = await query(
                `INSERT INTO leads (domain_id, first_name, last_name, email, phone, message, source, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [domain_id, first_name, last_name, email, phone, message, source, metadata || {}]
            );
            res.status(201).json({ status: 'success', data: result.rows[0], updated: false });
        }
    } catch (error) {
        console.error('Lead process error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to process lead' });
    }
};
