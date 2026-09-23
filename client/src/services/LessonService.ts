import type { Lesson } from '../types/Lesson';

const API_URL = 'http://localhost:3001/lessons';

export const getLessons = async (branch_code: string): Promise<Lesson[]> => {
    const response = await fetch(`${API_URL}/${branch_code}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export const getLesson = async (branch_code: string, lesson_code: string): Promise<Lesson> => {
    const response = await fetch(`${API_URL}/${branch_code}/${lesson_code}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export const createLesson = async (lesson: Lesson): Promise<Lesson> => {
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(lesson),
    });
    return response.json();
}

export const updateLesson = async (branch_code: string, lesson_code: string, lesson: Lesson): Promise<Lesson> => {
    const response = await fetch(`${API_URL}/${branch_code}/${lesson_code}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(lesson),
    });
    return response.json();
}

export const deleteLesson = async (branch_code: string, lesson_code: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${branch_code}/${lesson_code}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.json();
}
