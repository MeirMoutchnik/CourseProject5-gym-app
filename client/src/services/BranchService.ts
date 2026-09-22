import type { Branch } from '../types/Branch';

const API_URL = 'http://localhost:3000/branches';

export const getBranches = async (): Promise<Branch[]> => {
    const response = await fetch(`${API_URL}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.json();
}

export const getBranch = async (branch_code: string): Promise<Branch> => {
    const response = await fetch(`${API_URL}/${branch_code}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.json();
}
