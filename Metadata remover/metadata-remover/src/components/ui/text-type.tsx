"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import './text-type.css';

export interface TextSegment {
    text: string;
    className?: string;
}

interface TextTypeProps {
    text: TextSegment[][]; // Array of sentences, where each sentence is an array of segments
    typingSpeed?: number;
    initialDelay?: number;
    pauseDuration?: number; // Time to wait after typing finishes before deleting
    deletingSpeed?: number;
    loop?: boolean;
    className?: string;
    showCursor?: boolean;
    hideCursorWhileTyping?: boolean;
    cursorCharacter?: string | React.ReactNode;
    cursorClassName?: string;
    cursorBlinkDuration?: number;
    onStepChange?: (stepIndex: number) => void;
    startOnVisible?: boolean;
    startIndex?: number;
    paused?: boolean;
    eraseOnComplete?: boolean;
}

const TextType = ({
    text,
    typingSpeed = 50,
    initialDelay = 0,
    pauseDuration = 2000,
    deletingSpeed = 30,
    loop = true,
    className = '',
    showCursor = true,
    hideCursorWhileTyping = false,
    cursorCharacter = '|',
    cursorClassName = '',
    cursorBlinkDuration = 0.5,
    onStepChange,
    startOnVisible = false,
    startIndex = 0,
    paused = false,
    eraseOnComplete = true,
}: TextTypeProps) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(startIndex);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisible, setIsVisible] = useState(!startOnVisible);

    const cursorRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Flatten the current sentence segments into a single string for valid typing logic check
    const currentSentenceSegments = useMemo(() => text[currentStepIndex] || [], [text, currentStepIndex]);
    const fullText = useMemo(() => currentSentenceSegments.map(s => s.text).join(''), [currentSentenceSegments]);

    useEffect(() => {
        if (!startOnVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [startOnVisible]);

    // Cursor Blinking Animation
    useEffect(() => {
        if (showCursor && cursorRef.current) {
            const ctx = gsap.context(() => {
                gsap.to(cursorRef.current, {
                    opacity: 0,
                    duration: cursorBlinkDuration,
                    repeat: -1,
                    yoyo: true,
                    ease: 'power2.inOut'
                });
            }, cursorRef);
            return () => ctx.revert();
        }
    }, [showCursor, cursorBlinkDuration]);

    // Typing Logic
    useEffect(() => {
        if (!isVisible || paused) return;

        let timeout: NodeJS.Timeout;

        const handleTyping = () => {
            // PHASE 1: DELETING
            if (isDeleting) {
                if (charIndex > 0) {
                    // Continue deleting
                    timeout = setTimeout(() => {
                        setCharIndex(prev => prev - 1);
                    }, deletingSpeed);
                } else {
                    // Finished deleting
                    setIsDeleting(false);

                    // Determine next step
                    let nextIndex = currentStepIndex + 1;
                    if (nextIndex >= text.length) {
                        if (!loop) return; // Stop if not looping
                        nextIndex = 0;
                    }

                    // Notify parent of step change
                    if (onStepChange) {
                        onStepChange(nextIndex);
                    }

                    setCurrentStepIndex(nextIndex);
                    // Wait a brief moment before starting to type new text
                    timeout = setTimeout(() => { }, 500);
                }
            }
            // PHASE 2: TYPING
            else {
                if (charIndex < fullText.length) {
                    // Continue typing
                    timeout = setTimeout(() => {
                        setCharIndex(prev => prev + 1);
                    }, typingSpeed);
                } else {
                    // Finished typing
                    if (eraseOnComplete) {
                        // Wait before deleting
                        timeout = setTimeout(() => {
                            setIsDeleting(true);
                        }, pauseDuration);
                    } else {
                        // Skip deleting, move to next step immediately after pause
                        timeout = setTimeout(() => {
                            let nextIndex = currentStepIndex + 1;
                            if (nextIndex >= text.length) {
                                if (!loop) return;
                                nextIndex = 0;
                            }

                            if (onStepChange) {
                                onStepChange(nextIndex);
                            }

                            setCurrentStepIndex(nextIndex);
                            setCharIndex(0); // Reset immediately for next step
                        }, pauseDuration);
                    }
                }
            }
        };

        timeout = setTimeout(handleTyping, 0);

        // Cleanup
        return () => clearTimeout(timeout);
    }, [
        charIndex,
        isDeleting,
        currentStepIndex,
        fullText,
        isVisible,
        typingSpeed,
        deletingSpeed,
        pauseDuration,
        loop,
        text.length,
        onStepChange,
        paused,
        eraseOnComplete
    ]);


    // Helper to render the partially typed text with correct styles
    const renderContent = () => {
        let remainingChars = charIndex;
        const output: React.ReactNode[] = [];

        for (let i = 0; i < currentSentenceSegments.length; i++) {
            const segment = currentSentenceSegments[i];
            if (remainingChars <= 0) break;

            const len = segment.text.length;
            if (remainingChars >= len) {
                // Render full segment
                output.push(
                    <span key={i} className={segment.className}>
                        {segment.text}
                    </span>
                );
                remainingChars -= len;
            } else {
                // Render partial segment
                output.push(
                    <span key={i} className={segment.className}>
                        {segment.text.slice(0, remainingChars)}
                    </span>
                );
                remainingChars = 0;
            }
        }
        return output;
    };

    const isTypingActive = !isDeleting && charIndex < fullText.length;
    const shouldHideCursor = hideCursorWhileTyping && isTypingActive;

    return (
        <div ref={containerRef} className={`text-type ${className}`}>
            <span className="text-type__content">
                {renderContent()}
            </span>
            {showCursor && (
                <span
                    ref={cursorRef}
                    className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''
                        }`}
                >
                    {cursorCharacter}
                </span>
            )}
        </div>
    );
};

export default TextType;
