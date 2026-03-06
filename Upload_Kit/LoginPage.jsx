import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import './AuthPage.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Sync with backend on login in case signup sync failed
            const token = await user.getIdToken(true);
            await api.get('/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success('Welcome back! 👋');
            navigate('/dashboard');
        } catch (err) {
            // Error shake animation
            gsap.fromTo(
                formRef.current,
                { x: -8 },
                { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)', repeat: 2, yoyo: true }
            );
            toast.error(err.code === 'auth/invalid-credential'
                ? 'Invalid email or password'
                : 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card" ref={formRef}>
                <div className="auth-header">
                    <span className="auth-logo">🖼️</span>
                    <h1 className="auth-title">Welcome back</h1>
                    <p className="auth-subtitle">Sign in to your ImageTier account</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            autoFocus
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="form-input"
                        />
                    </div>
                    <button
                        type="submit"
                        id="login-submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
                <p className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/signup" id="auth-signup-link">Create one →</Link>
                </p>
            </div>
        </div>
    );
}
