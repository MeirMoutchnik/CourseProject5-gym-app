import { Request, Response } from 'express';
import { Branch } from '../types/Branch';
import sql from '../db';

export const getBranches = async (req: Request, res: Response) => {
    try {
        const branches = await sql`SELECT * FROM gyms`;
        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching branches' });
    }
}