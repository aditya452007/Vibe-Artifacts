"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SceneProps {
    index: number;
    image?: string;
    overline: string;
    headline: string;
    body: string;
    isLast?: boolean;
}

export function Scene({ index, image, overline, headline, body, isLast }: SceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.1, 0.4], [0.8, 1]);
    const y = useTransform(scrollYProgress, [0.1, 0.9], [50, -50]);

    return (
        <div
            ref={containerRef}
            className="relative flex h-screen w-full items-center justify-center snap-center"
        >
            <motion.div
                style={{ opacity, scale, y }}
                className="flex max-w-5xl flex-col items-center gap-12 px-6 md:flex-row md:justify-between"
            >
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <span className="text-sm font-bold uppercase tracking-widest text-[var(--accent)]">
                        {overline}
                    </span>
                    <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                        {headline}
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] md:text-xl">
                        {body}
                    </p>
                </div>
                <div className="flex-1">
                    <div className="aspect-square w-full rounded-2xl bg-[var(--surface)] shadow-2xl flex items-center justify-center overflow-hidden">
                        {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt={headline} className="object-cover w-full h-full" />
                        ) : (
                            <div className="text-[var(--text-secondary)]">
                                Placeholder for {headline}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
