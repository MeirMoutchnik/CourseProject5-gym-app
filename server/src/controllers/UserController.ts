import { Request, Response } from 'express';
import sql from '../db';
import { User } from '../types/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
    try {
        const user = req.body as User;
        const hashedPassword = await bcrypt.hash(user.user_password, 10);
        const result = await sql`INSERT INTO users1 (user_name, user_email, user_password, user_role) VALUES (${user.user_name}, ${user.user_email}, ${hashedPassword}, ${user.user_role}) RETURNING *`;
        res.status(201).json(result[0] as User);
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const user_email = req.body.user_email ?? req.body.email;
        const user_password = req.body.user_password ?? req.body.password;

        if (!user_email || !user_password) {
            return res.status(400).json({ message: 'email and password are required' });
        }

        const result = await sql`SELECT * FROM users1 WHERE user_email = ${user_email}`;
        const user = result[0] as User | undefined;
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

        res.status(200).json({ user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in user' });
    }
}