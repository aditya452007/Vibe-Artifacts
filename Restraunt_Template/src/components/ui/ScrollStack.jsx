import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './ScrollStack.css';

gsap.registerPlugin(ScrollTrigger);

export const ScrollStackItem = ({ children, className = '' }) => {
    return (
        <div className={`scroll-stack-card ${className}`}>
            {children}
        </div>
    );
};

const ScrollStack = ({ children }) => {
    const containerRef = useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.scroll-stack-card');
        const totalCards = cards.length;

        // The animation logic:
        // Pin the container.
        // As we scroll, pull the next card up over the previous one.
        // We'll use a timeline that scrubs.

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: `+=${totalCards * 100}%`, // Scroll distance based on number of cards
            pin: true,
            scrub: 1, // Smooth interaction
            // markers: true, // For debugging, remove in production
            animation: gsap.timeline()
                .from(cards, {
                    yPercent: 120, // Start from below
                    stagger: 0.5, // Overlap timing
                    scale: 0.9,
                    ease: "power2.out",
                    duration: 1
                }, 0) // Animate all together but staggered
        });

        // Refined stacking effect manually to ensure they stick
        // Actually, a simpler "cards" approach for "stacking" is often:
        // Set all cards absolute. Pin container.
        // ScrollTrigger loops through cards and animates them in one by one.

        // Let's try the "Layered Pinning" approach for a cleaner stack
        cards.forEach((card, i) => {
            gsap.set(card, {
                zIndex: i + 1,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                yPercent: i === 0 ? 0 : 100 // First card visible, others below
            });

            // If it's the first card, it just stays there (or maybe fades in?)
            // Subsequent cards slide up.
            if (i !== 0) {
                gsap.to(card, {
                    yPercent: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: `top+=${i * 100}% top`, // Start staggering
                        end: `top+=${(i + 1) * 100}% top`,
                        scrub: true,
                        // markers: true
                    }
                });

                // Add a scale down effect to the PREVIOUS card to give depth
                gsap.to(cards[i - 1], {
                    scale: 0.95,
                    filter: "blur(5px)",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: `top+=${i * 100}% top`,
                        end: `top+=${(i + 1) * 100}% top`,
                        scrub: true
                    }
                });
            }
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="scroll-stack-container">
            <div className="scroll-stack-wrapper">
                {children}
            </div>
        </div>
    );
};

export default ScrollStack;
