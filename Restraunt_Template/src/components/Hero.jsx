import React, { useRef } from 'react';
import { Phone, MapPin } from 'lucide-react';
import { restaurantData } from '../data/restaurantData';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef(null);
    const bgImageRef = useRef(null);
    const heroContentRef = useRef(null);
    const initialTitleRef = useRef(null);

    useGSAP(() => {
        // Aggressively set initial state for Navbar
        const nav = document.querySelector('nav');
        if (nav) {
            // Ensure completely hidden initially
            gsap.set(nav, { opacity: 0, y: -20, pointerEvents: "none", visibility: "hidden" });
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=250%', // Increased scroll distance for more deliberate feel
                scrub: 1.5,
                pin: true,
                onUpdate: (self) => {
                    // Safety check: Keep nav hidden during the first 80% of the scroll
                    if (self.progress < 0.8 && nav) {
                        if (nav.style.opacity !== '0') {
                            gsap.set(nav, { opacity: 0, pointerEvents: "none", visibility: "hidden" });
                        }
                    }
                },
                onLeave: () => {
                    // Reveal nav only when leaving (fully scrolled)
                    if (nav) gsap.to(nav, { opacity: 1, y: 0, pointerEvents: "auto", visibility: "visible", duration: 0.5, ease: "power2.out" });
                },
                onEnterBack: () => {
                    // Hide nav immediately when going back into the hero animation
                    if (nav) gsap.to(nav, { opacity: 0, y: -20, pointerEvents: "none", visibility: "hidden", duration: 0.3 });
                }
            }
        });

        tl
            // 1. Fade out the initial title early
            .to(initialTitleRef.current, {
                opacity: 0,
                y: -50,
                duration: 0.5,
                ease: 'power2.in'
            })
            // 2. Expand the mask
            .to(bgImageRef.current, {
                maskSize: '400%',
                webkitMaskSize: '400%',
                ease: 'power2.inOut',
                duration: 2
            }, "-=0.2")
            // 3. Navbar reveal is handled mainly by onLeave/onEnterBack for robustness, 
            // but we can add a tween at the very end for scrub consistency just in case.
            // We'll leave it to the callbacks to ensure "until user scroll and reach hero section".

            // 4. Reveal content
            .fromTo(heroContentRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
                "-=0.5"
            );

    }, { scope: containerRef });

    return (
        <section id="home" ref={containerRef} className="relative h-screen w-full overflow-hidden bg-premium-off-white dark:bg-premium-dark transition-colors duration-500">

            {/* Background Image with Mask */}
            <div
                ref={bgImageRef}
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat masked-img"
                style={{ backgroundImage: `url('${restaurantData.hero.backgroundImage}')` }}
            >
                {/* Darker Overlay for better text contrast regardless of mode when revealed */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Container for Content */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center">

                {/* 
                  Initial State: "Welcome to restranut name"
                  VISIBILITY FIX:
                  - Light Mode: Text is Gray-900 but with a WHITE GLOW (drop-shadow) to pop off the dark mask if it overlaps.
                  - Dark Mode: Text is White with Dark Shadow.
                */}
                <div ref={initialTitleRef} className="text-left absolute z-20 top-20 md:top-1/3 left-6 md:left-12 w-full max-w-4xl pr-6">
                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold mb-4 leading-none transition-colors duration-300
                                   text-gray-900 dark:text-white
                                   drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
                        {restaurantData.hero.title} <br />
                        <span className="text-amber-600 dark:text-amber-400 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                            {restaurantData.hero.highlightedTitle}
                        </span>
                    </h1>
                </div>

                {/* 
                  Final State: Standard Hero Content
                  - Always white text (on dark image)
                */}
                <div ref={heroContentRef} className="text-left w-full max-w-3xl opacity-0 translate-y-10 mt-12 md:mt-0">

                    <div className="inline-block px-3 py-1 mb-6 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium tracking-wider uppercase">
                        {restaurantData.hero.established} • {restaurantData.theme.badge}
                    </div>

                    <h2 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                        {restaurantData.hero.subtitle}
                    </h2>

                    <p className="text-lg md:text-xl text-gray-200 mb-10 font-sans font-light max-w-lg leading-relaxed text-left border-l-4 border-amber-500 pl-6">
                        {restaurantData.hero.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-start">
                        <a
                            href={restaurantData.hero.ctaPrimary.link}
                            className="flex items-center justify-center gap-3 bg-amber-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-amber-900/20 hover:bg-amber-700 hover:-translate-y-1 transition-all duration-300 font-sans group"
                        >
                            <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span>{restaurantData.hero.ctaPrimary.text}</span>
                        </a>

                        <a
                            href={restaurantData.hero.ctaSecondary.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-black transition-all duration-300 font-sans group"
                        >
                            <MapPin className="w-5 h-5 group-hover:bounce-subtle" />
                            <span>{restaurantData.hero.ctaSecondary.text}</span>
                        </a>
                    </div>
                </div>

            </div>
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block z-30 pointer-events-none">
                <div className="w-6 h-10 border-2 border-gray-400/30 dark:border-white/30 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-1.5 bg-gray-600 dark:bg-white rounded-full animate-scroll-dot"></div>
                </div>
            </div>
        </section>
    );
}
