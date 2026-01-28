import { useAnimate } from "framer-motion";
import React, { useRef } from "react";
import { FiMousePointer } from "react-icons/fi";
import { restaurantData } from "../data/restaurantData";

const galleryImages = restaurantData.gallery;

export default function ImageGallery() {
    return (
        <MouseImageTrail
            renderImageBuffer={50}
            rotationRange={25}
            images={galleryImages}
        >
            <section id="gallery" className="grid min-h-[100vh] py-32 w-full place-content-center bg-premium-off-white dark:bg-premium-dark transition-colors duration-500">
                <div className="flex flex-col items-center gap-4 text-center z-10 relative">
                    <span className="inline-block px-3 py-1 border border-red-200 rounded-full bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-medium tracking-wider uppercase font-sans">
                        Interactive Gallery
                    </span>
                    <p className="flex items-center gap-3 text-4xl md:text-7xl font-serif font-bold uppercase text-gray-900 dark:text-white tracking-tight">
                        <FiMousePointer className="text-red-600 animate-bounce" />
                        <span>Hover or Touch</span>
                    </p>
                    <p className="font-sans text-gray-500 dark:text-gray-400 text-lg max-w-md">
                        Move your cursor or finger across the screen to explore our culinary moments.
                    </p>
                </div>
            </section>
        </MouseImageTrail>
    );
};

const MouseImageTrail = ({
    children,
    // List of image sources
    images,
    // Will render a new image every X pixels between mouse moves
    renderImageBuffer,
    // images will be rotated at a random number between zero and rotationRange,
    // alternating between a positive and negative rotation
    rotationRange,
}) => {
    const [scope, animate] = useAnimate();

    const lastRenderPosition = useRef({ x: 0, y: 0 });
    const imageRenderCount = useRef(0);

    const handleInteraction = (clientX, clientY) => {
        const distance = calculateDistance(
            clientX,
            clientY,
            lastRenderPosition.current.x,
            lastRenderPosition.current.y
        );

        if (distance >= renderImageBuffer) {
            lastRenderPosition.current.x = clientX;
            lastRenderPosition.current.y = clientY;

            renderNextImage();
        }
    };

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        handleInteraction(clientX, clientY);
    };

    const handleTouchMove = (e) => {
        const { clientX, clientY } = e.touches[0];
        handleInteraction(clientX, clientY);
    };

    const calculateDistance = (x1, y1, x2, y2) => {
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;

        // Using the Pythagorean theorem to calculate the distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        return distance;
    };

    const renderNextImage = () => {
        const imageIndex = imageRenderCount.current % images.length;
        const selector = `[data-mouse-move-index="${imageIndex}"]`;

        const el = document.querySelector(selector);

        // We need to account for scroll position since clientX/Y are viewport relative
        // but absolute positioning might be affected by parents or layout.
        // Here, the images are absolute relative to the container `div` which has `relative`.
        // The mouse coordinates `clientX/Y` are relative to the viewport.
        // We should probably use `e.pageX/pageY` or subtract the container's offset if we want them strict to container,
        // but `clientX` works well if the container covers the screen or we use fixed.
        // The original code used `top/left` with `lastRenderPosition` (clientX/Y).
        // If the section is part of a scrolling page, we need to correct this.

        // Let's use `getBoundingClientRect` to get container offset relative to viewport
        const containerRect = scope.current.getBoundingClientRect();
        const relativeX = lastRenderPosition.current.x - containerRect.left;
        const relativeY = lastRenderPosition.current.y - containerRect.top;

        el.style.top = `${relativeY}px`;
        el.style.left = `${relativeX}px`;
        el.style.zIndex = imageRenderCount.current.toString();

        const rotation = Math.random() * rotationRange;

        animate(
            selector,
            {
                opacity: [0, 1],
                transform: [
                    `translate(-50%, -25%) scale(0.5) ${imageIndex % 2
                        ? `rotate(${rotation}deg)`
                        : `rotate(-${rotation}deg)`
                    }`,
                    `translate(-50%, -50%) scale(1) ${imageIndex % 2
                        ? `rotate(-${rotation}deg)`
                        : `rotate(${rotation}deg)`
                    }`,
                ],
            },
            { type: "spring", damping: 15, stiffness: 200 }
        );

        animate(
            selector,
            {
                opacity: [1, 0],
            },
            { ease: "linear", duration: 0.5, delay: 1.5 }
        );

        imageRenderCount.current = imageRenderCount.current + 1;
    };

    return (
        <div
            ref={scope}
            className="relative cursor-crosshair touch-none"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {children}

            {images.map((img, index) => (
                <img
                    className="pointer-events-none absolute left-0 top-0 w-auto rounded-xl border-4 border-white shadow-2xl object-cover opacity-0 h-48 md:h-64 lg:h-80"
                    src={img}
                    alt={`Mouse move image ${index}`}
                    key={index}
                    data-mouse-move-index={index}
                />
            ))}
        </div>
    );
};
