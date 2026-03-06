import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { motion } from "motion/react";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import './FeaturesBento.css';

export function FeaturesBento() {
    const features = [
        {
            title: "Track issues effectively",
            description: "Manage your image uploads and quota with our intuitive dashboard.",
            skeleton: <SkeletonOne />,
            className: "bento-col-span-1 lg-bento-col-span-4 bento-border-b lg-bento-border-r",
        },
        {
            title: "Deliver universally",
            description: "Blazing fast global CDN via ImageKit for instantaneous loading.",
            skeleton: <SkeletonTwo />,
            className: "bento-col-span-1 lg-bento-col-span-2 bento-border-b",
        },
        {
            title: "Learn more",
            description: "Discover how to optimize your workflow with ImageTier on YouTube.",
            skeleton: <SkeletonThree />,
            className: "bento-col-span-1 lg-bento-col-span-3 lg-bento-border-r",
        },
        {
            title: "Deploy globally",
            description: "With our blazing fast CDN points, your images are everywhere in seconds.",
            skeleton: <SkeletonFour />,
            className: "bento-col-span-1 lg-bento-col-span-3",
        },
    ];

    return (
        <div className="features-bento-container">
            <div className="features-bento-header">
                <h2 className="features-bento-title">Packed with premium features</h2>
                <p className="features-bento-subtitle">
                    From fast uploads to secure JWT tokens, ImageTier has everything you need to manage
                    images at scale with a stunning 2026 UI.
                </p>
            </div>

            <div className="features-bento-grid-wrapper">
                <div className="features-bento-grid">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} className={feature.className}>
                            <FeatureTitle>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                            <div className="bento-skeleton-wrapper">{feature.skeleton}</div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

const FeatureCard = ({ children, className }) => {
    return (
        <div className={`bento-feature-card ${className || ''}`}>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children }) => {
    return <h3 className="bento-feature-title">{children}</h3>;
};

const FeatureDescription = ({ children }) => {
    return <p className="bento-feature-description">{children}</p>;
};

export const SkeletonOne = () => {
    return (
        <div className="bento-skeleton-one">
            <div className="bento-skeleton-one-inner">
                <div className="bento-img-placeholder">
                    {/* Fallback pattern or placeholder image */}
                    <div className="mock-dashboard">
                        <div className="mock-nav"></div>
                        <div className="mock-content"></div>
                        <div className="mock-content"></div>
                    </div>
                </div>
            </div>
            <div className="bento-gradient-bottom" />
            <div className="bento-gradient-top" />
        </div>
    );
};

export const SkeletonThree = () => {
    return (
        <div className="bento-skeleton-three" style={{ cursor: 'default' }}>
            <div className="bento-skeleton-three-inner" style={{ padding: '1.5rem', background: 'var(--color-bg-page)', height: '100%', border: '1px solid var(--color-glass-border)', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-md)', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}></div>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}></div>
                    <span style={{ marginLeft: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>api.imagetier.dev</span>
                </div>
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
                    <pre style={{ margin: 0, padding: 0, fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, overflowX: 'auto' }}>
                        <code style={{ color: '#c678dd' }}>const</code> <span style={{ color: '#e5c07b' }}>ImageTier</span> = <code style={{ color: '#56b6c2' }}>new</code> <span style={{ color: '#e5c07b' }}>Client</span>({`{\n`}
                        &nbsp;&nbsp;apiKey: <span style={{ color: '#98c379' }}>'it_live_x8F2...'</span>{`\n}`}
                        );{`\n\n`}
                        <code style={{ color: '#c678dd' }}>const</code> url = <span style={{ color: '#e5c07b' }}>ImageTier</span>.image(<span style={{ color: '#98c379' }}>'hero.jpg'</span>){`\n`}
                        &nbsp;&nbsp;.width(<span style={{ color: '#d19a66' }}>800</span>){`\n`}
                        &nbsp;&nbsp;.format(<span style={{ color: '#98c379' }}>'webp'</span>){`\n`}
                        &nbsp;&nbsp;.url();{`\n\n`}
                        <span style={{ color: '#5c6370', fontStyle: 'italic' }}>// Returns optimized CDN URL instantly</span>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export const SkeletonTwo = () => {
    const images = [
        "https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=300&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=300&auto=format&fit=crop",
    ];

    const imageVariants = {
        whileHover: { scale: 1.1, rotate: 0, zIndex: 100 },
        whileTap: { scale: 1.1, rotate: 0, zIndex: 100 },
    };

    return (
        <div className="bento-skeleton-two">
            <div className="bento-skeleton-two-row offset-row">
                {images.map((image, idx) => (
                    <motion.div
                        variants={imageVariants}
                        key={"images-first" + idx}
                        style={{ rotate: Math.random() * 20 - 10 }}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="bento-polaroid"
                    >
                        <img src={image} alt="gallery" loading="lazy" />
                    </motion.div>
                ))}
            </div>
            <div className="bento-skeleton-two-row">
                {images.map((image, idx) => (
                    <motion.div
                        key={"images-second" + idx}
                        style={{ rotate: Math.random() * 20 - 10 }}
                        variants={imageVariants}
                        whileHover="whileHover"
                        whileTap="whileTap"
                        className="bento-polaroid"
                    >
                        <img src={image} alt="gallery" loading="lazy" />
                    </motion.div>
                ))}
            </div>
            <div className="bento-gradient-left" />
            <div className="bento-gradient-right" />
        </div>
    );
};

export const SkeletonFour = () => {
    return (
        <div className="bento-skeleton-four">
            <Globe className="bento-globe" />
        </div>
    );
};

export const Globe = ({ className }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0,
            diffuse: 1.2,
            mapSamples: 4000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.545, 0.36, 0.96], /* Digital Lavender mapped approx to RGB array */
            glowColor: [1, 1, 1],
            markers: [
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            className={className}
        />
    );
};

export default FeaturesBento;
