import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export const ChromaGrid = ({
    items,
    className = '',
    radius = 300,
    columns = 3,
    rows = 2,
    damping = 0.45,
    fadeOut = 0.6,
    ease = 'power3.out'
}) => {
    const rootRef = useRef(null);
    const fadeRef = useRef(null);
    const setX = useRef(null);
    const setY = useRef(null);
    const pos = useRef({ x: 0, y: 0 });

    const data = items || [];

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        setX.current = gsap.quickSetter(el, '--x', 'px');
        setY.current = gsap.quickSetter(el, '--y', 'px');
        const { width, height } = el.getBoundingClientRect();
        pos.current = { x: width / 2, y: height / 2 };
        setX.current(pos.current.x);
        setY.current(pos.current.y);
    }, []);

    const moveTo = (x, y) => {
        gsap.to(pos.current, {
            x,
            y,
            duration: damping,
            ease,
            onUpdate: () => {
                setX.current?.(pos.current.x);
                setY.current?.(pos.current.y);
            },
            overwrite: true
        });
    };

    const handleMove = (e) => {
        const r = rootRef.current.getBoundingClientRect();
        moveTo(e.clientX - r.left, e.clientY - r.top);
        gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
    };

    const handleLeave = () => {
        gsap.to(fadeRef.current, {
            opacity: 1,
            duration: fadeOut,
            overwrite: true
        });
    };

    const handleCardClick = (e, url) => {
        // Prevent clicking if they clicked a button or list item inside
        if (e.target.closest('button') || e.target.tagName.toLowerCase() === 'a') return;

        if (url) {
            if (url.startsWith('http')) {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = url;
            }
        }
    };

    const handleCardMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            ref={rootRef}
            className={`chroma-grid ${className}`}
            style={
                {
                    '--r': `${radius}px`,
                    '--cols': columns,
                    '--rows': rows
                }
            }
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
        >
            {data.map((c, i) => (
                <article
                    key={i}
                    className={`chroma-card ${c.borderColor === 'var(--color-primary)' ? 'chroma-card-popular' : ''}`}
                    onMouseMove={handleCardMove}
                    style={
                        {
                            '--card-border': c.borderColor || 'transparent',
                            '--card-gradient': c.gradient,
                        }
                    }
                >
                    {c.image && (
                        <div className="chroma-img-wrapper">
                            <img src={c.image} alt={c.title} loading="lazy" />
                        </div>
                    )}
                    {c.icon && (
                        <div className="chroma-icon-wrapper">
                            <span className="chroma-icon">{c.icon}</span>
                        </div>
                    )}
                    <div className="chroma-info">
                        <h3 className="name">{c.title}</h3>
                        {c.handle && <div className="chroma-price">
                            <span className="amount">{c.handle.replace('/mo', '').replace('forever', '')}</span>
                            <span className="period">{c.handle.includes('/mo') ? '/mo' : ''}</span>
                        </div>}
                        <p className="role">{c.subtitle}</p>

                        {/* Rendering Features List if provided */}
                        {c.features && (
                            <ul className="chroma-features-list">
                                {c.features.map((feat, fidx) => (
                                    <li key={fidx} className="chroma-feature-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {c.url && (
                            <a href={c.url} className={`btn ${c.borderColor === 'var(--color-primary)' ? 'btn-primary' : 'btn-outline'} chroma-cta-btn`} style={{ width: '100%', marginTop: '1rem', zIndex: 10, position: 'relative' }}>
                                {c.cta || 'Get Started'}
                            </a>
                        )}
                    </div>
                </article>
            ))}
            <div className="chroma-overlay" />
            <div ref={fadeRef} className="chroma-fade" />
        </div>
    );
};

export default ChromaGrid;
