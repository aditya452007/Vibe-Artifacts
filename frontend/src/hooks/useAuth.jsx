import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       // Firebase user
    const [profile, setProfile] = useState(null); // Backend user profile
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                try {
                    const res = await api.get('/me');
                    setProfile(res.data);
                } catch {
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const logout = async () => {
        await signOut(auth);
        setProfile(null);
    };

    const refreshProfile = async () => {
        try {
            const res = await api.get('/me');
            setProfile(res.data);
        } catch {
            /* silent */
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
