import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, ShieldCheck, PieChart, CreditCard, Trash2, Moon, Target, Star, Sprout, Image as ImageIcon } from 'lucide-react';
import { FeaturesBento } from '../components/FeaturesBento';
import { ChromaGrid } from '../components/ChromaGrid';
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
    { icon: <Rocket size={24} className="feature-icon" />, title: 'Blazing Fast CDN', desc: 'Images delivered via ImageKit global CDN in milliseconds.' },
    { icon: <ShieldCheck size={24} className="feature-icon" />, title: 'Secure by Default', desc: 'Firebase authentication with JWT tokens on every request.' },
    { icon: <PieChart size={24} className="feature-icon" />, title: 'Smart Quota', desc: 'Real-time upload quota tracking with tier-based limits.' },
    { icon: <CreditCard size={24} className="feature-icon" />, title: 'Easy Upgrades', desc: 'Seamless Razorpay payments — upgrade in seconds.' },
    { icon: <Trash2 size={24} className="feature-icon" />, title: 'Full Control', desc: 'Upload, view, and delete images with a single click.' },
    { icon: <Moon size={24} className="feature-icon" />, title: 'Dark Mode', desc: 'Premium dark mode that switches instantly and persists.' },
];

const PLANS = [
    { tier: 'Free', price: '₹0', period: 'forever', images: 10, cta: 'Get Started', link: '/signup', features: ['10 Images Included', 'Community Support', 'Standard CDN Speed'] },
    { tier: 'Premium', price: '₹99', period: '/mo', images: 100, cta: 'Start Premium', link: '/signup', popular: true, features: ['100 Images Included', 'Priority Email Support', 'Fastest Global CDN', 'On-the-fly transformations'] },
    { tier: 'Ultra', price: '₹499', period: '/mo', images: 1000, cta: 'Go Ultra', link: '/signup', features: ['1,000 Images Included', '24/7 Phone Support', 'Dedicated IP Address', 'Custom Domain support'] },
];

export default function LandingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const headlineRef = useRef(null);
    const ctaRef = useRef(null);
    const featureRefs = useRef([]);
    const pricingRefs = useRef([]);

    useEffect(() => {

        // Hero headline animation
        gsap.fromTo(
            headlineRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        gsap.fromTo(
            ctaRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.3 }
        );

        // Feature cards scroll animation
        featureRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                    delay: i * 0.1,
                }
            );
        });

        // Pricing card scroll animation (Now handled inside ChromaGrid or removed if redundant)
        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, [user, navigate]);

    return (
        <main className="landing">
            {/* Hero */}
            <section className="hero" ref={heroRef} id="landing-hero" style={{ position: 'relative', overflow: 'hidden', padding: '8rem 0 6rem' }}>
                {/* Parallax Background Grid */}
                <div className="hero__bg-grid" style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
                    backgroundSize: '40px 40px', opacity: 0.1, zIndex: 0
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                    <div ref={headlineRef} style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <span className="hero__tag" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-card)', border: '1px solid var(--color-glass-border)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '2rem' }}>
                            <ImageIcon size={16} style={{ marginRight: '8px', color: 'var(--color-primary)' }} />
                            Next-Gen Image Hosting
                        </span>

                        <h1 className="hero__title" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
                            Store & Deliver<br />
                            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Images at Scale
                            </span>
                        </h1>

                        <p className="hero__subtitle" style={{ fontSize: 'clamp(1.125rem, 2vw, 1.25rem)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                            ImageTier provides blazing-fast global delivery, smart quotas, and automatic optimizations for developers who demand perfection.
                        </p>
                    </div>

                    <div className="hero__ctas" ref={ctaRef} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '5rem' }}>
                        <Link to="/signup" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem' }}>
                            Start for Free
                        </Link>
                        <a href="#pricing" className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            View Pricing
                        </a>
                    </div>

                    {/* Lazy Loaded Hero Visuals */}
                    <div className="hero__visuals" style={{ width: '100%', maxWidth: '1000px', position: 'relative', height: '400px', margin: '0 auto' }}>
                        {/* Center Image */}
                        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '80%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-glow)', border: '1px solid var(--color-glass-border)', zIndex: 3 }}>
                            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="Abstract composition" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        </div>
                        {/* Left Floating Image */}
                        <div style={{ position: 'absolute', top: '20%', left: '0', width: '35%', height: '60%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-glass-border)', zIndex: 2, filter: 'blur(2px) brightness(0.8)' }}>
                            <img src="https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2670&auto=format&fit=crop" alt="UI Design" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        </div>
                        {/* Right Floating Image */}
                        <div style={{ position: 'absolute', top: '30%', right: '0', width: '30%', height: '50%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-glass-border)', zIndex: 1, filter: 'blur(3px) brightness(0.7)' }}>
                            <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2664&auto=format&fit=crop" alt="Architecture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section" id="landing-features" style={{ width: '100%', overflow: 'hidden' }}>
                <FeaturesBento />
            </section>

            {/* Pricing / Team (ChromaGrid) */}
            <section className="section pricing-section" id="pricing">
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <h2 className="section__title" style={{ textAlign: 'center', marginBottom: '1rem', background: 'var(--gradient-mocha)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Simple, honest pricing
                    </h2>
                    <p className="section__subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        No hidden fees. Designed for scale.
                    </p>
                    <ChromaGrid
                        columns={3}
                        rows={1}
                        items={PLANS.map(p => ({
                            title: p.tier,
                            subtitle: 'Ideal for getting started',
                            borderColor: p.popular ? 'var(--color-primary)' : 'var(--color-border)',
                            gradient: p.popular ? 'var(--gradient-primary)' : 'var(--gradient-card)',
                            handle: `${p.price}${p.period}`,
                            url: p.link,
                            cta: p.cta,
                            features: p.features
                        }))}
                    />
                </div>
            </section>

            {/* Why Choose Us - Facts Accordion */}
            <section className="section faq-section" id="landing-facts">
                <div className="container">
                    <h2 className="section__title">Why Choose ImageTier?</h2>
                    <p className="section__subtitle">Facts that make us better than the competition.</p>
                    <div className="faq-accordion">
                        <details className="faq-item">
                            <summary className="faq-title">1. Global Delivery Speed</summary>
                            <div className="faq-content">We utilize ImageKit's global CDN, meaning your images load in milliseconds, no matter where your users are. Our competitors struggle with latency we've already conquered.</div>
                        </details>
                        <details className="faq-item">
                            <summary className="faq-title">2. Bulletproof Security</summary>
                            <div className="faq-content">Every API request is secured with Firebase JWT authentication. Your private images are never exposed to the public internet without your explicit permission.</div>
                        </details>
                        <details className="faq-item">
                            <summary className="faq-title">3. True Value Pricing</summary>
                            <div className="faq-content">No hidden bandwidth overage fees. We price transparently based on image quotas. You get 10 images completely free, forever, to test our infrastructure.</div>
                        </details>
                        <details className="faq-item">
                            <summary className="faq-title">4. Real-time Transformations</summary>
                            <div className="faq-content">Resize, crop, and optimize images on-the-fly simply by tweaking the URL parameters. Deliver the perfect WebP or AVIF image to every device automatically.</div>
                        </details>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer" id="landing-footer">
                <div className="container">
                    <p><ImageIcon size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} /> <strong>ImageTier</strong> — Built with FastAPI + React + Firebase</p>
                    <p className="footer-sub">© {new Date().getFullYear()} ImageTier. A learning project.</p>
                </div>
            </footer>
        </main>
    );
}
