import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Lesson } from '../types/Lesson';
import { getLesson, updateLesson } from '../services/LessonService';

function toDateTimeLocal(value: Date | string) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function UpdateLesson() {
    const navigate = useNavigate();
    const { branch_code, lesson_code } = useParams();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [lesson, setLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        async function loadLesson() {
            if (!branch_code || !lesson_code) {
                setError('Lesson not found');
                return;
            }
            try {
                const data = await getLesson(branch_code, lesson_code);
                if (!data?.lesson_code) {
                    setError('Lesson not found');
                    return;
                }
                setLesson({
                    ...data,
                    branch_code: Number(data.branch_code ?? branch_code),
                    lesson_code: Number(data.lesson_code),
                    lesson_start: new Date(data.lesson_start),
                    lesson_end: new Date(data.lesson_end),
                });
            } catch (error) {
                setError('Lesson not found: ' + error);
            }
        }
        loadLesson();
    }, [branch_code, lesson_code]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!lesson || !branch_code || !lesson_code) {
            return;
        }
        try {
            setError(null);
            setSuccess(null);
            const start = new Date(lesson.lesson_start);
            const end = new Date(lesson.lesson_end);
            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
                setError('Lesson start must be before lesson end');
                return;
            }
            const response = await updateLesson(branch_code, lesson_code, lesson) as Lesson & { message?: string };
            if (!response?.lesson_code) {
                setError(response.message ?? 'Lesson not updated. Log in first.');
                return;
            }
            setSuccess('Lesson updated successfully');
            navigate(`/lessons?branch_code=${branch_code}`);
        } catch (error) {
            setError('Lesson not updated: ' + error);
        }
    }

    if (!lesson) {
        return (
            <div className="page">
                <h1>Update Lesson</h1>
                {error && <p>{error}</p>}
            </div>
        );
    }

    return (
        <div className="page">
            <h1>Update Lesson</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Lesson Name" value={lesson.lesson_name} onChange={(e) => setLesson({ ...lesson, lesson_name: e.target.value })} />
                <input type="datetime-local" value={toDateTimeLocal(lesson.lesson_start)} onChange={(e) => setLesson({ ...lesson, lesson_start: new Date(e.target.value) })} />
                <input type="datetime-local" value={toDateTimeLocal(lesson.lesson_end)} onChange={(e) => setLesson({ ...lesson, lesson_end: new Date(e.target.value) })} />
                <input type="text" placeholder="Instructor" value={lesson.instructor} onChange={(e) => setLesson({ ...lesson, instructor: e.target.value })} />
                <input type="number" placeholder="Max Participants" value={lesson.max_participants} onChange={(e) => setLesson({ ...lesson, max_participants: parseInt(e.target.value) || 0 })} />
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate(`/lessons?branch_code=${branch_code}`)}>Cancel</button>
            </form>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    );
}
