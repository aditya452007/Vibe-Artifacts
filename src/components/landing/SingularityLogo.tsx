'use client';

import { motion, Variants } from 'motion/react';
import { useEffect, useState } from 'react';

const singularityVariants: Variants = {
    stable: {
        scale: 1,
        filter: "blur(0px)",
        opacity: 1,
        y: [0, -10, 0], // Gentle float
        transition: { y: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } }
    },
    destroy: {
        scale: [1, 1.1, 0], // Slight expansion before collapse
        rotate: 180,
        filter: ["blur(0px)", "blur(2px)", "blur(20px)"], // Dissolve into fuzz
        opacity: [1, 1, 0],
        transition: { duration: 0.8, ease: "circIn" as const } // Fast, violent collapse
    },
    reconstruct: {
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        opacity: 1,
        transition: { type: "spring", stiffness: 200, damping: 15 } // Apple-smooth snap back
    }
};

export default function SingularityLogo() {
    const [animationState, setAnimationState] = useState("stable");

    useEffect(() => {
        const loop = async () => {
            // Wait for 4-6 seconds before triggering
            const randomDelay = Math.random() * 2000 + 4000;
            await new Promise(r => setTimeout(r, randomDelay));

            // Phase 1: Destruction
            setAnimationState("destroy");

            // Wait for destruction to finish (0.8s) + Void State (0.2s)
            await new Promise(r => setTimeout(r, 1000));

            // Phase 2: Reconstruct
            setAnimationState("reconstruct");

            // Go back to stable float after reconstruction settles
            await new Promise(r => setTimeout(r, 1000));
            setAnimationState("stable");

            // Recurse
            loop();
        };

        const timer = setTimeout(loop, 1000); // Start cycle
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* The Event Horizon (Glow behind) */}
            <motion.div
                className="absolute inset-0 bg-white/5 blur-3xl rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                variants={singularityVariants}
                animate={animationState}
                className="relative z-10 text-[var(--foreground)] transition-colors duration-500"
            >
                <svg height="120" viewBox="0 0 16 16" version="1.1" width="120" aria-hidden="true" fill="currentColor">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.46-1.61.65-2.33-.08-.3-.41-.9-1.35-1.53-1.35-.6 0-.08.38.03.53.2.19.63.63 1.08 1.9.36 1.25 1.55 1.71 2.37 1.58.05 1.08.02 1.92.02 2.14 0 .21-.15.46-.55.38A8.013 8.013 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
            </motion.div>
        </div>
    );
}
