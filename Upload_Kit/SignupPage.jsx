import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import './AuthPage.css';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Ensure token is ready before calling backend
            const token = await user.getIdToken(true);
            await api.get('/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Account created! Welcome to ImageTier 🎉');
            navigate('/dashboard');
        } catch (err) {
            gsap.fromTo(
                formRef.current,
                { x: -8 },
                { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)', repeat: 2, yoyo: true }
            );
            const messages = {
                'auth/email-already-in-use': 'Email is already registered',
                'auth/invalid-email': 'Invalid email address',
                'auth/weak-password': 'Password too weak (min 6 chars)',
            };
            toast.error(messages[err.code] || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card card" ref={formRef}>
                <div className="auth-header">
                    <span className="auth-logo">🖼️</span>
                    <h1 className="auth-title">Create account</h1>
                    <p className="auth-subtitle">Get started with ImageTier for free</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="signup-email">Email</label>
                        <input
                            id="signup-email"
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
                        <label htmlFor="signup-password">Password</label>
                        <input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            required
                            className="form-input"
                        />
                    </div>
                    <button
                        type="submit"
                        id="signup-submit"
                        className="btn btn-primary auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login" id="auth-login-link">Sign in →</Link>
                </p>
            </div>
        </div>
    );
}
