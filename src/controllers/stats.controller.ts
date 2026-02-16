
import { Response } from 'express';
import { query } from '../config/db';
import { AuthRequest } from '../types';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        // 1. Total Leads
        const totalLeadsRes = await query('SELECT COUNT(*) FROM leads');
        const totalLeads = parseInt(totalLeadsRes.rows[0].count);

        // 2. Leads in last 24h
        const newLeadsRes = await query('SELECT COUNT(*) FROM leads WHERE created_at > NOW() - INTERVAL \'24 hours\'');
        const newLeads = parseInt(newLeadsRes.rows[0].count);

        // 3. New Leads status count
        const statusNewRes = await query('SELECT COUNT(*) FROM leads WHERE status = \'new\'');
        const statusNew = parseInt(statusNewRes.rows[0].count);

        // 4. Total Domains
        const totalDomainsRes = await query('SELECT COUNT(*) FROM domains');
        const totalDomains = parseInt(totalDomainsRes.rows[0].count);

        res.status(200).json({
            status: 'success',
            data: {
                totalLeads,
                newLeads24h: newLeads,
                pendingLeads: statusNew,
                totalDomains
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch dashboard stats' });
    }
};
