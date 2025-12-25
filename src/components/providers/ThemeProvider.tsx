'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Default to dark mode as requested
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check local storage or system preference if needed, but user said "By default Let it set to the dark mode"
        // So we initialize explicitly to dark unless saved.
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light'); // Just in case
        } else {
            root.classList.remove('dark');
            root.classList.add('light'); // Optional, mainly for tailwind 'dark:' which works on absence of class typically, but Presence is checking 'class' strategy
        }
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    // Prevent hydration mismatch by not rendering until mounted
    // We MUST provide the context even if not mounted, because children like ThemeToggle use it immediately.
    // The mounted check is only for the useEffect to sync with DOM/Storage.

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {/* To prevent hydration mismatch on icon, we could delay children, but here we just render them. 
                 Any mismatch on the icon will be fixed by React's second pass or suppressHydrationWarning. 
                 Since we default to 'dark' which matches the server, the mismatch only happens if user has 'light' stored.
                 For now, we render children immediately to avoid the 'useContext' error. */}
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
