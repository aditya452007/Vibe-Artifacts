import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Image as ImageIcon, Sun, Moon, LogOut } from 'lucide-react';
import './CardNav.css';

const CardNav = ({ theme, onThemeToggle }) => {
    const { user, profile, logout } = useAuth();
    const location = useLocation();
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const navRef = useRef(null);
    const cardsRef = useRef([]);
    const tlRef = useRef(null);
    const dropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isAdmin = profile?.tier === 'ultra' || profile?.tier === 'premium'; // example

    const items = [
        {
            label: 'Main',
            bgColor: 'var(--color-bg-card)',
            textColor: 'var(--color-text-primary)',
            links: [
                { label: 'Upload Image', href: '/upload', icon: '↗' },
                { label: 'My Gallery', href: '/images', icon: '↗' },
            ],
        },
        {
            label: 'Account',
            bgColor: 'var(--color-bg-card)',
            textColor: 'var(--color-text-primary)',
            links: [
                { label: 'Billing & Plan', href: '/billing', icon: '↗' },
                { label: 'Settings', href: '/settings', icon: '↗' },
            ],
        },
        {
            label: 'Links',
            bgColor: 'var(--color-primary)',
            textColor: 'var(--color-text-inverse)',
            links: [
                { label: 'Contact Support', href: '#', icon: '↗' },
                { label: 'Documentation', href: '#', icon: '↗' },
            ],
        }
    ];

    const calculateHeight = () => {
        const navEl = navRef.current;
        if (!navEl) return 260;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            const contentEl = navEl.querySelector('.card-nav-content');
            if (contentEl) {
                const wasVisible = contentEl.style.visibility;
                const wasPointerEvents = contentEl.style.pointerEvents;
                const wasPosition = contentEl.style.position;
                const wasHeight = contentEl.style.height;

                contentEl.style.visibility = 'visible';
                contentEl.style.pointerEvents = 'auto';
                contentEl.style.position = 'static';
                contentEl.style.height = 'auto';

                contentEl.offsetHeight;

                const topBar = 60;
                const padding = 16;
                const contentHeight = contentEl.scrollHeight;

                contentEl.style.visibility = wasVisible;
                contentEl.style.pointerEvents = wasPointerEvents;
                contentEl.style.position = wasPosition;
                contentEl.style.height = wasHeight;

                return topBar + contentHeight + padding;
            }
        }
        return 260;
    };

    const createTimeline = () => {
        const navEl = navRef.current;
        if (!navEl) return null;

        gsap.set(navEl, { height: 60, overflow: 'hidden' });
        gsap.set(cardsRef.current, { y: 50, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        tl.to(navEl, {
            height: calculateHeight,
            duration: 0.4,
            ease: 'power3.out'
        });

        tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08 }, '-=0.1');

        return tl;
    };

    useLayoutEffect(() => {
        const tl = createTimeline();
        tlRef.current = tl;

        return () => {
            tl?.kill();
            tlRef.current = null;
        };
    }, [items]);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (!tlRef.current) return;

            if (isExpanded) {
                const newHeight = calculateHeight();
                gsap.set(navRef.current, { height: newHeight });

                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) {
                    newTl.progress(1);
                    tlRef.current = newTl;
                }
            } else {
                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) {
                    tlRef.current = newTl;
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isExpanded]);

    useEffect(() => {
        if (isExpanded) toggleMenu();
        setDropdownOpen(false);
    }, [location]);

    const toggleMenu = () => {
        const tl = tlRef.current;
        if (!tl) return;
        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            tl.play(0);
        } else {
            setIsHamburgerOpen(false);
            tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
            tl.reverse();
        }
    };

    const setCardRef = (i) => (el) => {
        if (el) cardsRef.current[i] = el;
    };

    return (
        <div className={`card-nav-container`}>
            <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`}>
                <div className="card-nav-top">

                    <div className="card-nav-left">
                        <Link to="/" className="nav-logo" onClick={() => isExpanded && toggleMenu()}>
                            <ImageIcon size={24} style={{ marginRight: '8px', color: 'var(--color-primary)' }} />
                            <span>ImageTier</span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="card-nav-desktop-links hide-mobile">
                            {user ? (
                                <>
                                    <Link to="/upload" className="nav-direct-link">Upload</Link>
                                    <Link to="/images" className="nav-direct-link">Gallery</Link>
                                    <Link to="/billing" className="nav-direct-link">Billing</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/" className="nav-direct-link">Home</Link>
                                    <a href="/#features" className="nav-direct-link">Features</a>
                                    <a href="/#pricing" className="nav-direct-link">Pricing</a>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="card-nav-right">
                        {/* Theme Toggle */}
                        <button
                            className="nav-theme-toggle"
                            onClick={onThemeToggle}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <div className="nav-profile">
                                <button
                                    className="nav-avatar"
                                    onClick={() => setDropdownOpen(o => !o)}
                                    aria-label="Open profile menu"
                                >
                                    {profile?.email?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                                </button>
                                {dropdownOpen && (
                                    <div className="nav-dropdown" ref={dropdownRef}>
                                        <p className="nav-dropdown-email">{profile?.email || user.email}</p>
                                        {profile?.tier && <span className="nav-dropdown-tier">{profile.tier}</span>}
                                        <button onClick={logout} className="nav-dropdown-item logout-btn">
                                            <LogOut size={16} /> Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/signup" className="card-nav-cta-button hide-mobile">
                                Get Started
                            </Link>
                        )}

                        {/* Hamburger for the card menu */}
                        <div
                            className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
                            onClick={toggleMenu}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="hamburger-line" />
                            <div className="hamburger-line" />
                        </div>
                    </div>
                </div>

                <div className="card-nav-content" aria-hidden={!isExpanded}>
                    {(items || []).slice(0, 3).map((item, idx) => (
                        <div
                            key={`${item.label}-${idx}`}
                            className="nav-card"
                            ref={setCardRef(idx)}
                            style={{ backgroundColor: item.bgColor, color: item.textColor }}
                        >
                            <div className="nav-card-label">{item.label}</div>
                            <div className="nav-card-links">
                                {item.links?.map((lnk, i) => (
                                    <Link key={`${lnk.label}-${i}`} className="nav-card-link" to={lnk.href}>
                                        <span className="nav-card-link-icon">{lnk.icon}</span>
                                        {lnk.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default CardNav;
