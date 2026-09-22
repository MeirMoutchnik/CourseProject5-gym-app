import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Lesson } from '../types/Lesson';
import type { Branch } from '../types/Branch';
import { getBranches } from '../services/BranchService';
import { getLessons, deleteLesson } from '../services/LessonService';

function formatLessonDate(value: Date | string) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return String(value);
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatLessonDuration(start: Date | string, end: Date | string) {
    const startDate = start instanceof Date ? start : new Date(start);
    const endDate = end instanceof Date ? end : new Date(end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return '';
    }
    const totalMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
    if (totalMinutes < 0) {
        return '';
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) {
        return `${minutes} min`;
    }
    if (minutes === 0) {
        return `${hours} h`;
    }
    return `${hours} h ${minutes} min`;
}

function isUpcomingLesson(start: Date | string) {
    const date = start instanceof Date ? start : new Date(start);
    if (Number.isNaN(date.getTime())) {
        return false;
    }
    return date.getTime() >= Date.now();
}

export default function Lessons() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const branch_code = searchParams.get('branch_code') ?? '';
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadBranches() {
            try {
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

    useEffect(() => {
        async function loadLessons() {
            try {
                setError(null);
                if (!branch_code) {
                    setLessons([]);
                    return;
                }
                setLoading(true);
                const data = await getLessons(branch_code);
                if (!Array.isArray(data)) {
                    setError('Lessons not found');
                    setLessons([]);
                    return;
                }
                setLessons(data);
            } catch (error) {
                setError('Lessons not found: ' + error);
                setLessons([]);
            } finally {
                setLoading(false);
            }
        }
        loadLessons();
    }, [branch_code]);

    async function handleDelete(lesson_code: string) {
        try {
            setError(null);
            setSuccess(null);
            await deleteLesson(branch_code, lesson_code);
            setLessons(lessons.filter((lesson) => String(lesson.lesson_code) !== String(lesson_code)));
            setSuccess('Lesson deleted');
        } catch (error) {
            setError('Lesson not deleted: ' + error);
        }
    }

    return (
        <div className="page page-wide">
            <h1>Lessons</h1>
            <select
                value={branch_code}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value) {
                        setSearchParams({ branch_code: value });
                    } else {
                        setSearchParams({});
                    }
                }}
            >
                <option value="">Select a branch</option>
                {branches.map((branch) => (
                    <option key={String(branch.branch_code)} value={String(branch.branch_code)}>
                        {branch.branch_name}
                    </option>
                ))}
            </select>
            {!branch_code && <p>Select a branch to see its lessons.</p>}
            {branch_code && loading && <p>Loading lessons...</p>}
            {branch_code && !loading && lessons.length === 0 && !error && <p>No lessons for this branch.</p>}
            {branch_code && !loading && lessons.length > 0 && (
            <table>
                <thead>
                    <tr>
                        <th>Lesson Code</th>
                        <th>Lesson Name</th>
                        <th>Lesson Start</th>
                        <th>Lesson End</th>
                        <th>Lesson Duration</th>
                        <th>Instructor</th>
                        <th>Max Participants</th>
                        <th className="actions-heading" colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map((lesson) => (
                        <tr
                            key={String(lesson.lesson_code)}
                            className={isUpcomingLesson(lesson.lesson_start) ? 'lesson-upcoming' : 'lesson-past'}
                        >
                            <td>{lesson.lesson_code}</td>
                            <td>{lesson.lesson_name}</td>
                            <td>{formatLessonDate(lesson.lesson_start)}</td>
                            <td>{formatLessonDate(lesson.lesson_end)}</td>
                            <td>{formatLessonDuration(lesson.lesson_start, lesson.lesson_end)}</td>
                            <td>{lesson.instructor}</td>
                            <td>{lesson.max_participants}</td>
                            <td className="action-cell">
                                <button type="button" onClick={() => navigate(`/update-lesson/${branch_code}/${lesson.lesson_code}`)}>Update</button>
                            </td>
                            <td className="action-cell">
                                <button type="button" onClick={() => handleDelete(String(lesson.lesson_code))}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    )
}
