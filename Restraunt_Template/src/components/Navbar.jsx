import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Share2, Sun, Moon } from 'lucide-react';
import { restaurantData } from '../data/restaurantData';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ease-in-out border-b
            ${scrolled
                    ? 'py-2 bg-white/80 dark:bg-black/80 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50 shadow-sm'
                    : 'py-6 bg-transparent border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

                {/* Logo / Name */}
                <div
                    className="flex-shrink-0 flex items-center"
                >
                    {restaurantData.logo ? (
                        <img
                            src={restaurantData.logo}
                            alt={restaurantData.name}
                            className={`h-12 w-auto transition-filter duration-300 ${scrolled ? '' : 'brightness-0 invert'}`}
                        />
                    ) : (
                        <div
                            className={`text-2xl lg:text-3xl font-serif font-bold tracking-tight transition-colors duration-300
                           ${scrolled ? 'text-gray-900 dark:text-gray-100' : 'text-white'}`}
                        >
                            {restaurantData.name}
                        </div>
                    )}
                </div>

                {/* Center Text (Desktop) */}
                <div
                    className={`hidden lg:block font-medium tracking-widest text-sm uppercase transition-colors duration-300
                  ${scrolled ? 'text-red-600 dark:text-red-400' : 'text-white/90'}`}
                >
                    {restaurantData.theme.badge}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full transition-colors duration-300 focus:outline-none
                        ${scrolled
                                ? 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                : 'text-white hover:bg-white/10'
                            }`}
                        aria-label="Toggle Theme"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <a
                        href={restaurantData.zomatoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`hidden md:flex px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
                        ${scrolled
                                ? 'bg-red-600 text-white hover:bg-red-700 shadow-md dark:shadow-none'
                                : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                            }`}
                    >
                        Order Online
                    </a>

                    <a
                        href={restaurantData.socialMedia.whatsapp || `https://wa.me/${restaurantData.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-2 rounded-full transition-colors duration-300
                        ${scrolled
                                ? 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                                : 'text-white hover:text-green-400 hover:bg-white/10'
                            }`}
                        aria-label="WhatsApp"
                    >
                        <Share2 className="w-5 h-5" />
                    </a>

                    <a
                        href={restaurantData.address.mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-2 rounded-full transition-colors duration-300
                        ${scrolled
                                ? 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                : 'text-white hover:text-blue-400 hover:bg-white/10'
                            }`}
                        aria-label="Location"
                    >
                        <MapPin className="w-5 h-5" />
                    </a>
                </div>

            </div>
        </nav>
    );
}
