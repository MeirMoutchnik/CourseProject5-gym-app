import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type AuthRequest = Request & {
    user?: { user_id: number };
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.toLowerCase().startsWith('bearer ')
        ? header.slice(7).trim()
        : header?.trim();

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { user_id: number };
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}