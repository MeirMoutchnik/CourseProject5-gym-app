import type { User } from '../types/User';
import { API_BASE } from './apiBase';

const API_URL = `${API_BASE}/users`;

export const registerUser = async (user: User) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    return response.json();
}

export const loginUser = async (user: User) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    return response.json();
}

export const logoutUser = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
}