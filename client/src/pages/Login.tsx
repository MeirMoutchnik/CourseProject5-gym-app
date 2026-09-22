import { useState } from 'react';
import { loginUser } from '../services/UserService';
import type { User } from '../types/User';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [user, setUser] = useState<User>({
        user_id: 0,
        user_name: '',
        user_email: '',
        user_password: '',
        user_role: '',
    });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setError(null);
            setSuccess(null);
            const response = await loginUser(user);
            if (!response.token) {
                setError(response.message ?? response.error ?? 'Login failed');
                return;
            }
            setSuccess('Login successful');
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('role', response.user.user_role);
            window.dispatchEvent(new Event('auth-changed'));
            navigate('/');
        } catch (error) {
            setError('Login failed: ' + error);
        }
    }

    return (
        <div className="page">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={user.user_email} onChange={(e) => setUser({ ...user, user_email: e.target.value })} />
                <input type="password" placeholder="Password" value={user.user_password} onChange={(e) => setUser({ ...user, user_password: e.target.value })} />
                <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    )
}