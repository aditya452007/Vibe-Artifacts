"use client";

import { useEffect, useRef, useMemo, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './scroll-reveal.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
    children: string;
    scrollContainerRef?: RefObject<HTMLElement | null>;
    enableBlur?: boolean;
    baseOpacity?: number;
    baseRotation?: number;
    blurStrength?: number;
    containerClassName?: string;
    textClassName?: string;
    rotationEnd?: string;
    wordAnimationEnd?: string;
    textRef?: RefObject<HTMLElement | null> | null;
    highlightWord?: string;
    highlightClass?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
}

const ScrollReveal = ({
    children,
    scrollContainerRef,
    enableBlur = true,
    baseOpacity = 0.1,
    baseRotation = 3,
    blurStrength = 4,
    containerClassName = '',
    textClassName = '',
    rotationEnd = 'bottom bottom',
    wordAnimationEnd = 'bottom bottom',
    highlightWord,
    highlightClass = '',
    as: Tag = 'h2'
}: ScrollRevealProps) => {
    const containerRef = useRef<HTMLElement>(null);

    const splitText = useMemo(() => {
        const text = typeof children === 'string' ? children : '';
        return text.split(/(\s+)/).map((word, index) => {
            if (word.match(/^\s+$/)) return word;

            const isHighlighted = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());

            return (
                <span className={`word inline-block ${isHighlighted ? highlightClass : ''}`} key={index}>
                    {word}
                </span>
            );
        });
    }, [children, highlightWord, highlightClass]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const scroller = scrollContainerRef?.current || window;

        // cleanup any previous triggers
        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { transformOrigin: '0% 50%', rotate: baseRotation },
                {
                    ease: 'none',
                    rotate: 0,
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom',
                        end: rotationEnd,
                        scrub: true,
                    }
                }
            );

            const wordElements = el.querySelectorAll('.word');

            gsap.fromTo(
                wordElements,
                { opacity: baseOpacity, willChange: 'opacity, filter' } as any,
                {
                    ease: 'none',
                    opacity: 1,
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: 'top bottom-=20%',
                        end: wordAnimationEnd,
                        scrub: true,
                    }
                }
            );

            if (enableBlur) {
                gsap.fromTo(
                    wordElements,
                    { filter: `blur(${blurStrength}px)` },
                    {
                        ease: 'none',
                        filter: 'blur(0px)',
                        stagger: 0.05,
                        scrollTrigger: {
                            trigger: el,
                            scroller,
                            start: 'top bottom-=20%',
                            end: wordAnimationEnd,
                            scrub: true,
                        }
                    }
                );
            }
        }, el);

        return () => ctx.revert();
    }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

    return (
        <Tag ref={containerRef as any} className={`scroll-reveal ${containerClassName} ${textClassName}`}>
            {splitText}
        </Tag>
    );
};

export default ScrollReveal;
