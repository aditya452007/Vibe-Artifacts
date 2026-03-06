import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import gsap from 'gsap';
import './Navigation.css';

export default function Navigation({ theme, onThemeToggle }) {
    const { user, profile, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        gsap.from(navRef.current, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.out' });
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => { setMenuOpen(false); }, [location]);

    const tierColors = { free: '#6A7CA0', premium: '#D9534F', ultra: '#DAA520' };

    return (
        <nav ref={navRef} className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
            <div className="container nav__inner">
                <Link to="/" className="nav__logo" id="nav-logo">
                    <span className="nav__logo-icon">🖼️</span>
                    <span>ImageTier</span>
                </Link>

                {/* Desktop links */}
                <div className="nav__links" id="nav-desktop-links">
                    {user ? (
                        <>
                            <Link to="/upload" className={location.pathname === '/upload' ? 'nav__link nav__link--active' : 'nav__link'} id="nav-upload">Upload</Link>
                            <Link to="/images" className={location.pathname === '/images' ? 'nav__link nav__link--active' : 'nav__link'} id="nav-images">Gallery</Link>
                            <Link to="/billing" className={location.pathname === '/billing' ? 'nav__link nav__link--active' : 'nav__link'} id="nav-billing">Billing</Link>
                            <Link to="/settings" className={location.pathname === '/settings' ? 'nav__link nav__link--active' : 'nav__link'} id="nav-settings">Settings</Link>

                            <div className="nav__profile" id="nav-profile">
                                <button
                                    className="nav__avatar"
                                    onClick={() => setDropdownOpen(o => !o)}
                                    aria-label="Open profile menu"
                                    id="nav-avatar-btn"
                                >
                                    {profile?.email?.[0]?.toUpperCase() || '?'}
                                    {profile?.tier && (
                                        <span className="nav__tier-badge" style={{ background: tierColors[profile.tier] }}>
                                            {profile.tier}
                                        </span>
                                    )}
                                </button>
                                {dropdownOpen && (
                                    <div className="nav__dropdown" id="nav-dropdown">
                                        <p className="nav__dropdown-email">{profile?.email || user.email}</p>
                                        <button onClick={logout} id="nav-logout-btn" className="nav__dropdown-item nav__dropdown-item--logout">Sign out</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav__link" id="nav-login">Login</Link>
                            <Link to="/signup" className="btn btn-primary" id="nav-signup">Get Started</Link>
                        </>
                    )}
                    <button
                        className="nav__theme-toggle"
                        onClick={onThemeToggle}
                        aria-label="Toggle theme"
                        id="nav-theme-toggle"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    className="nav__hamburger"
                    onClick={() => setMenuOpen(o => !o)}
                    aria-label="Toggle navigation menu"
                    id="nav-hamburger"
                >
                    <span /><span /><span />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="nav__mobile-menu" id="nav-mobile-menu">
                    {user ? (
                        <>
                            <Link to="/upload" className="nav__mobile-link" id="nav-mobile-upload">Upload</Link>
                            <Link to="/images" className="nav__mobile-link" id="nav-mobile-images">Gallery</Link>
                            <Link to="/billing" className="nav__mobile-link" id="nav-mobile-billing">Billing</Link>
                            <Link to="/settings" className="nav__mobile-link" id="nav-mobile-settings">Settings</Link>
                            <button onClick={logout} id="nav-mobile-logout" className="nav__mobile-link nav__mobile-logout">Sign out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav__mobile-link" id="nav-mobile-login">Login</Link>
                            <Link to="/signup" className="nav__mobile-link" id="nav-mobile-signup">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
