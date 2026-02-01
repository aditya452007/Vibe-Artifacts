"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface StoryboardCanvasProps {
    currentStep: number;
    className?: string;
}

export function StoryboardCanvas({ currentStep, className }: StoryboardCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainContainerRef = useRef<HTMLDivElement>(null);

    // Refs for specific groups
    const step1Ref = useRef<HTMLDivElement>(null);
    const step2Ref = useRef<HTMLDivElement>(null);
    const step3Ref = useRef<HTMLDivElement>(null);
    const step4Ref = useRef<HTMLDivElement>(null);
    const step5Ref = useRef<HTMLDivElement>(null);

    // Asset paths - STRICT MAPPING
    const assets = {
        upload: "/images/3d send email.webp",
        imageGoing: "/images/image going.png",
        metadata: [
            "/images/location.webp",
            "/images/mobile contact.webp",
            "/images/mobile paytm.png",
            "/images/camera model.png"
        ],
        hacker: "/images/hacker.png",
        hacked: "/images/hacked.webp",
        // secure: "/images/secure.webp",
        gadget: "/images/gadget-security.webp",
        share: "/images/share.webp",
    };

    // Preload Critical Assets on Mount
    useEffect(() => {
        const preloadImage = (src: string) => {
            const img = new window.Image();
            img.src = src;
        };

        // Priority 1: Instant load for first step
        preloadImage(assets.upload);

        // Priority 2: Load others slightly delayed to unblock main thread
        const t = setTimeout(() => {
            preloadImage(assets.imageGoing);
            preloadImage(assets.hacker);
            preloadImage(assets.hacked);
            // preloadImage(assets.secure);
            preloadImage(assets.gadget);
            preloadImage(assets.share);
            assets.metadata.forEach(preloadImage);
        }, 100);

        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Initial setup - Hide all steps
            gsap.set([step1Ref.current, step2Ref.current, step3Ref.current, step4Ref.current, step5Ref.current], {
                autoAlpha: 0,
                display: "none"
            });

            // Universal heavy/premium floating animation
            gsap.to(".floating-element", {
                y: "random(-20, 20)",
                rotation: "random(-1.5, 1.5)",
                duration: "random(4, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            const tl = gsap.timeline({ defaults: { ease: "power3.inOut", duration: 1.5 } });

            switch (currentStep) {
                // =========================================
                // STEP 1: UPLOAD
                // Unified Golden Glow
                // =========================================
                case 0:
                    gsap.set(step1Ref.current, { display: "flex" });
                    tl.to(step1Ref.current, { autoAlpha: 1 })
                        .fromTo(".s1-hero",
                            { scale: 0.9, opacity: 0, y: 40 },
                            { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
                        )
                        .to(".gold-glow-1", { opacity: 0.6, scale: 1.1, duration: 2 }, "-=1");
                    break;

                // =========================================
                // STEP 2: TRAVEL
                // =========================================
                case 1:
                    gsap.set(step2Ref.current, { display: "flex" });
                    tl.to(step1Ref.current, { autoAlpha: 0, duration: 0.6 })
                        .set(step1Ref.current, { display: "none" })
                        .to(step2Ref.current, { autoAlpha: 1 })
                        .fromTo(".s2-hero", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1 })
                        .fromTo(".s2-meta",
                            { scale: 0.5, opacity: 0, x: -50 },
                            {
                                scale: 1,
                                opacity: 1,
                                x: 0,
                                stagger: 0.15,
                                ease: "back.out(1.2)"
                            },
                            "-=0.6"
                        );
                    break;

                // =========================================
                // STEP 3: HACKER
                // =========================================
                case 2:
                    gsap.set(step3Ref.current, { display: "flex" });
                    tl.to(step2Ref.current, { autoAlpha: 0, duration: 0.6 })
                        .set(step2Ref.current, { display: "none" })
                        .to(step3Ref.current, { autoAlpha: 1 })
                        .fromTo(".s3-hero", { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 1 })
                        .fromTo(".s3-victim", { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, "<")
                        .to(".gold-glow-3", { opacity: 0.7, scale: 1.1, duration: 0.8 });
                    break;

                // =========================================
                // STEP 4: PROTECTION
                // =========================================
                case 3:
                    gsap.set(step4Ref.current, { display: "flex" });
                    tl.to(step3Ref.current, { autoAlpha: 0, duration: 0.6 })
                        .set(step3Ref.current, { display: "none" })
                        .to(step4Ref.current, { autoAlpha: 1 })
                        .fromTo(".s4-hero", { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, ease: "power2.out" })
                        .fromTo(".s4-shield", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, ease: "elastic.out(1, 0.6)" }, "-=0.4")
                        .to(".gold-glow-4", { opacity: 0.6, duration: 0.6 });
                    break;

                // =========================================
                // STEP 5: SHARE
                // =========================================
                case 4:
                    gsap.set(step5Ref.current, { display: "flex" });
                    tl.to(step4Ref.current, { autoAlpha: 0, duration: 0.6 })
                        .set(step4Ref.current, { display: "none" })
                        .to(step5Ref.current, { autoAlpha: 1 })
                        .fromTo(".s5-hero-main", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" })
                        .fromTo(".s5-hero-share", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.8")
                        .to(".gold-glow-5", { opacity: 0.7, scale: 1.15, duration: 2.5, repeat: -1, yoyo: true });
                    break;
            }
        }, containerRef);
        return () => ctx.revert();
    }, [currentStep]);

    return (
        <div ref={containerRef} className={cn("relative w-full h-full flex items-center justify-center overflow-visible", className)}>

            <div ref={mainContainerRef} className="relative z-10 w-full h-full flex items-center justify-center">

                {/* STEP 1: UPLOAD */}
                <div ref={step1Ref} className="absolute inset-0 flex items-center justify-center">
                    {/* Golden Glow */}
                    <div className="gold-glow-1 absolute w-[650px] h-[650px] bg-[#F59E0B]/10 dark:bg-[#F59E0B]/5 blur-[120px] rounded-full opacity-0" />

                    <div className="relative w-[550px] h-[550px] lg:w-[600px] lg:h-[600px] floating-element s1-hero">
                        <Image
                            src={assets.upload}
                            alt="User Uploading"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* STEP 2: TRAVEL */}
                {/* Updated: Tighter Spacing. Main (Translate-X 10), Icons (Translate-X -10) */}
                <div ref={step2Ref} className="absolute inset-0 flex items-center justify-center">
                    {/* Golden Glow (Added for Step 2) */}
                    <div className="gold-glow-2 absolute w-[700px] h-[700px] bg-[#F59E0B]/15 blur-[120px] rounded-full" />

                    {/* Main Asset - Adjusted Closer to Center (translate-x-12 instead of 24) */}
                    <div className="relative w-[350px] h-[350px] floating-element s2-hero z-10 translate-x-12">
                        <Image
                            src={assets.imageGoing}
                            alt="Image Traveling"
                            fill
                            sizes="(max-width: 768px) 100vw, 350px"
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>
                    {/* Icons - Trailing Closer (translate-x-[-12] instead of -32) */}
                    <div className="absolute inset-0 flex items-center justify-center -translate-x-12">
                        {assets.metadata.map((src, i) => (
                            <div key={i} className="s2-meta absolute w-32 h-32 lg:w-40 lg:h-40 pointer-events-none z-20"
                                style={{
                                    top: `${10 + (i * 15)}%`,
                                    left: `${(i % 2 === 0 ? -60 : 20) + (i * 10)}px`, // Tighter horizontal spread
                                }}>
                                <Image
                                    src={src}
                                    alt="Metadata"
                                    fill
                                    sizes="160px"
                                    className="object-contain drop-shadow-xl"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* STEP 3: HACKER */}
                <div ref={step3Ref} className="absolute inset-0 flex items-center justify-center">
                    <div className="gold-glow-3 absolute w-[700px] h-[700px] bg-[#F59E0B]/20 blur-[130px] rounded-full opacity-0" />

                    <div className="relative flex items-center justify-center -space-x-12">
                        <div className="s3-victim relative w-[350px] h-[350px] lg:w-[400px] lg:h-[400px] floating-element z-10">
                            <Image
                                src={assets.hacked}
                                alt="Compromised Data"
                                fill
                                sizes="(max-width: 768px) 100vw, 400px"
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                        <div className="s3-hero relative w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] floating-element z-20">
                            <Image
                                src={assets.hacker}
                                alt="Hacker"
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>

                {/* STEP 4: PROTECTION */}
                <div ref={step4Ref} className="absolute inset-0 flex items-center justify-center">
                    <div className="gold-glow-4 absolute w-[700px] h-[700px] bg-[#F59E0B]/15 blur-[120px] rounded-full opacity-0" />

                    <div className="relative w-[600px] h-[600px] lg:w-[700px] lg:h-[700px] floating-element flex items-center justify-center s4-hero">
                        <Image
                            src={assets.gadget}
                            alt="Security Device"
                            fill
                            sizes="(max-width: 768px) 100vw, 700px"
                            className="object-contain z-10 drop-shadow-2xl opacity-90"
                        />
                        {/* <div className="s4-shield absolute w-32 h-32 lg:w-40 lg:h-40 z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Image
                                src={assets.secure}
                                alt="Shield"
                                fill
                                sizes="160px"
                                className="object-contain drop-shadow-2xl"
                            />
                        </div> */}
                    </div>
                </div>

                {/* STEP 5: SHARE */}
                <div ref={step5Ref} className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="gold-glow-5 absolute w-[700px] h-[700px] bg-[#FFD700]/15 blur-[100px] rounded-full opacity-0" />

                    {/* Main Image (Top) */}
                    <div className="relative w-[300px] h-[300px] lg:w-[350px] lg:h-[350px] floating-element z-10 s5-hero-main">
                        <Image
                            src={assets.imageGoing}
                            alt="Safe Image"
                            fill
                            sizes="(max-width: 768px) 100vw, 350px"
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Share Icon (Bottom) - Closer spacing (gap-4 above handles this) */}
                    <div className="relative w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] floating-element z-20 s5-hero-share">
                        <Image
                            src={assets.share}
                            alt="Shared Safely"
                            fill
                            sizes="(max-width: 768px) 100vw, 200px"
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
