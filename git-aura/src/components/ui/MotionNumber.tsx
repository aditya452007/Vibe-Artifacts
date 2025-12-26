'use client';

import { motion, useSpring, useTransform, useMotionValue, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

export const MotionNumber = ({ value }: { value: number }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        // Set initial value immediately to avoid hydration mismatch/blank space
        if (ref.current) {
            ref.current.textContent = Intl.NumberFormat('en-US').format(0);
        }
    }, []);

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat('en-US').format(Math.floor(latest));
            }
        });
    }, [springValue]);

    return <span ref={ref} className="tabular-nums" /> // Added tabular-nums for stable width
};
