import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './QuotaIndicator.css';

export default function QuotaIndicator({ used, max }) {
    const barFillRef = useRef(null);
    const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
    const color = pct >= 100
        ? 'var(--color-error)'
        : pct >= 80
            ? 'var(--color-warning)'
            : 'var(--color-primary)';

    useEffect(() => {
        if (barFillRef.current) {
            gsap.to(barFillRef.current, {
                width: `${pct}%`,
                duration: 0.4,
                ease: 'power2.out',
            });
        }
    }, [pct]);

    return (
        <div className="quota" id="quota-indicator">
            <div className="quota__bar-track" title={`${Math.round(pct)}% — ${used}/${max} images`}>
                <div
                    ref={barFillRef}
                    className="quota__bar-fill"
                    style={{ background: color, width: 0 }}
                />
            </div>
            <p className="quota__label">
                <span style={{ color }}>{used}</span> / {max} images
                {pct >= 100 && <span className="quota__full-badge"> — Quota full</span>}
                {pct >= 80 && pct < 100 && <span className="quota__warning-badge"> — Almost full</span>}
            </p>
        </div>
    );
}
