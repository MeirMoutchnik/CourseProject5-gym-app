import { useEffect, useState } from 'react';
import type { Lesson } from '../types/Lesson';
import type { Branch } from '../types/Branch';
import { getBranches } from '../services/BranchService';
import { createLesson } from '../services/LessonService';
import { useNavigate } from 'react-router-dom';

function toDateTimeLocal(value: Date | string) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AddLesson() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [lesson, setLesson] = useState<Lesson>({
        lesson_code: 0,
        branch_code: 0,
        lesson_name: '',
        lesson_start: new Date(),
        lesson_end: new Date(Date.now() + 60 * 60 * 1000),
        instructor: '',
        max_participants: 0
    });

    useEffect(() => {
        async function loadBranches() {
            try {
                setError(null);
                const data = await getBranches();
                if (!Array.isArray(data)) {
                    setError('Branches not found');
                    return;
                }
                setBranches(data);
            } catch (error) {
                setError('Branches not found: ' + error);
            }
        }
        loadBranches();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setError(null);
            setSuccess(null);
            const start = new Date(lesson.lesson_start);
            const end = new Date(lesson.lesson_end);
            if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
                setError('Lesson start must be before lesson end');
                return;
            }
            if (!lesson.lesson_code) {
                setError('Lesson code is required');
                return;
            }
            if (!lesson.branch_code) {
                setError('Select a branch');
                return;
            }
            const response = await createLesson(lesson) as Lesson & { error?: string; message?: string };
            if (!response.lesson_code) {
                setError('Lesson not created: ' + (response.error ?? response.message));
                return;
            }
            setSuccess('Lesson created successfully');
            navigate('/lessons');
        } catch (error) {
            setError('Lesson not created: ' + error);
        }
    }

    return (
        <div className="page">
            <h1>Add Lesson</h1>
            <form onSubmit={handleSubmit}>
                <select value={lesson.branch_code || ''} onChange={(e) => setLesson({ ...lesson, branch_code: parseInt(e.target.value) || 0 })}>
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                        <option key={branch.branch_code} value={branch.branch_code}>{branch.branch_name}</option>
                    ))}
                </select>
                <input type="number" placeholder="Lesson Code" value={lesson.lesson_code || ''} onChange={(e) => setLesson({ ...lesson, lesson_code: parseInt(e.target.value) || 0 })} />
                <input type="text" placeholder="Lesson Name" value={lesson.lesson_name} onChange={(e) => setLesson({ ...lesson, lesson_name: e.target.value })} />
                <input type="datetime-local" value={toDateTimeLocal(lesson.lesson_start)} onChange={(e) => setLesson({ ...lesson, lesson_start: new Date(e.target.value) })} />
                <input type="datetime-local" value={toDateTimeLocal(lesson.lesson_end)} onChange={(e) => setLesson({ ...lesson, lesson_end: new Date(e.target.value) })} />
                <input type="text" placeholder="Instructor" value={lesson.instructor} onChange={(e) => setLesson({ ...lesson, instructor: e.target.value })} />
                <input type="number" placeholder="Max Participants" value={lesson.max_participants || ''} onChange={(e) => setLesson({ ...lesson, max_participants: parseInt(e.target.value) || 0 })} />
                <button type="submit">Add Lesson</button>
            </form>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    )
}
